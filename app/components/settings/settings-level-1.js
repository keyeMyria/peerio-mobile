import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Share, Text, Platform } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import { settingsState, snackbarState, mainState, loginState, contactState, chatState } from '../states';
import { PaymentStorageUsage, paymentCheckout } from '../payments/payments-storage-usage';
import { toggleConnection } from '../main/dev-menu-items';
import plans from '../payments/payments-config';
import { tx, tu } from '../utils/translator';
import { warnings, clientApp } from '../../lib/icebear';
import { popupAbout } from '../shared/popups';
import ButtonWithIcon from '../controls/button-with-icon';
import { scrollHelper } from '../helpers/test-helper';

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    backgroundColor: vars.darkBlueBackground05
};

const svStyle = {
    paddingVertical: vars.listViewPaddingVertical,
    paddingHorizontal: vars.listViewPaddingHorizontal
};

@observer
export default class SettingsLevel1 extends SafeComponent {
    get spacer() {
        return <View style={{ height: 16 }} />;
    }

    testShare() {
        const message = 'chat and share files securely using Peerio. https://www.testurl.com';
        const title = 'peerio';
        const url = 'https://www.testurl.com';
        Share.share({ message, title, url });
    }

    testNullActiveChat() {
        chatState.routerMain.chats(chatState.store.chats[0]);
        setTimeout(() => {
            chatState.store.activeChat = null;
        }, 5000);
    }

    resetExternalSetting = () => {
        clientApp.uiUserPrefs.externalContentConsented = false;
    };

    /**
     * Scroll helper is used to provide scrolling capability
     * to the test script. Note that it overrides ref and onScroll
     * event handlers
     */
    renderThrow() {
        const plan = plans.topPlan();
        const upgradeItem = plan ?
            <SettingsItem title={`View my ${tx(plan.title)} plan`} onPress={() => settingsState.upgrade()} /> :
            <SettingsItem title="button_upgrade" onPress={() => settingsState.upgrade()} />;
        return (
            <View style={bgStyle}>
                <ScrollView contentContainerStyle={svStyle} {...scrollHelper}>
                    <SettingsItem title="title_settingsProfile" onPress={() => settingsState.transition('profile')} />
                    <SettingsItem title="title_settingsSecurity" onPress={() => settingsState.transition('security')} />
                    <SettingsItem title="title_settingsPreferences" onPress={() => settingsState.transition('preferences')} />
                    {this.spacer}
                    <SettingsItem title="title_storageUsage" icon={null} onPress={paymentCheckout}>
                        <PaymentStorageUsage />
                    </SettingsItem>
                    <SettingsItem title="title_help" onPress={() => settingsState.transition('logs')} />
                    {this.spacer}
                    {!process.env.PEERIO_DISABLE_PAYMENTS && upgradeItem}
                    <SettingsItem title="title_settingsAccount" onPress={() => settingsState.transition('account')} />
                    {this.spacer}
                    <SettingsItem title="title_About" icon={null} onPress={() => popupAbout()} />
                    {this.spacer}
                    <ButtonWithIcon
                        text={tu('button_logout')}
                        accessibilityLabel="button_logout"
                        style={{
                            backgroundColor: vars.white,
                            width: '100%',
                            paddingVertical: vars.spacing.medium.mini2x,
                            borderRadius: 4
                        }}
                        bold
                        textStyle={{ color: vars.peerioBlue }}
                        onPress={loginState.signOut}
                        iconName="power-settings-new"
                        testID="button_signOut"
                    />
                    {this.spacer}
                    {__DEV__ && <SettingsItem title="toggle connection" onPress={toggleConnection} />}
                    {__DEV__ && <SettingsItem title="damage TouchID" onPress={() => mainState.damageUserTouchId()} />}
                    {__DEV__ && <SettingsItem title="snackbar" onPress={() =>
                        snackbarState.pushTemporary('test')} />}
                    {__DEV__ && <SettingsItem title="snackbar long" onPress={() =>
                        snackbarState.pushTemporary('test whatever you have been testing for a longer snackbar for the win whatever you have been testing for a longer snackbar for the win')} />}
                    {__DEV__ && <SettingsItem title="test Contacts" onPress={() => contactState.testImport()} />}
                    {__DEV__ && <SettingsItem title="test Share" onPress={() => this.testShare()} />}
                    {__DEV__ && <SettingsItem title="test null activeChat" onPress={() => this.testNullActiveChat()} />}
                    {__DEV__ && <SettingsItem title="test warning" onPress={() => warnings.addSevere('warning')} />}
                    {__DEV__ && <SettingsItem title="reset external setting" onPress={this.resetExternalSetting} />}
                    {/* <SettingsItem title={t('payments')} onPress={() => settingsState.transition('payments')} /> */}
                    {/* <SettingsItem title={t('quotas')} onPress={() => settingsState.transition('quotas')} /> */}
                </ScrollView>
            </View>
        );
    }
}
