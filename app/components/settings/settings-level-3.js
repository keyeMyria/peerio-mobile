import React, { Component } from 'react';
import {
    View, Text, TextInput, Clipboard
} from 'react-native';
import { observer } from 'mobx-react/native';
import { vars } from '../../styles/styles';
import SettingsItem from './settings-item';
import ButtonText from '../controls/button-text';
import settingsState from './settings-state';
import snackbarState from '../snackbars/snackbar-state';
import { tx } from '../utils/translator';

const paddingVertical = vars.listViewPaddingVertical;
const paddingHorizontal = vars.listViewPaddingHorizontal;
const marginVertical = 18;
const marginBottom = 8;

const bgStyle = {
    flexGrow: 1,
    flex: 1,
    paddingVertical,
    paddingHorizontal,
    backgroundColor: vars.settingsBg
};

const labelStyle = {
    color: vars.txtDate, marginBottom
};

const whiteStyle = {
    backgroundColor: vars.white, paddingTop: 10, paddingHorizontal
};

@observer
export default class SettingsLevel2 extends Component {
    key2fa = `FY5DGKRMJHXCLJDJJAOISDUUSIA`;

    copyKey() {
        Clipboard.setString(this.key2fa);
        snackbarState.pushTemporary('2FA key has been copied to clipboard');
    }

    render() {
        return (
            <View style={bgStyle}>
                <View>
                    <Text style={{ color: vars.txtDark }}>
                        {tx('title_2FADetail')}
                    </Text>
                </View>
                <View style={{ marginVertical }}>
                    <Text style={labelStyle}>
                        {tx('title_2FAsecretKey')}
                    </Text>
                    <View style={whiteStyle}>
                        <Text style={{ fontWeight: 'bold' }}>
                            {this.key2fa}
                        </Text>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end'
                        }}>
                            <ButtonText text={tx('title_copy')} onPress={() => this.copyKey()} />
                        </View>
                    </View>
                </View>
                <View>
                    <Text>
                        {tx('dialog_enter2FA')}
                    </Text>
                </View>
                <View style={{ marginVertical }}>
                    <Text style={labelStyle}>
                        {tx('title_2FACode')}
                    </Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        backgroundColor: vars.white,
                        paddingHorizontal
                    }}>
                        <TextInput style={{
                            color: vars.txtDate,
                            marginVertical: 8,
                            height: vars.inputHeight,
                            flexGrow: 1
                        }} value="123456" />
                        <ButtonText text={tx('button_continue')} />
                    </View>
                </View>
            </View>
        );
    }
}
