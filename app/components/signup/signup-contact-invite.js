import React from 'react';
import { observer } from 'mobx-react/native';
import { View, FlatList } from 'react-native';
import { observable, action, computed } from 'mobx';
import ActivityOverlay from '../controls/activity-overlay';
import { headerContainer, textStyle, skipButtonStyle, listHeader, textListTitle, footerContainer, container } from '../../styles/signup-contact-sync';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import contactState from '../contacts/contact-state';
import signupState from '../signup/signup-state';
import LoginWizardPage from '../login/login-wizard-page';
import ContactImportItem from '../contacts/contact-import-item';
import { popupOkCancel } from '../shared/popups';
import snackbarState from '../snackbars/snackbar-state';
import SearchBar from '../controls/search-bar';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import uiState from '../layout/ui-state';
import ListItem from './signup-contact-list-item';
import Text from '../controls/custom-text';

const _ = require('lodash');
const iconClear = require('../../assets/file_icons/ic_close.png');

const INITIAL_LIST_SIZE = 10;

@observer
export default class SignupContactInvite extends LoginWizardPage {
    get useLayout2() { return true; }
    @observable contactList = [];
    @observable searchBarValue = '';
    @observable refresh = 0;
    @observable inProgress = false;

    @computed get selectedContacts() {
        return this.contactList.filter(item => item.selected);
    }

    @computed get selectedEmails() {
        const selectedEmails = [];
        this.contactList.forEach(listItem => {
            if (listItem.selected) selectedEmails.push(listItem.contact.username);
        });
        return selectedEmails;
    }

    async componentDidMount() {
        this.inProgress = true;
        try {
            const phoneContacts = await contactState.getPhoneContactEmails();
            console.log(`got plugin info`);
            await this.getNonPeerioContacts(phoneContacts);
            console.log(`got contact list`);
        } catch (e) {
            console.error(e);
        }
        this.inProgress = false;
    }

    /**
     * TODO Use bulk operation
     * Fills this.contactList with phone contacts who are not on Peerio
     * @param {array} phoneContacts
     */
    @action getNonPeerioContacts(phoneContacts) {
        const promises = [];
        phoneContacts.forEach(c => {
            promises.push((async () => {
                try {
                    const contact = await contactState.resolveAndCache(c.email);
                    if (contact.notFound) {
                        const listItem = new ListItem(contact, c.fullName, true);
                        listItem.visible = true;
                        this.contactList.push(listItem);
                        this.refreshList();
                    }
                } catch (e) {
                    console.error(e);
                }
            })());
        });
        return Promise.all(promises);
    }

    @action.bound skip() {
        const contactsAdded = contactState.store.addedContacts.length;
        if (contactsAdded) {
            snackbarState.pushTemporary(tx('title_contactsAdded', { contactsAdded }));
        }
        signupState.finishSignUp();
    }

    @action.bound onChangeSearchBarText(text) {
        this.searchBarValue = text.trim();
        if (this._searchTimeout) {
            clearTimeout(this._searchTimeout);
            this._searchTimeout = null;
        }
        if (!this.searchBarValue) {
            this.clearSearch();
            return;
        }
        this._searchTimeout = setTimeout(() => this.filter(text), 500);
    }

    @action.bound clearSearch() {
        this.searchBarValue = '';
        this.contactList.forEach((listItem, i, contactList) => {
            contactList[i].visible = true;
        });
        this.refreshList();
    }

    @action.bound filter(query) {
        const regex = new RegExp(_.escapeRegExp(query), 'i');
        this.contactList.forEach(listItem => {
            const { username } = listItem.contact;
            listItem.visible = regex.test(username); // test for matching
        });
        this.refreshList();
    }

    header() {
        const leftIcon = icons.plain('search', vars.iconSize, vars.black12);
        const rightIcon = this.searchBarValue
            ? icons.iconImage(iconClear, this.clearSearch, vars.opacity54)
            : null;
        return (
            <View>
                <View style={headerContainer}>
                    <Text ellipsizeMode="middle" numberOfLines={1} style={textStyle}>
                        {tx('title_inviteContacts')}
                    </Text>
                    <View style={skipButtonStyle}>
                        {buttons.whiteTextButton(tx('button_skip'), () => this.skip())}
                    </View>
                </View>
                <SearchBar
                    textValue={this.searchBarValue}
                    placeholderText={tx('title_searchContacts')}
                    onChangeText={text => { this.onChangeSearchBarText(text); }}
                    leftIcon={leftIcon}
                    rightIcon={rightIcon}
                />
            </View>
        );
    }

    @computed get allSelected() {
        return this.contactList.every(listItem => listItem.selected);
    }

    @action.bound selectAll() {
        this.contactList.forEach(listItem => {
            listItem.selected = true;
        });
        this.clearSearch();
    }

    @action.bound deselectAll() {
        this.contactList.forEach(listItem => {
            listItem.selected = false;
        });
        this.clearSearch();
    }

    @action.bound toggleCheckbox(listItem) {
        listItem.selected = !listItem.selected;
        this.refreshList();
    }

    @action.bound refreshList() {
        this.refresh++;
    }

    keyExtractor(item, index) { return `${item.contact.email}-${index}`; }

    contactItem = ({ item }) => {
        if (!item.visible) return null;
        return (
            <ContactImportItem
                key={item.phoneContactName}
                hideAvatar
                contact={item.contact}
                phoneContactName={item.phoneContactName}
                checked={item.selected}
                onPress={() => this.toggleCheckbox(item)} />
        );
    };

    body() {
        return (
            <View style={{ flex: 1 }}>
                <View style={listHeader}>
                    <Text semibold style={textListTitle}>
                        {tx('title_inviteByEmail')}
                    </Text>
                    {buttons.blueTextButton(
                        this.allSelected ? tx('title_deselectAll') : tx('title_selectAll'),
                        this.allSelected ? this.deselectAll : this.selectAll)}
                </View>
                <FlatList
                    initialNumToRender={INITIAL_LIST_SIZE}
                    data={this.contactList}
                    renderItem={this.contactItem}
                    extraData={this.refresh}
                    keyExtractor={this.keyExtractor} />
            </View>
        );
    }

    @action.bound async inviteSelectedContacts() {
        const popupCopy = this.selectedContacts.length > 1 ?
            `Email invites will be sent to ${this.selectedContacts.length} people.` :
            `Email invite will be sent to ${this.selectedContacts.length} person.`;
        const result = await popupOkCancel('Confirm email invites', popupCopy);

        if (result) {
            contactState.batchInvite(this.selectedEmails);
            const contactsAdded = contactState.store.addedContacts.length;
            // TODO use contact store for invites sent
            const contactsInvited = this.selectedContacts.length;
            let message = '';
            if (contactsAdded && contactsInvited) {
                message = tx('title_contactsAddedAndInvited', { contactsAdded, contactsInvited });
            } else if (contactsAdded && !contactsInvited) {
                message = tx('title_contactsAdded', { contactsAdded });
            } else if (!contactsAdded && contactsInvited) {
                message = tx('title_contactsInvited', { contactsInvited });
            }
            if (message) snackbarState.pushTemporary(message);

            signupState.finishSignUp();
        }
    }

    footer() {
        if (uiState.keyboardHeight) return null;
        return (
            <View style={footerContainer} >
                {buttons.blueTextButton(
                    this.selectedContacts.length === 1 ? tx('button_sendInvite') : tx('button_sendInvites'),
                    this.inviteSelectedContacts,
                    this.selectedContacts.length === 0)}
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={container}>
                {this.header()}
                {this.body()}
                {this.footer()}
                <ActivityOverlay large visible={this.inProgress} />
            </View>);
    }
}
