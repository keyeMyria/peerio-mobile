import React from 'react';
import { View, Text } from 'react-native';
import { t, tx } from '../utils/translator';
// import LanguagePickerBox from '../controls/language-picker-box';
import TextBox from '../controls/textbox';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import LoginWizardPage, {
    row, container, headingStyle1, subHeadingStyle, footerContainer, footerText1, footerText2
} from './login-wizard-page';
import { vars } from '../../styles/styles';
import DebugMenuTrigger from '../shared/debug-menu-trigger';

const inner2 = {
    borderRadius: 4,
    backgroundColor: vars.white,
    justifyContent: 'center',
    minHeight: 300
};

const formStyle = {
    padding: vars.spacing.medium.midi2x,
    justifyContent: 'space-between'
};

const findKeyText = {
    alignSelf: 'center',
    color: vars.peerioBlue,
    fontSize: vars.font.size.normal
};

export default class LoginClean extends LoginWizardPage {
    render() {
        return (
            <View style={container}>
                <DebugMenuTrigger>
                    <View style={{ justifyContent: 'center' }}>
                        <Text style={[headingStyle1, { marginBottom: vars.spacing.large.midi }]}>
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
                            <TextBox
                                lowerCase key="usernameLogin"
                                state={loginState}
                                name="username"
                                testID="usernameLogin"
                                hint={t('title_username')} />
                            <TextBox key="usernamePassword"
                                returnKeyType="go"
                                onSubmit={() => this.props.submit()}
                                state={loginState} name="passphrase" hint={t('title_AccountKey')} secureTextEntry />
                            {/* TODO: make link active */}
                            <Text style={findKeyText}>{tx('title_whereToFind')}</Text>
                        </View>
                    </View>
                    <View style={[row, { justifyContent: 'flex-end' }]}>
                        {this.button(
                            'button_login',
                            () => this.props.submit(),
                            loginState.isInProgress, !loginState.passphrase || !loginState.isValid())}
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
