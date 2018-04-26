import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import ToggleItem from './toggle-item';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import buttons from '../helpers/buttons';
import { popupDeleteAccount } from '../shared/popups';
import { User } from '../../lib/icebear';
import { loginState } from '../states';


const label = {
    color: vars.txtDate,
    marginVertical: vars.spacing.small.mini2x,
    marginLeft: vars.spacing.small.maxi
};

const label2 = {
    color: vars.txtDark,
    marginVertical: vars.spacing.small.midi2x,
    marginLeft: vars.spacing.small.maxi,
    marginTop: vars.spacing.medium.mini2x
};


@observer
export default class AccountEdit extends SafeComponent {
    label(title) {
        return <Text style={label}>{tx(title)}</Text>;
    }

    label2(title) {
        return <Text style={label2}>{tx(title)}</Text>;
    }

    toggle(title, prop) {
        const state = User.current.settings;
        const onPress = () => {
            state[prop] = !state[prop];
            User.current.saveSettings();
        };
        return (
            <ToggleItem {...{ prop, title, state, onPress }} />
        );
    }

    async deleteAccount() {
        if (await popupDeleteAccount()) {
            try {
                await User.current.deleteAccount(User.current.username);
                loginState.signOut();
            } catch (e) {
                console.log('account-edit.js: error deleting account');
                console.error(e);
            }
        }
    }

    renderThrow() {
        return (
            <ScrollView
                contentContainerStyle={{ flex: 1, flexGrow: 1 }}
                onScroll={this.onScroll}
                keyboardShouldPersistTaps="handled"
                style={{ backgroundColor: vars.darkBlueBackground05 }} ref={ref => { this._scrollView = ref; }}>
                <View style={{ margin: vars.spacing.small.midi2x }}>
                    {this.label('title_promoConsentRequestTitle')}
                    {this.toggle('title_promoConsent', 'subscribeToPromoEmails')}
                </View>
                <View style={{ margin: vars.spacing.small.midi2x }}>
                    {this.label2('title_dataDetail')}
                    {this.label('title_dataPreferences')}
                    {this.toggle('title_errorTrackingMessage', 'errorTracking')}
                    {this.toggle('title_dataCollectionMessage', 'dataCollection')}
                </View>
                <View style={{ marginTop: vars.spacing.medium.mini2x, marginLeft: vars.spacing.medium.maxi2x, marginBottom: vars.spacing.large.midi, flex: 1, flexGrow: 1, justifyContent: 'flex-end' }}>
                    {buttons.redTextButton('button_accountDelete', () => this.deleteAccount())}
                </View>
            </ScrollView>
        );
    }
}
