import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TextInput, Platform } from 'react-native';
import { vars } from '../../styles/styles';

const height = vars.searchInputHeight;
const fontSize = vars.font.size.bigger;
const marginTop = Platform.OS === 'android' ? (height - fontSize + 2) / 2 : 0;

const container = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: vars.spacing.small.midi2x,
    marginVertical: vars.spacing.small.midi,
    marginHorizontal: vars.spacing.medium.mini2x,
    borderColor: vars.black12,
    borderWidth: 1,
    height,
    borderRadius: height
};

const placeholderStyle = {
    flexGrow: 1,
    height,
    lineHeight: height * 1.5,
    paddingTop: 0,
    marginTop,
    marginLeft: vars.spacing.small.midi,
    fontSize
};

export default class SearchBar extends Component {
    render() {
        const { textValue, placeholderText, onChangeText, onSubmit, leftIcon, rightIcon, ref } = this.props;
        return (
            <View>
                <View style={container}>
                    {leftIcon}
                    <TextInput
                        underlineColorAndroid="transparent"
                        value={textValue}
                        returnKeyType="done"
                        onSubmitEditing={onSubmit}
                        onChangeText={onChangeText}
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder={placeholderText}
                        ref={ref}
                        style={placeholderStyle} />
                    {rightIcon}
                </View>
            </View>
        );
    }
}

SearchBar.propTypes = {
    textValue: PropTypes.any,
    placeholderText: PropTypes.any,
    onChangeText: PropTypes.any,
    onSubmit: PropTypes.any,
    leftIcon: PropTypes.any,
    rightIcon: PropTypes.any,
    ref: PropTypes.any
};
