import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity } from 'react-native';
import TextBox from '../controls/textbox';
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

const formStyle = {
    paddingVertical: vars.spacing.small.midi2x,
    paddingHorizontal: vars.spacing.medium.midi2x,
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
                <TextBox
                    returnKeyType="next"
                    state={signupState}
                    maxLength={24}
                    name="firstName"
                    hint={t('title_firstName')} />
                <TextBox
                    returnKeyType="next"
                    onSubmit={() => signupState.next()}
                    state={signupState}
                    maxLength={24}
                    name="lastName"
                    hint={t('title_lastName')} />
                <TextBox
                    returnKeyType="next"
                    lowerCase
                    state={signupState}
                    keyboardType="email-address"
                    name="username"
                    hint={t('title_username')} />
                <TextBox
                    returnKeyType="go"
                    keyboardType="email-address"
                    lowerCase
                    state={signupState}
                    name="email"
                    hint={t('title_email')} />
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
                        {this.button('button_next', () => signupState.next(), false, !signupState.nextAvailable)}
                    </View>
                </View>
                <View style={footer}>
                    <Text style={signupTextStyle}>
                        <T k="title_TOSRequestText">{tosParser}</T>
                    </Text>
                </View>
                <SignupAvatarActionSheet ref={sheet => { this._actionSheet = sheet; }} />
            </View>
        );
    }
}
