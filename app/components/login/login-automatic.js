import React from 'react';
import { View, StatusBar, Dimensions } from 'react-native';
import Text from '../controls/custom-text';
import { t } from '../utils/translator';
import loginState from './login-state';
import LoginWizardPage from './login-wizard-page';
import { wizard, vars } from '../../styles/styles';
import Logo from '../controls/logo';
import Layout1 from '../layout/layout1';

const { height } = Dimensions.get('window');
const logoHeight = height * 0.33;

export default class LoginAutomatic extends LoginWizardPage {
    button(text, testID, onPress, highlight) {
        const buttonContainer = {
            marginHorizontal: vars.wizardPadding * 0.5,
            marginVertical: vars.spacing.medium.midi2x,
            alignItems: 'stretch',
            borderColor: '#FFFFFFBA',
            borderWidth: highlight ? 2 : 0,
            borderRadius: 4
        };
        const button = {
            padding: vars.spacing.small.maxi2x,
            alignItems: 'center',
            backgroundColor: 'rgba(255,255,255,0.12)'
        };
        return (
            <View style={buttonContainer} key={text} testID={testID}>
                {this._button(text, onPress, button, null, null, true)}
            </View>
        );
    }

    body() {
        const padded = {
            paddingHorizontal: vars.wizardPadding,
            alignItems: 'center'
        };
        const padded2 = {
            flex: 1,
            paddingHorizontal: vars.wizardPadding,
            alignItems: 'stretch'
        };
        const noticeText = {
            color: vars.white,
            fontSize: vars.font.size.massive
        };
        const normalText = {
            color: vars.white,
            marginBottom: vars.spacing.medium.maxi
        };
        return (
            <View style={padded}>
                <View>
                    <Text style={noticeText}>{t('title_enableAutomatic')}</Text>
                </View>
                <View style={padded2}>
                    {this.button('button_enable', 'automaticLoginEnable', () => { loginState.selectedAutomatic = true; }, true)}
                    <Text style={normalText}>{t('title_enableAutomatic1')}</Text>
                    {this.button('button_disable', 'automaticLoginDisable', () => { loginState.selectedAutomatic = false; }, false)}
                    <Text style={normalText}>{t('title_enableAutomatic2')}</Text>
                </View>
            </View>
        );
    }

    renderThrow() {
        const style = wizard;
        const body = (
            <View
                style={[style.containerFlex, { alignItems: 'center' }]}>
                <View style={{ height: logoHeight, justifyContent: 'center' }}>
                    <Logo />
                </View>
                {this.body()}
                <StatusBar barStyle="light-content" />
            </View>
        );
        return <Layout1 body={body} />;
    }
}
