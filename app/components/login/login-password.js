import React from 'react';
import { t, T } from '../utils/translator';
import TextBox from '../controls/textbox';
import Bold from '../controls/bold';
import Center from '../controls/center';
import ActivityOverlay from '../controls/activity-overlay';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';

const textStyle = {
    marginBottom: vars.spacing.small.maxi2x,
    color: vars.txtLight
};

export default class LoginPassword extends LoginWizardPage {
    items() {
        const textParser = {
            emphasis: text => <Bold>{text}</Bold>
        };
        return [
            <Text key="1" style={textStyle}><T k="title_AKlogin">{textParser}</T></Text>,
            <TextBox key="2"
                returnKeyType="go"
                onSubmit={() => this.props.submit()}
                state={loginState} name="passphrase" hint={t('title_AccountKey')} secureTextEntry />
        ];
    }


    buttons() {
        const opacity = loginState.isInProgress ? 0 : 1;
        return (
            <Center>
                {this._footerButton('button_login', () => this.props.submit(), { opacity })}
                <ActivityOverlay visible={loginState.isInProgress} />
            </Center>
        );
    }
}
