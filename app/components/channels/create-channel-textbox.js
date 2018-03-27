import React, { Component } from 'react';
import { View, Text, TextInput } from 'react-native';
import { observer } from 'mobx-react/native';
import { action } from 'mobx';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import testLabel from '../helpers/test-label';

const height = vars.inputHeight;

const container = {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: vars.spacing.medium.maxi,
    marginHorizontal: vars.spacing.medium.mini2x,
    marginBottom: vars.spacing.small.midi2x,
    borderColor: vars.bg,
    borderWidth: 1,
    height,
    borderRadius: height
};

const placeholderStyle = {
    flexGrow: 1,
    height,
    marginLeft: vars.spacing.small.midi,
    fontSize: vars.font.size.normal
};

const bottomTextStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.txtDate,
    marginLeft: vars.spacing.large.midixx,
    marginBottom: vars.spacing.medium.mini2x
};

const titleStyle = {
    color: vars.bg,
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
                        style={placeholderStyle}
                        maxLength={maxLength}
                        multiline={multiline}
                        {...testLabel(testID)} />
                </View>
                <Text style={bottomTextStyle}>{tx(bottomText)}</Text>
            </View>
        );
    }
}
