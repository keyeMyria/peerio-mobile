import React from 'react';
import { observer } from 'mobx-react/native';
import { View, SectionList } from 'react-native';
import { reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import buttons from '../helpers/buttons';
import ContactInviteItem from './contact-invite-item';
import ContactSectionHeader from './contact-section-header';
import contactAddState from './contact-add-state';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 20;

@observer
export default class ContactListInvite extends SafeComponent {
    dataSource = [];
    get data() { return contactAddState.imported; }

    get layoutTitle() { return tx('button_inviteEmailContact'); }

    get leftIcon() {
        return buttons.whiteTextButton(tx('button_done'), () => contactAddState.routerMain.contacts());
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data,
            this.data.length
        ], () => {
            this.dataSource = [{ data: this.data.slice(), key: tx('title_inviteToPeerio') }];
            this.forceUpdate();
        }, true);
    }

    item({ item }) {
        return (
            <ContactInviteItem contact={item} />
        );
    }

    header({ section: /* data, */ { key } }) {
        return <ContactSectionHeader key={key} title={key} />;
    }

    listView() {
        return (
            <SectionList
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.dataSource}
                keyExtractor={item => item.username}
                renderItem={this.item}
                renderSectionHeader={this.header}
                ref={sv => { this.scrollView = sv; }}
            />
        );
    }

    renderThrow() {
        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {this.listView()}
                </View>
            </View>
        );
    }
}
