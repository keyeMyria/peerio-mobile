import React, { Component } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { observer } from 'mobx-react/native';
import { t, tu } from '../utils/translator';
import Button from '../controls/button';
import Center from '../controls/center';
import ErrorText from '../controls/error-text';
import signupState from '../signup/signup-state';
import loginState from '../login/login-state';
import { vars } from '../../styles/styles';

@observer
export default class LoginSignup extends Component {
    constructor(props) {
        super(props);
        this.signUp = this.signUp.bind(this);
        this.login = this.login.bind(this);
    }

    signUp() {
        if (loginState.isInProgress) return;
        signupState.transition();
    }

    login() {
        loginState.login();
    }

    button(text, testId, action) {
        // TODO move to base button styling.
        const bStyle = {
            height: 36,
            marginBottom: 6,
            marginTop: 6,
            paddingLeft: 8,
            paddingRight: 8,
            justifyContent: 'center'
        };
        const textStyle = {
            fontWeight: '600'
        };
        return (
            <Button
                key={text}
                testID={testId}
                style={bStyle}
                disabled={!loginState.isConnected}
                textStyle={textStyle}
                text={tu(text)}
                onPress={action} />
        );
    }

    link(text, testId, action) {
        const bStyle = {
            paddingLeft: 8,
            paddingRight: 8
        };
        const textStyle = {};
        return (
            <Button
                key={text}
                testID={testId}
                style={bStyle}
                disabled={!loginState.isConnected}
                textStyle={textStyle}
                text={tu(text)}
                onPress={action} />
        );
    }


    render() {
        const activityIndicator = <ActivityIndicator color={vars.highlight} />;
        // TODO move activityIndicator to center of screen in an overlay
        // TODO button needs to be disabled when inputs are empty.
        let item = loginState.isInProgress ? activityIndicator : [
            this.button('login', 'loginButton', this.login)
        ];

        const signUp = this.link('signup', 'signupButton', this.signUp);
        // TODO move to input
        item = loginState.error ? <ErrorText>{t(loginState.error)}</ErrorText> : item;
        return (
            <View style={{ flexGrow: 1, borderColor: 'yellow', borderWidth: 0, justifyContent: 'flex-start' }}>
                <Center>
                    {item}
                </Center>
                <Center style={{ alignItems: 'center' }}>
                    <Text style={{ color: 'rgba(255,255,255, .7)' }}>New user?</Text>{signUp}
                </Center>
            </View>
        );
    }
}
