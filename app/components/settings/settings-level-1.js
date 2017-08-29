import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Share } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import { settingsState, snackbarState, mainState, loginState, contactState, chatState } from '../states';
import { PaymentStorageUsage, paymentCheckout } from '../payments/payments-storage-usage';
import { toggleConnection } from '../main/dev-menu-items';
import plans from '../payments/payments-config';
import { tx } from '../utils/translator';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    backgroundColor: vars.settingsBg
};

const svStyle = {
    paddingVertical: vars.listViewPaddingVertical,
    paddingHorizontal: vars.listViewPaddingHorizontal
};

@observer
export default class SettingsLevel1 extends SafeComponent {
    get spacer() {
        return <View style={{ height: 32 }} />;
    }

    testShare() {
        const message = 'chat and share files securely using Peerio. https://www.peerio.com';
        const title = 'peerio';
        const url = 'https://www.peerio.com';
        Share.share({ message, title, url });
    }

    testNullActiveChat() {
        chatState.routerMain.chats(chatState.store.chats[0]);
        setTimeout(() => {
            chatState.store.activeChat = null;
        }, 5000);
    }

    renderThrow() {
        const plan = plans.topPlan();
        const upgradeItem = plan ?
            <SettingsItem title={`View my ${tx(plan.title)} plan`} onPress={() => settingsState.upgrade()} /> :
            <SettingsItem title="button_upgrade" onPress={() => settingsState.upgrade()} />;
        return (
            <View style={bgStyle}>
                <ScrollView contentContainerStyle={svStyle}>
                    <SettingsItem title="title_settingsProfile" onPress={() => settingsState.transition('profile')} />
                    <SettingsItem title="title_settingsSecurity" onPress={() => settingsState.transition('security')} />
                    <SettingsItem title="title_settingsPreferences" onPress={() => settingsState.transition('preferences')} />
                    {this.spacer}
                    <SettingsItem title="title_storageUsage" icon={null} onPress={paymentCheckout}>
                        <PaymentStorageUsage />
                    </SettingsItem>
                    <SettingsItem title="title_help" onPress={() => settingsState.routerMain.logs()} />
                    {this.spacer}
                    {upgradeItem}
                    <SettingsItem title="title_settingsAccount" onPress={() => settingsState.transition('account')} />
                    {this.spacer}
                    <SettingsItem title="button_logout" onPress={() => loginState.signOut()} />
                    {this.spacer}
                    {__DEV__ && <SettingsItem title="toggle connection" onPress={toggleConnection} />}
                    {__DEV__ && <SettingsItem title="damage TouchID" onPress={() => mainState.damageUserTouchId()} />}
                    {__DEV__ && <SettingsItem title="snackbar" onPress={() => snackbarState.pushTemporary('test')} />}
                    {__DEV__ && <SettingsItem title="test Contacts" onPress={() => contactState.testImport()} />}
                    {__DEV__ && <SettingsItem title="test Share" onPress={() => this.testShare()} />}
                    {__DEV__ && <SettingsItem title="test null activeChat" onPress={() => this.testNullActiveChat()} />}
                    {/* <SettingsItem title={t('payments')} onPress={() => settingsState.transition('payments')} /> */}
                    {/* <SettingsItem title={t('quotas')} onPress={() => settingsState.transition('quotas')} /> */}
                </ScrollView>
            </View>
        );
    }
}
