import React from 'react';
import { observer } from 'mobx-react/native';
import { View, LayoutAnimation, SectionList } from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import { observable, reaction, action, computed } from 'mobx';
import { chatInviteStore, chatStore } from '../../lib/icebear';
import SafeComponent from '../shared/safe-component';
import ChatZeroStatePlaceholder from './chat-zero-state-placeholder';
import ChatListItem from './chat-list-item';
import ChannelListItem from './channel-list-item';
import ProgressOverlay from '../shared/progress-overlay';
import chatState from './chat-state';
import ChatSectionHeader from './chat-section-header';
import ChannelInviteListItem from './channel-invite-list-item';
import PlusBorderIcon from '../layout/plus-border-icon';
import CreateActionSheet from './create-action-sheet';
import { tx } from '../utils/translator';
import uiState from '../layout/ui-state';
// import { scrollHelper } from '../helpers/test-helper';
import UnreadMessageIndicator from './unread-message-indicator';
import { vars } from '../../styles/styles';

const INITIAL_LIST_SIZE = 10;

const viewabilityConfig = {
    viewAreaCoveragePercentThreshold: 100
};

// action sheet is outside of component scope for a reason.
let actionSheet = null;

@observer
export default class ChatList extends SafeComponent {
    constructor(props) {
        super(props);
        this.dataSource = [];
    }

    dataSource = null;
    @observable reverseRoomSorting = false;
    @observable minSectionIndex = null;
    @observable minItemIndex = null;
    @observable maxSectionIndex = null;
    @observable maxItemIndex = null;

    get rightIcon() {
        return (<PlusBorderIcon
            action={() => actionSheet.show()}
            testID="buttonCreateNewChat" />);
    }

    get dataSource() {
        return [
            // all channels and invites
            { title: 'title_channels', index: 0, data: this.firstSectionItems },
            // all dms
            { title: 'title_directMessages', index: 1, data: this.secondSectionItems },
            { title: 'dummy', data: [], index: 2 }
        ];
    }

    @computed get firstSectionItems() {
        const allChannels = chatInviteStore.received.concat(
            chatStore.channels);
        allChannels.sort((a, b) => {
            const first = (a.name || a.channelName).toLocaleLowerCase();
            const second = (b.name || b.channelName).toLocaleLowerCase();
            const result = first.localeCompare(second);
            return this.reverseRoomSorting ? !result : result;
        });
        return allChannels;
    }

    @computed get secondSectionItems() {
        return chatState.store.chats.filter(d => !d.isChannel).slice();
    }

    componentDidMount() {
        uiState.testAction1 = () => {
            this.reverseRoomSorting = !this.reverseRoomSorting;
        };

        this.indicatorReaction = reaction(() => [
            this.topIndicatorVisible,
            this.bottomIndicatorVisible
        ], () => {
            LayoutAnimation.easeInEaseOut();
        }, true);
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
        this.indicatorReaction && this.indicatorReaction();
        this.indicatorReaction = null;
    }

    sectionHeader = (item) => {
        const { data, title } = item.section;
        const i = (t, component) => {
            const r = {};
            r[t] = component;
            return r;
        };
        const titles = {
            ...i('title_channels',
                <ChatSectionHeader state="collapseChannels" title={tx('title_channels')} />),
            ...i('title_directMessages',
                <ChatSectionHeader state="collapseDMs" title={tx('title_directMessages')} />),
            ...i('dummy', <View />)
        };
        return data && data.length ? titles[title] : null;
    };

    keyExtractor(item) {
        return item.kegDbId || item.id || item.title;
    }

    item = (item) => {
        const chat = item.item;
        if (chat.kegDbId) {
            return (
                <ChannelInviteListItem
                    id={chat.kegDbId}
                    channelName={chat.channelName}
                    username={chat.username} />
            );
        }
        if (!chat.id) return null;
        else if (chat.isChannel) {
            return <ChannelListItem chat={chat} />;
        }
        return <ChatListItem key={chat.id} chat={chat} />;
    };

    @action.bound scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
    }

    actionSheetRef = (ref) => { actionSheet = ref; };

    @computed get firstUnreadItemPosition() {
        for (const { data, index } of this.dataSource) {
            const itemIndex = data.findIndex(f => !!f.unreadCount);
            if (itemIndex !== -1) return { section: index, index: itemIndex };
        }
        return null;
    }

    @computed get lastUnreadItemPosition() {
        for (let j = this.dataSource.length - 1; j >= 0; --j) {
            const { data, index } = this.dataSource[j];
            for (let i = data.length - 1; i >= 0; --i) {
                if (data[i].unreadCount) return { section: index, index: i };
            }
        }
        return null;
    }

    @computed get topIndicatorVisible() {
        // if view hasn't been updated with viewable range
        if (this.minSectionIndex === null) return false;
        const pos = this.firstUnreadItemPosition;
        if (!pos) return false;
        if (pos.section < this.minSectionIndex) return true;
        if (pos.section === this.minSectionIndex) return pos.index < this.minItemIndex - 1;
        return false;
    }

    @computed get bottomIndicatorVisible() {
        // if view hasn't been updated with viewable range
        if (this.maxSectionIndex === null) return false;
        const pos = this.lastUnreadItemPosition;
        if (!pos) return false;
        if (pos.section > this.maxSectionIndex) return true;
        if (pos.section === this.maxSectionIndex) return pos.index >= this.maxItemIndex;
        return false;
    }

    /**
     * Scrolls to the topmost unread item in the list
     */
    @action.bound scrollUpToUnread() {
        const pos = this.firstUnreadItemPosition;
        if (!pos) return;
        this.scrollView.scrollToLocation({
            itemIndex: pos.index,
            sectionIndex: pos.section,
            viewPosition: 0
        });
    }

    /**
     * Scrolls to the bottommost unread item in the list
     */
    @action.bound scrollDownToUnread() {
        const pos = this.lastUnreadItemPosition;
        if (!pos) return;
        this.scrollView.scrollToLocation({
            itemIndex: pos.index + 1,
            sectionIndex: pos.section,
            viewPosition: 1
        });
    }

    /**
     * Whenever there is a scroll event which changes viewable items
     * This property handler gets called
     * @param {*} data
     */
    @action.bound onViewableItemsChanged(data) {
        let minSectionIndex = Number.MAX_SAFE_INTEGER;
        let minItemIndex = Number.MAX_SAFE_INTEGER;
        let maxSectionIndex = -1;
        let maxItemIndex = -1;
        data.viewableItems.forEach(i => {
            const itemIndex = i.index;
            const sectionIndex = i.section.index;
            if (sectionIndex < minSectionIndex
                || (sectionIndex === minSectionIndex && itemIndex < minItemIndex)) {
                minSectionIndex = sectionIndex;
                // section headers have zero item index so there's a workaround
                minItemIndex = itemIndex || 0;
            }
            if (sectionIndex > maxSectionIndex
                || (sectionIndex === maxSectionIndex && itemIndex > maxItemIndex)) {
                maxSectionIndex = sectionIndex;
                // section headers have zero item index so there's a workaround
                maxItemIndex = itemIndex || 0;
            }
        });
        Object.assign(this, { minSectionIndex, minItemIndex, maxSectionIndex, maxItemIndex });
    }

    getItemLayout = sectionListGetItemLayout({
        // first section is channels
        // second section is DMs
        getItemHeight: (rowData, sectionIndex /* , rowIndex */) => sectionIndex === 0 ?
            vars.chatListItemHeight : vars.chatListItemDMHeight,
        getSectionHeaderHeight: () => vars.chatListItemHeight
    });

    listView() {
        if (chatState.routerMain.currentIndex !== 0) return null;
        return (
            <SectionList
                style={{ flexGrow: 1 }}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                renderItem={this.item}
                renderSectionHeader={this.sectionHeader}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={20}
                enableEmptySections
                ref={this.scrollViewRef}
                onViewableItemsChanged={this.onViewableItemsChanged}
                getItemLayout={this.getItemLayout}
                stickySectionHeadersEnabled={false}
                keyExtractor={this.keyExtractor}
                viewabilityConfig={viewabilityConfig}
                // {...scrollHelper} TODO removed temporarily because it breaks unread message indicator
            />
        );
    }

    renderThrow() {
        const body = ((chatStore.chats.length || chatInviteStore.received.length) && chatState.store.loaded) ?
            this.listView() : <ChatZeroStatePlaceholder />;

        return (
            <View style={{ flexGrow: 1, flex: 1 }}>
                <View style={{ flexGrow: 1, flex: 1 }}>
                    {body}
                </View>
                {this.topIndicatorVisible && <UnreadMessageIndicator isAlignedTop action={this.scrollUpToUnread} />}
                {this.bottomIndicatorVisible && <UnreadMessageIndicator action={this.scrollDownToUnread} />}
                <CreateActionSheet ref={this.actionSheetRef} />
                <ProgressOverlay enabled={chatState.store.loading} />
            </View>
        );
    }
}
