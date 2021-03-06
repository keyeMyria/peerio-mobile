import React, { Component } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import testLabel from '../helpers/test-label';
import Text from '../controls/custom-text';

const height = vars.inputHeight;
const fontSize = vars.font.size.normal;

const container = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: vars.spacing.medium.maxi,
    marginHorizontal: vars.spacing.medium.mini2x,
    marginBottom: vars.spacing.small.midi2x,
    borderColor: vars.peerioBlue,
    borderWidth: 1,
    height,
    borderRadius: height
};

const placeholderStyle = {
    flexGrow: 1,
    height,
    marginLeft: vars.spacing.small.midi,
    fontSize,
    fontFamily: vars.peerioFontFamily
};

const bottomTextStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.txtDate,
    marginLeft: vars.spacing.large.midixx,
    marginBottom: vars.spacing.medium.mini2x
};

const titleStyle = {
    color: vars.peerioBlue,
    fontSize: vars.font.size.bigger
};

@observer
export default class CreateChannelTextBox extends Component {
    @action.bound changeText(text) {
        this.props.state[this.props.property] = text;
    }

    render() {
        const { labelText, placeholderText, property, bottomText, maxLength, multiline } = this.props;
        const testID = `textInput-${property}`;
        // hack for v-align, padding top and bottom need to be specified
        let paddingTop = 0;
        if (Platform.OS === 'ios' && multiline) paddingTop = ((height - fontSize) / 2 - 1);
        const style = [placeholderStyle, { paddingTop, paddingBottom: 0 }];
        return (
            <View>
                <View style={container}>
                    <Text style={titleStyle}>{tx(labelText)}</Text>
                    <TextInput
                        underlineColorAndroid="transparent"
                        value={this[property]}
                        returnKeyType="done"
                        blurOnSubmit
                        onChangeText={this.changeText}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder={tx(placeholderText)}
                        style={style}
                        maxLength={maxLength}
                        multiline={multiline}
                        {...testLabel(testID)} />
                </View>
                <Text style={bottomTextStyle}>{tx(bottomText)}</Text>
            </View>
        );
    }
}
