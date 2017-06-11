import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, SectionList, Text } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import ContactsPlaceholder from './contacts-placeholder';
import ContactsGroups, { groupSettings } from './contacts-groups';
import ProgressOverlay from '../shared/progress-overlay';
import ContactItem from './contact-item';
import ContactSectionHeader from './contact-section-header';
import contactState from './contact-state';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactList extends SafeComponent {
    dataSource = [];
    /* 'list', 'groups' */
    @observable mode = 'list';
    @observable refreshing = false

    groupsIcon(disabled) {
        return buttons.uppercaseWhiteButton('Groups', () => (this.mode = 'groups'), disabled);
    }

    doneIcon(disabled) {
        return buttons.uppercaseWhiteButton('Done', () => (this.mode = 'list'), disabled);
    }

    get leftIcon() {
        return this.mode === 'list' ? this.groupsIcon() : this.doneIcon();
    }

    get rightIcon() {
        return this.mode === 'list' ? this.groupsIcon(true) : this.doneIcon(true);
    }

    get data() { return contactState.store.contacts; }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        contactState.store.uiViewFilter = 'all';
        this.reaction = reaction(() => [
            contactState.routerMain.route === 'contacts',
            contactState.routerMain.currentIndex === 0,
            this.data,
            this.data.length,
            contactState.store.uiView,
            contactState.store.invitedContacts,
            contactState.store.addedContacts,
            groupSettings.invited,
            groupSettings.all,
            groupSettings.favorites
        ], () => {
            // console.log(contactState.store.uiView.length);
            console.log(`contact-list.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = [];
            const { addedContacts, invitedContacts, uiView, contacts } = contactState.store;
            if (groupSettings.all) {
                this.dataSource = uiView.map(({ letter, items }) => {
                    return ({ data: items.slice(), key: letter });
                });
                this.dataSource.unshift({ data: addedContacts, key: `All (${contacts.length})` });
            }
            groupSettings.favorites &&
                this.dataSource.unshift({ data: addedContacts, key: `Favorites (${addedContacts.length})` });
            groupSettings.invited &&
                this.dataSource.push({ data: invitedContacts, key: `Invited (${invitedContacts.length})` });
            this.forceUpdate();
        }, true);
    }

    item({ item }) {
        return (
            <ContactItem contact={item} />
        );
    }

    header({ section: /* data, */ { key } }) {
        return <ContactSectionHeader key={key} title={key} />;
    }

    listView() {
        const { all, invited, favorites } = groupSettings;
        if (!all && !invited && !favorites) return <View><Text>No groups are selected</Text></View>;
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.username}
                renderItem={this.item}
                renderSectionHeader={this.header}
                ref={sv => (this.scrollView = sv)}
            />
        );
    }

    get isFabVisible() { return true; }

    get contactListComponent() {
        return !contactState.empty ?
            this.listView() : !contactState.store.loading && <ContactsPlaceholder />;
    }

    renderThrow() {
        const component = (this.mode === 'groups') ? <ContactsGroups /> : this.contactListComponent;
        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {component}
                </View>
                <ProgressOverlay enabled={contactState.store.loading} />
            </View>
        );
    }
}

ContactList.propTypes = {
    store: PropTypes.any
};