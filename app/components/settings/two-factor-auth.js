import React from 'react';
import { reaction, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { ScrollView, View, TextInput, Clipboard, ActivityIndicator, Keyboard } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import snackbarState from '../snackbars/snackbar-state';
import { tx } from '../utils/translator';
import { popup2FA } from '../shared/popups';
import { clientApp, User } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import loginState from '../login/login-state';
import TwoFactorAuthCodes from './two-factor-auth-codes';
import TwoFactorAuthCodesGenerate from './two-factor-auth-codes-generate';
import uiState from '../layout/ui-state';
import testLabel from '../helpers/test-label';

const paddingVertical = vars.listViewPaddingVertical;
const paddingHorizontal = vars.listViewPaddingHorizontal;
const marginVertical = vars.spacing.medium.midi;
const marginBottom = vars.spacing.small.midi2x;

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical,
    paddingHorizontal,
    backgroundColor: vars.darkBlueBackground05
};

const labelStyle = {
    color: vars.txtDate, marginBottom
};

const whiteStyle = {
    backgroundColor: vars.white, paddingTop: vars.spacing.small.maxi, paddingHorizontal
};

async function twoFactorAuthPopup(active2FARequest) {
    if (!active2FARequest) return;
    console.log(JSON.stringify(active2FARequest));
    const { submit, cancel, type } = active2FARequest;
    const result = await popup2FA(
        tx('title_2FA'),
        tx('dialog_enter2FA'),
        type === 'login' ? tx('title_trustThisDevice') : null,
        uiState.trustDevice2FA,
        true
    );
    if (result === false) {
        if (type === 'login') {
            await loginState.signOut(true);
        }
        cancel();
        return;
    }
    const { value, checked } = result;
    uiState.trustDevice2FA = checked;
    submit(value, checked);
}

reaction(() => clientApp.active2FARequest, twoFactorAuthPopup);

export { twoFactorAuthPopup };

@observer
export default class TwoFactorAuth extends SafeComponent {
    @observable key2fa;
    @observable confirmCode;
    @observable backupCodes;
    @observable showReissueCodes;

    async componentWillMount() {
        try {
            this.key2fa = await User.current.setup2fa();
            __DEV__ && console.log(`two-factor-auth.js: ${this.key2fa}`);
        } catch (e) {
            // TODO: remove it and depend on SDK
            if (e.code === 400) {
                console.log('two-factor-auth.js: already enabled');
                User.current.twoFAEnabled = true;
            }
        }
        if (User.current.twoFAEnabled) {
            this.showReissueCodes = true;
        }
    }

    copyKey() {
        Clipboard.setString(this.key2fa);
        snackbarState.pushTemporary('2FA key has been copied to clipboard');
    }

    async confirm() {
        Keyboard.dismiss();
        const { confirmCode } = this;
        this.confirmCode = null;
        this.backupCodes = await User.current.confirm2faSetup(confirmCode, true);
    }

    get key2FAControl() {
        if (!this.key2fa) return <ActivityIndicator />;
        return (
            <Text bold {...testLabel('secretKey')}>
                {this.key2fa}
            </Text>
        );
    }

    renderThrow() {
        if (this.showReissueCodes) return <TwoFactorAuthCodesGenerate />;
        if (this.backupCodes) return <TwoFactorAuthCodes codes={this.backupCodes} />;
        return (
            <ScrollView
                style={bgStyle}
                keyboardShouldPersistTaps="handled">
                <View>
                    <Text style={{ color: vars.txtDark }}>
                        {tx('title_2FADetailDesktop')}
                    </Text>
                </View>
                <View style={{ marginVertical }}>
                    <Text style={labelStyle}>
                        {tx('title_2FASecretKey')}
                    </Text>
                    <View style={whiteStyle}>
                        {this.key2FAControl}
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}>
                            {buttons.blueTextButton(tx('button_2FACopyKey'), () => this.copyKey(), !this.key2fa)}
                        </View>
                    </View>
                </View>
                <View>
                    <Text>
                        {tx('dialog_enter2FA')}
                    </Text>
                </View>
                <View style={{ marginVertical }}>
                    <Text style={labelStyle}>
                        {tx('title_2FACode')}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        backgroundColor: vars.white,
                        paddingHorizontal
                    }}>
                        <TextInput
                            style={{
                                color: vars.txtDark,
                                marginVertical: vars.spacing.small.midi2x,
                                height: vars.inputHeight,
                                flexGrow: 1,
                                fontFamily: vars.peerioFontFamily
                            }}
                            {...testLabel('confirmationCodeInput')}
                            placeholderTextColor={vars.txtDate}
                            placeholder="123456"
                            onChangeText={text => { this.confirmCode = text; }}
                            value={this.confirmCode} />
                        {buttons.blueTextButton(tx('button_confirm'),
                            () => this.confirm(), !this.confirmCode || !this.key2fa, false, 'button_confirm')}
                    </View>
                </View>
                <View>
                    <Text style={{ color: vars.txtDark }}>
                        {tx('title_authAppsDetails')}
                    </Text>
                </View>
            </ScrollView>
        );
    }
}
