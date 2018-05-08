import React from 'react';
import { observer } from 'mobx-react/native';
import { View, SectionList } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ContactsPlaceholder from './contacts-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import ContactItem from './contact-item';
import ContactSectionHeader from './contact-section-header';
import ChannelListItem from '../messaging/channel-list-item';
import contactState from './contact-state';
import chatState from '../messaging/chat-state';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import Center from '../controls/center';
import Text from '../controls/custom-text';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactListModal extends SafeComponent {
    dataSource = [];
    @observable refreshing = false;

    get data() { return contactState.store.contacts; }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        contactState.store.uiViewFilter = 'all';
        this.reaction = reaction(() => [
            this.data,
            this.data.length,
            contactState.store.uiView,
            contactState.store.addedContacts
        ], () => {
            // console.log(contactState.store.uiView.length);
            console.log(`contact-list.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = [];
            const { uiView, contacts } = contactState.store;
            this.dataSource = uiView.map(({ letter, items }) => {
                return ({ data: items.slice(), key: letter });
            });
            this.dataSource.unshift({ data: [], key: `All (${contacts.length})` });
            const { channels } = chatState.store;
            this.dataSource.unshift({ data: channels, key: `Rooms (${channels.length})` });
            // this.dataSource.unshift({ data: addedContacts.slice(), key: `${tx('title_favoriteContacts')} (${addedContacts.length})` });
            this.forceUpdate();
        }, true);
    }

    item = ({ item }) => {
        const onPress = () => this.props.action(item);
        return item.isChannel ?
            <ChannelListItem chat={item} onPress={onPress} /> :
            <ContactItem contact={item} onPress={onPress} />;
    };

    header({ section: /* data, */ { key } }) {
        return <ContactSectionHeader key={key} title={key} />;
    }

    listView() {
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.username || item.email || item.id}
                renderItem={this.item}
                renderSectionHeader={this.header}
            />
        );
    }

    get contactListComponent() {
        return !contactState.empty ?
            this.listView() : !contactState.store.loading && <ContactsPlaceholder />;
    }

    get exitRow() {
        const container = {
            flexDirection: 'row',
            alignItems: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: vars.statusBarHeight,
            paddingBottom: 0,
            backgroundColor: vars.white
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: vars.font.size.normal,
            color: 'rgba(0, 0, 0, .54)'
        };
        return (
            <View style={container}>
                {icons.dark('close', this.props.onExit)}
                <Center style={style}><Text semibold style={textStyle}>{this.props.title}</Text></Center>
                {icons.placeholder()}
            </View>
        );
    }

    renderThrow() {
        return (
            <View
                style={{ flex: 1, backgroundColor: vars.lightGrayBg }}>
                {this.exitRow}
                <View style={{ flex: 1 }}>
                    {this.contactListComponent}
                </View>
                <ProgressOverlay enabled={contactState.store.loading} />
            </View>
        );
    }
}
