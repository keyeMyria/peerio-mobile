import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity } from 'react-native';
import TextBox from '../controls/textbox';
// import LanguagePickerBox from '../controls/language-picker-box';
import Bold from '../controls/bold';
import { vars } from '../../styles/styles';
import signupState from './signup-state';
import { popupTOS } from '../shared/popups';
import { t, T } from '../utils/translator';
import LoginWizardPage, {
    header, innerSmall, circleTopSmall, title3, title2, row, container
} from '../login/login-wizard-page';
import SignupAvatar from './signup-avatar';
import SignupAvatarActionSheet from './signup-avatar-action-sheet';

const formStyle = {
    padding: 20,
    justifyContent: 'space-between'
};

const footer = {
    flex: 0.4,
    justifyContent: 'flex-end',
    alignItems: 'center'
};

const addPhotoText = {
    fontSize: 14,
    color: vars.txtMedium,
    textAlign: 'center'
};

const addPhotoPlus = [addPhotoText, {
    fontSize: 30,
    fontWeight: 'bold'
}];

const tosParser = {
    emphasis: text => <Bold>{text}</Bold>,
    tosButton: text => (
        <Text
            onPress={popupTOS}
            style={{ textDecorationLine: 'underline' }}>
            {text}
        </Text>
    )
};

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
                <Text style={addPhotoText}>Add photo (optional)</Text>
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
                    autoShrinkTextLimit={14}
                    name="firstName"
                    hint={t('title_firstName')} />
                <TextBox
                    returnKeyType="go"
                    onSubmit={() => signupState.next()}
                    state={signupState}
                    maxLength={24}
                    autoShrinkTextLimit={14}
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
                    returnKeyType="next"
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
            <View style={container}>
                <View style={header}>
                    <Text style={title2}>Sign up</Text>
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
                <View style={[row, { justifyContent: 'space-between' }]}>
                    {this.button('button_back', () => signupState.routes.app.loginStart())}
                    {this.button('button_next', () => signupState.next(), false, !signupState.nextAvailable)}
                </View>
                <View style={footer}>
                    {/* TODO: peerio copy */}
                    <Text style={title3}>
                        <T k="title_TOSRequestText">{tosParser}</T>
                    </Text>
                </View>
                <SignupAvatarActionSheet ref={sheet => { this._actionSheet = sheet; }} />
            </View>
        );
    }
}
