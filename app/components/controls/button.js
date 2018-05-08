import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';

export default class Button extends Component {
    render() {
        const { textStyle } = this.props;
        const opacity = { opacity: this.props.disabled ? 0.5 : 1 };
        const text = this.props.text || '';
        const press = () => {
            !this.props.disabled && this.props.onPress && this.props.onPress();
            return true;
        };
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                pressRetentionOffset={offset}
                onPress={press}
                accessible={this.props.accessible}
                accessibilityLabel={this.props.accessibilityLabel}
                testID={this.props.testID}>
                <View style={this.props.style}>
                    <Text bold={this.props.bold} style={[{ backgroundColor: 'transparent', color: vars.highlight }, textStyle, opacity]}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

Button.propTypes = {
    style: PropTypes.any,
    textStyle: PropTypes.any,
    onPress: PropTypes.any,
    text: PropTypes.any.isRequired,
    caps: PropTypes.bool,
    disabled: PropTypes.bool,
    accessible: PropTypes.bool,
    accessibilityLabel: PropTypes.string,
    testID: PropTypes.string,
    bold: PropTypes.bool
};
