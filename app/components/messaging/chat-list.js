import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView } from 'react-native';
import { observable, reaction, action } from 'mobx';
import { chatInviteStore, chatNotifier } from '../../lib/icebear';
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
import { scrollHelper } from '../helpers/test-helper';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

// action sheet is outside of component scope for a reason.
let actionSheet = null;

@observer
export default class ChatList extends SafeComponent {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2,
            sectionHeaderHasChanged: (r1, r2) => r1 !== r2
        });
    }

    @observable dataSource = null;
    @observable refreshing = false;
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;
    @observable collapsible = true;
    @observable reverseRoomSorting = false;

    get rightIcon() {
        return (<PlusBorderIcon
            action={() => actionSheet.show()}
            testID="buttonCreateNewChat" />);
    }

    get data() {
        return chatState.store.chats;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        uiState.testAction1 = () => {
            this.reverseRoomSorting = !this.reverseRoomSorting;
        };

        this.reaction = reaction(() => [
            chatState.routerMain.route === 'chats',
            chatState.routerMain.currentIndex === 0,
            chatInviteStore.received,
            chatInviteStore.received.length,
            this.data,
            this.data.length,
            this.maxLoadedIndex,
            this.reverseRoomSorting
        ], () => {
            const channels = this.data.filter(d => !!d.isChannel);
            const allChannels = chatNotifier.allRooms;
            const dms = this.data.filter(d => !d.isChannel).slice(0, this.maxLoadedIndex);
            this.dataSource = this.dataSource.cloneWithRowsAndSections({
                title_channels: allChannels,
                title_directMessages: dms,
                dummy: []
            });
            this.collapsible = !(channels.length === 0 ^ dms.length === 0);
            this.forceUpdate();
        }, true);
    }

    sectionHeader = (data, key) => {
        const i = (title, component) => {
            const r = {};
            r[title] = component;
            return r;
        };
        const titles = {
            ...i('title_channels',
                <ChatSectionHeader state="collapseChannels" title={tx('title_channels')} />),
            ...i('title_directMessages',
                <ChatSectionHeader state="collapseDMs" title={tx('title_directMessages')} />),
            ...i('dummy', <View />)
        };
        return data && data.length ? titles[key] : null;
    };

    item = (chat) => {
        if (chat.kegDbId) {
            return (
                <ChannelInviteListItem
                    id={chat.kegDbId}
                    channelName={chat.channelName}
                    username={chat.username}
                />);
        }
        if (!chat.id) return null;
        else if (chat.isChannel) {
            return <ChannelListItem chat={chat} />;
        }
        return <ChatListItem key={chat.id} chat={chat} />;
    };

    onEndReached = () => {
        console.log('chat-list.js: on end reached');
        this.maxLoadedIndex += PAGE_SIZE;
    };

    @action.bound scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
    }

    listView() {
        if (chatState.routerMain.currentIndex !== 0) return null;
        return (
            <ListView
                style={{ flexGrow: 1 }}
                initialListSize={INITIAL_LIST_SIZE}
                pageSize={PAGE_SIZE}
                dataSource={this.dataSource}
                renderRow={this.item}
                renderSectionHeader={this.sectionHeader}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={20}
                onContentSizeChange={this.scroll}
                enableEmptySections
                ref={this.scrollViewRef}
                {...scrollHelper}
            />
        );
    }

    renderThrow() {
        const body = ((this.data.length || chatInviteStore.received.length) && chatState.store.loaded) ?
            this.listView() : <ChatZeroStatePlaceholder />;

        return (
            <View
                style={{ flexGrow: 1, flex: 1 }}>
                <View style={{ flexGrow: 1, flex: 1 }}>
                    {body}
                </View>
                <CreateActionSheet ref={(sheet) => { actionSheet = sheet; }} />
                <ProgressOverlay enabled={chatState.store.loading} />
            </View>
        );
    }
}
