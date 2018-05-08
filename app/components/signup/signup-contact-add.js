import React from 'react';
import { observer } from 'mobx-react/native';
import { View, FlatList } from 'react-native';
import { observable, action, computed } from 'mobx';
import ActivityOverlay from '../controls/activity-overlay';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import contactState from '../contacts/contact-state';
import signupState from '../signup/signup-state';
import LoginWizardPage from '../login/login-wizard-page';
import ContactImportItem from '../contacts/contact-import-item';
import { headerContainer, textStyle, skipButtonStyle, listHeader, textListTitle, footerContainer, container } from '../../styles/signup-contact-sync';
import ListItem from './signup-contact-list-item';
import Text from '../controls/custom-text';

const INITIAL_LIST_SIZE = 10;

@observer
export default class SignupContactAdd extends LoginWizardPage {
    get useLayout2() { return true; }
    @observable contactList = [];
    @observable inProgress = false;
    @observable refresh = 0;

    @computed get selectedContacts() {
        return this.contactList.filter(item => item.selected);
    }

    async componentDidMount() {
        this.inProgress = true;
        try {
            const phoneContacts = await contactState.getPhoneContactEmails();
            await this.getPeerioContacts(phoneContacts);
        } catch (e) {
            console.error(e);
        }
        this.inProgress = false;
        if (this.contactList.length === 0) signupState.next();
    }

    /**
     * Converts phone contacts into Peerio contacts (if email matches a Peerio account)
     * and pushes to this.contactList
     * @param {array} phoneContacts
     */
    @action getPeerioContacts(phoneContacts) {
        const promises = [];
        phoneContacts.forEach(c => {
            promises.push((async () => {
                try {
                    const contact = await contactState.resolveAndCache(c.email);
                    if (!contact.notFound) {
                        this.contactList.push(new ListItem(contact, c.fullName, true));
                        this.refreshList();
                    }
                } catch (e) {
                    console.error(e);
                }
            })());
        });
        return Promise.all(promises);
    }

    header() {
        return (
            <View style={headerContainer}>
                <Text ellipsizeMode="middle" numberOfLines={1} style={textStyle}>
                    {tx('title_addContacts')}
                </Text>
                <View style={skipButtonStyle}>
                    {buttons.whiteTextButton(tx('button_skip'), () => signupState.next())}
                </View>
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
        this.refreshList();
    }

    @action.bound deselectAll() {
        this.contactList.forEach(listItem => {
            listItem.selected = false;
        });
        this.refreshList();
    }

    @action.bound toggleCheckbox(listItem) {
        listItem.selected = !listItem.selected;
        this.refreshList();
    }

    @action.bound refreshList() { this.refresh++; }

    keyExtractor(item, index) { return `${item.contact.email}-${index}`; }

    contactItem = ({ item }) => {
        return (
            <ContactImportItem
                key={item.contact.username}
                contact={item.contact}
                checked={item.selected}
                onPress={() => this.toggleCheckbox(item)} />
        );
    };

    body() {
        return (
            <View style={{ flex: 1 }}>
                <View style={listHeader}>
                    <Text semibold style={textListTitle}>
                        {tx('title_contactsOnPeerio')}
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

    @action.bound addSelectedContacts() {
        this.selectedContacts.forEach(i => contactState.store.getContactAndSave(i.contact.username));
        signupState.next();
    }

    footer() {
        return (
            <View style={footerContainer} >
                {buttons.blueTextButton(
                    tx('button_add'),
                    this.addSelectedContacts,
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
