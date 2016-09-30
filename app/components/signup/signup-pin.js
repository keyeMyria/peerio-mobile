import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import SignupFooter from '../controls/signup-footer';
import Pin from '../controls/pin';
import Layout2 from '../layout/layout2';
import styles from '../../styles/styles';
import signupState from './signup-state';

export default class SignupPin extends Component {

    usePin(pin) {
        signupState.pin = pin;
        setTimeout(() => signupState.finish(), 200);
    }

    render() {
        const style = styles.wizard;
        const body = (
            <View style={style.containerFlex}>
                <Text style={style.text.title}>Signup</Text>
                <Text style={style.text.subTitle}>Create device PIN</Text>
                <Pin
                    preventSimplePin
                    onConfirm={pin => this.usePin(pin)} />
            </View>
        );

        return (
            <Layout2 body={body} footer={<SignupFooter />} />
        );
    }
}

