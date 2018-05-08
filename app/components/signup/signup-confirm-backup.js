import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image } from 'react-native';
import { observable, when } from 'mobx';
import Text from '../controls/custom-text';
import ActivityOverlay from '../controls/activity-overlay';
import { vars } from '../../styles/styles';
import signupState from './signup-state';
import { tx } from '../utils/translator';
import LoginWizardPage, {
    header2, innerSmall, circleTopSmall, headingStyle2, row, container, topCircleSizeSmall
} from '../login/login-wizard-page';
import StyledTextInput from '../shared/styled-text-input';
import icons from '../helpers/icons';

const imageWelcomeSafe = require('../../assets/welcome-safe.png');

const textDescription = {
    paddingTop: vars.spacing.medium.midi2x,
    paddingBottom: vars.spacing.small.maxi,
    paddingHorizontal: vars.spacing.medium.midi2x,
    justifyContent: 'space-between'
};

const textNormal = {
    color: vars.lighterBlackText,
    fontSize: vars.font.size.normal,
    lineHeight: 24,
    marginBottom: vars.spacing.small.maxi
};

const titleDark = [textNormal, {
    color: vars.black
}];

@observer
export default class SignupConfirmBackup extends LoginWizardPage {
    @observable confirmTextSample = tx('title_confirmTextSample');
    @observable confirmTextState = observable({ value: '' });

    get isOk() {
        return this.confirmTextSample.toLowerCase() === this.confirmTextState.value.toLowerCase();
    }

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
        when(() => this.isOk, () => { signupState.keyBackedUp = true; });
    }

    get checkIcon() { return icons.colored('check', null, vars.peerioTeal); }

    render() {
        return (
            <View style={container} onLayout={this._layout}>
                <View style={header2}>
                    <Text style={headingStyle2}>{tx('title_AccountKey')}</Text>
                </View>
                <View style={{ flex: 0.7, flexGrow: 1, alignItems: 'flex-start' }}>
                    <View style={innerSmall}>
                        <View style={textDescription}>
                            <Text bold style={titleDark}>{tx('title_confirmTitle')}</Text>
                            <Text style={textNormal}>{tx('title_confirmContent1')} </Text>
                            <Text style={textNormal}>{tx('title_confirmContent2')}</Text>
                            <Text style={textNormal}>{tx('title_confirmTextInput', { sample: this.confirmTextSample })}</Text>
                        </View>
                        <View style={{ flexShrink: 1 }}>
                            <StyledTextInput
                                customIcon={this.isOk && this.checkIcon}
                                state={this.confirmTextState}
                                hint={this.confirmTextSample}
                                ref={ref => { this._textBox = ref; }}
                                lowerCase
                                testID="confirmText" />
                        </View>
                    </View>
                    {this.icon}
                </View>
                <View style={[row, { justifyContent: 'space-between' }]}>
                    {this.button('button_back', () => signupState.prev())}
                    {this.button('button_next', () => signupState.next(), false, !signupState.keyBackedUp)}
                </View>
                <ActivityOverlay large visible={signupState.isInProgress} />
            </View>
        );
    }
}
