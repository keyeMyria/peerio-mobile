import React from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, View } from 'react-native';
import { tu } from 'peerio-translator';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import signupState from '../signup/signup-state';
import { wizard } from '../../styles/styles';

const style = wizard.footer;

@observer
export default class SignupFooter extends SafeComponent {
    button(text, active, onPress, testID) {
        const s = { opacity: active ? 1 : 0.7 };
        return (
            <TouchableOpacity
                testID={testID}
                style={style.button.base}
                onPress={active ? onPress : null}>
                <Text style={[style.button.text, s]}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }

    renderThrow() {
        const next = this.button(
            tu('button_next'),
            !signupState.isInProgress && signupState.nextAvailable,
            () => signupState.next(),
            'signupNext'
        );

        const prev = this.button(
            signupState.isFirst ? tu('button_cancel') : tu('button_back'),
            !signupState.isInProgress,
            () => signupState.prev(), 'signupPrev');

        return (
            <View>
                <View style={style.row}>
                    {prev}
                    {next}
                </View>
            </View>
        );
    }
}
