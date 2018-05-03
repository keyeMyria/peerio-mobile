import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity } from 'react-native';
// import LanguagePickerBox from '../controls/language-picker-box';
import Bold from '../controls/bold';
import { vars } from '../../styles/styles';
import signupState from './signup-state';
import { popupTOS } from '../shared/popups';
import { t, tx, T } from '../utils/translator';
import LoginWizardPage, {
    header2, innerSmall, circleTopSmall, headingStyle2, footerText1, footerText2, innerContainer, outerContainer, buttonRowStyle
} from '../login/login-wizard-page';
import SignupAvatar from './signup-avatar';
import SignupAvatarActionSheet from './signup-avatar-action-sheet';
import StyledTextInput from '../shared/styled-text-input';
import { socket, validation } from '../../lib/icebear';

const { validators } = validation;
const { firstName, lastName, username, email } = validators;

const formStyle = {
    paddingVertical: vars.spacing.small.midi2x,
    justifyContent: 'space-between'
};

const footer = {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'center'
};

const addPhotoText = {
    fontSize: vars.font.size.normal,
    color: vars.txtLightGrey,
    paddingHorizontal: vars.spacing.small.mini,
    textAlign: 'center'
};

const addPhotoOptionalText = {
    fontSize: vars.font.size.small,
    color: vars.txtLightGrey,
    paddingHorizontal: vars.spacing.small.mini,
    textAlign: 'center'
};

const addPhotoPlus = {
    fontSize: vars.signupFontSize,
    color: vars.txtLightGrey,
    paddingHorizontal: vars.spacing.small.mini,
    textAlign: 'center',
    marginTop: -10,
    marginBottom: -10
};

const tosParser = {
    emphasis: text => <Bold>{text}</Bold>,
    tosButton: text => (
        <Text
            onPress={popupTOS}
            style={[footerText2, { textDecorationLine: 'underline' }]}>
            {text}
        </Text>
    )
};

const signupTextStyle = [footerText1, { fontSize: vars.font.size.smaller }];

@observer
export default class SignupStep1 extends LoginWizardPage {
    firstnameState = observable({ value: '' });
    lastnameState = observable({ value: '' });
    usernameState = observable({ value: '' });
    emailState = observable({ value: '' });

    @action.bound firstNameInputRef(ref) { this.firstNameInput = ref; }
    @action.bound lastNameInputRef(ref) { this.lastNameInput = ref; }
    @action.bound usernameInputRef(ref) { this.usernameInput = ref; }
    @action.bound emailInputRef(ref) { this.emailInput = ref; }

    @action.bound onSubmitFirstName() { this.lastNameInput.onFocus(); }
    @action.bound onSubmitLastName() { this.usernameInput.onFocus(); }
    @action.bound onSubmitUsername() { this.emailInput.onFocus(); }

    @action.bound handleNextButton() {
        signupState.firstName = this.firstnameState.value;
        signupState.lastName = this.lastnameState.value;
        signupState.username = this.usernameState.value;
        signupState.email = this.emailState.value;
        signupState.next();
    }

    get isNextDisabled() {
        // removing "!this.firstnameState.value" causes a runtime error
        return socket.connected && (!this.firstnameState.value || !this.firstNameInput.isValid ||
            !this.lastNameInput.isValid || !this.usernameInput.isValid || !this.emailInput.isValid);
    }

    get avatar() {
        return (
            <SignupAvatar />
        );
    }

    get avatarSelector() {
        return (
            <View>
                <Text style={addPhotoPlus}>+</Text>
                <Text style={addPhotoText}>{t('title_avatarInstructions')}</Text>
                <Text style={addPhotoOptionalText}>{t('title_optional')}</Text>
            </View>
        );
    }

    get body() {
        return (
            <View>
                <StyledTextInput
                    state={this.firstnameState}
                    validations={firstName}
                    hint={tx('title_firstName')}
                    maxLength={24}
                    required
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={this.onSubmitFirstName}
                    ref={this.firstNameInputRef}
                    testID="firstName" />
                <StyledTextInput
                    state={this.lastnameState}
                    validations={lastName}
                    hint={tx('title_lastName')}
                    maxLength={24}
                    required
                    returnKeyType="next"
                    blurOnSubmit={false}
                    onSubmitEditing={this.onSubmitLastName}
                    ref={this.lastNameInputRef}
                    testID="lastName" />
                <StyledTextInput
                    state={this.usernameState}
                    validations={username}
                    hint={tx('title_username')}
                    lowerCase
                    required
                    keyboardType="email-address"
                    returnKeyType="next"
                    onSubmitEditing={this.onSubmitUsername}
                    ref={this.usernameInputRef}
                    testID="username" />
                <StyledTextInput
                    state={this.emailState}
                    validations={email}
                    hint={tx('title_email')}
                    lowerCase
                    keyboardType="email-address"
                    returnKeyType="go"
                    required
                    ref={this.emailInputRef}
                    testID="email" />
                {/* <LanguagePickerBox /> */}
                <View style={[{ flexGrow: 1 }]} />
            </View>
        );
    }

    render() {
        return (
            <View style={outerContainer}>
                <View style={innerContainer}>
                    <View style={header2}>
                        <Text style={headingStyle2}>{tx('title_createAccount')}</Text>
                    </View>
                    <View>
                        <View style={innerSmall}>
                            <View style={formStyle}>
                                {this.body}
                            </View>
                        </View>
                        <TouchableOpacity
                            style={circleTopSmall}
                            onPress={() => this._actionSheet.show()}
                            pressRetentionOffset={vars.pressRetentionOffset}>
                            {signupState.avatarData ? this.avatar : this.avatarSelector}
                        </TouchableOpacity>
                    </View>
                    <View style={[buttonRowStyle, { justifyContent: 'space-between' }]}>
                        {this.button('button_back', () => signupState.routes.app.loginStart())}
                        {this.button('button_next',
                            () => this.handleNextButton(),
                            false,
                            this.isNextDisabled)}
                    </View>
                    <View style={footer}>
                        <Text style={signupTextStyle}>
                            <T k="title_TOSRequestText">{tosParser}</T>
                        </Text>
                    </View>
                    <SignupAvatarActionSheet ref={sheet => { this._actionSheet = sheet; }} />
                </View>
            </View>
        );
    }
}
