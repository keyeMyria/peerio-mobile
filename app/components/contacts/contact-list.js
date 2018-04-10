import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, SectionList } from 'react-native';
import { observable, reaction, action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import ContactsPlaceholder from './contacts-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import ContactItem from './contact-item';
import ContactSectionHeader from './contact-section-header';
import contactState from './contact-state';
import PlusBorderIcon from '../layout/plus-border-icon';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import uiState from '../layout/ui-state';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactList extends SafeComponent {
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
            contactState.routerMain.route === 'contacts',
            contactState.routerMain.currentIndex === 0,
            this.data,
            this.data.length,
            contactState.store.uiView,
            contactState.store.invitedContacts,
            contactState.store.addedContacts
        ], () => {
            // console.log(contactState.store.uiView.length);
            console.log(`contact-list.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = [];
            const { addedContacts, invitedContacts, uiView, contacts } = contactState.store;
            this.dataSource = uiView.map(({ letter, items }) => {
                return ({ data: items.slice(), key: letter });
            });
            this.dataSource.unshift({ data: [], key: `All (${contacts.length})` });
            this.dataSource.unshift({ data: addedContacts.slice(), key: `${tx('title_favoriteContacts')} (${addedContacts.length})` });
            this.dataSource.push({ data: invitedContacts.slice(), key: `${tx('title_invitedContacts')} (${invitedContacts.length})` });
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

    @action.bound scrollViewRef(sv) {
        this.scrollView = sv;
        uiState.currentScrollView = sv;
    }

    listView() {
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.username || item.email}
                renderItem={this.item}
                renderSectionHeader={this.header}
                ref={this.scrollViewRef}
            />
        );
    }

    get rightIcon() { return <PlusBorderIcon action={contactState.fabAction} testID="addContactButton" />; }

    get contactListComponent() {
        return !contactState.empty ?
            this.listView() : !contactState.store.loading && <ContactsPlaceholder />;
    }

    renderThrow() {
        return (
            <View
                style={{ flex: 1, backgroundColor: vars.lightGrayBg }}>
                <View style={{ flex: 1 }}>
                    {this.contactListComponent}
                </View>
                <ProgressOverlay enabled={contactState.store.loading} />
            </View>
        );
    }
}

ContactList.propTypes = {
    store: PropTypes.any
};
