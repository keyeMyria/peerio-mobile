import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, Image } from 'react-native';
import { observable, when } from 'mobx';
import TextBox from '../controls/textbox';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import LoginWizardPage, {
    header2, innerSmall, circleTopSmall, headingStyle2, row, container, topCircleSizeSmall
} from '../login/login-wizard-page';
import testLabel from '../helpers/test-label';

const imageWelcomeSafe = require('../../assets/welcome-safe.png');

const formStyle = {
    padding: vars.spacing.medium.midi2x,
    justifyContent: 'space-between'
};

const textNormal = {
    color: vars.lighterBlackText,
    fontSize: vars.font.size.normal,
    lineHeight: 24,
    marginBottom: vars.spacing.small.maxi
};

const titleDark = [textNormal, {
    color: vars.black,
    fontWeight: 'bold'
}];

@observer
export default class SignupConfirmBackup extends LoginWizardPage {
    @observable confirmTextSample = tx('title_confirmTextSample');
    @observable confirmText = '';

    get isOk() { return this.confirmTextSample.toLowerCase() === this.confirmText.toLowerCase(); }

    get icon() {
        const width = topCircleSizeSmall * 2;
        const height = width;
        return (
            <View style={[circleTopSmall, { borderWidth: 0 }]}>
                <Image
                    source={imageWelcomeSafe}
                    style={{ width, height }} />
            </View>
        );
    }

    componentDidMount() {
        when(() => this.isOk, () => {
            this._textBox.blur();
            signupState.keyBackedUp = true;
        });
    }

    render() {
        return (
            <View style={container} onLayout={this._layout}>
                <View style={header2}>
                    <Text style={headingStyle2}>{tx('title_AccountKey')}</Text>
                </View>
                <View style={{ flex: 0.7, flexGrow: 1, alignItems: 'flex-start' }}>
                    <View style={innerSmall}>
                        <View style={formStyle}>
                            <Text style={titleDark}>{tx('title_confirmTitle')}</Text>
                            <Text style={textNormal}>{tx('title_confirmContent1')} </Text>
                            <Text style={textNormal}>{tx('title_confirmContent2')}</Text>
                            <Text style={textNormal}>{tx('title_confirmTextInput', { sample: this.confirmTextSample })}</Text>
                            <View style={{ flex: 1, flexGrow: 1, justifyContent: 'center' }}>
                                <TextBox
                                    customIcon={this.isOk ? 'check' : null}
                                    disabled={this.isOk}
                                    ref={ref => { this._textBox = ref; }}
                                    lowerCase key="usernameLogin"
                                    state={this}
                                    name="confirmText"
                                    placeholder={this.confirmTextSample}
                                    {...testLabel('confirmText')}
                                    hint={this.confirmTextSample} />
                            </View>
                        </View>
                    </View>
                    {this.icon}
                </View>
                <View style={[row, { justifyContent: 'space-between' }]}>
                    {this.button('button_back', () => signupState.prev())}
                    {this.button('button_finish', () => signupState.next(), false, !signupState.keyBackedUp)}
                </View>
                <ActivityOverlay large visible={signupState.isInProgress} />
            </View>
        );
    }
}
