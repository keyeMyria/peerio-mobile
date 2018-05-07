import React from 'react';
import { View } from 'react-native';
import { observable, action } from 'mobx';
import Text from '../controls/custom-text';
import { t, tx } from '../utils/translator';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import LoginWizardPage, {
    row, container, headingStyle1, subHeadingStyle, footerContainer, footerText1, footerText2
} from './login-wizard-page';
import { vars } from '../../styles/styles';
import DebugMenuTrigger from '../shared/debug-menu-trigger';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';
import uiState from '../layout/ui-state';

const { validators } = validation;
const { usernameLogin } = validators;

const inner2 = {
    borderRadius: 4,
    backgroundColor: vars.white,
    justifyContent: 'center',
    minHeight: 300
};

const formStyle = {
    paddingVertical: vars.spacing.medium.midi2x,
    justifyContent: 'space-between'
};

const findKeyText = {
    alignSelf: 'center',
    color: vars.peerioBlue,
    fontSize: vars.font.size.normal
};

export default class LoginClean extends LoginWizardPage {
    usernameState = observable({ value: '' });
    passwordState = observable({ value: '' });

    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }
    @action.bound passwordInputRef(ref) { this.passwordInput = ref; }

    @action.bound submit () {
        loginState.username = this.usernameState.value;
        loginState.passphrase = this.passwordState.value;
        uiState.hideAll()
            .then(() => loginState.login())
            .catch(e => {
                console.log(e);
                this.passwordInput.setCustomError(tx('error_wrongAK'));
            });
    }

    get isNextDisabled() {
        return socket.connected && (!this.passwordState.value ||
            !this.passwordInput.isValid || !this.usernameInput.isValid);
    }

    render() {
        return (
            <View style={container}>
                <DebugMenuTrigger>
                    <View style={{ justifyContent: 'center' }}>
                        <Text semibold style={[headingStyle1, { marginBottom: vars.spacing.large.midi }]}>
                            {t('title_welcome')}
                        </Text>
                        <Text style={[subHeadingStyle, { marginBottom: vars.spacing.medium.midi }]}>
                            {t('title_login')}
                        </Text>
                    </View>
                </DebugMenuTrigger>
                <View>
                    <View style={inner2}>
                        <View style={formStyle}>
                            <StyledTextInput
                                state={this.usernameState}
                                validations={usernameLogin}
                                hint={tx('title_username')}
                                ref={this.usernameInputRef}
                                testID="usernameLogin"
                            />
                            <StyledTextInput
                                state={this.passwordState}
                                hint={tx('title_AccountKey')}
                                onSubmit={this.submit}
                                secureText
                                lowerCase
                                returnKeyType="go"
                                ref={this.passwordInputRef}
                                testID="usernamePassword"
                            />
                            <Text style={findKeyText}>{tx('title_whereToFind')}</Text>
                        </View>
                    </View>
                    <View style={[row, { justifyContent: 'flex-end' }]}>
                        {this.button(
                            'button_login',
                            this.submit,
                            loginState.isInProgress,
                            this.isNextDisabled)}
                    </View>
                </View>
                <View style={footerContainer}>
                    <Text style={footerText1}>
                        {tx('title_createNewAccount')}
                    </Text>
                    <Text style={footerText2}>
                        {tx('title_signupLink')}
                    </Text>
                    <Text style={footerText1}>
                        {tx('title_here')}
                    </Text>
                </View>
                <ActivityOverlay large visible={loginState.isInProgress} />
            </View>
        );
    }
}
