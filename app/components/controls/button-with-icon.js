import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';

const defaultTextStyle = {
    backgroundColor: 'transparent',
    paddingTop: vars.spacing.small.mini
};

const containerStyle = {
    flexDirection: 'row',
    justifyContent: 'center'
};

export default class ButtonWithIcon extends Component {
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
                {...testLabel(this.props.accessibilityLabel)}>
                <View style={[this.props.style, containerStyle]}>
                    <Icon
                        style={{ paddingHorizontal: 7 }}
                        name={this.props.iconName}
                        size={vars.iconSize}
                        color="gray"
                    />
                    <Text bold={this.props.bold} style={[{ color: vars.highlight }, defaultTextStyle, textStyle, opacity]}>
                        {text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}

ButtonWithIcon.propTypes = {
    style: PropTypes.any,
    textStyle: PropTypes.any,
    onPress: PropTypes.any,
    text: PropTypes.any.isRequired,
    caps: PropTypes.bool,
    disabled: PropTypes.bool,
    testID: PropTypes.string,
    bold: PropTypes.bool,
    iconName: PropTypes.string,
    accessible: PropTypes.bool,
    accessibilityLabel: PropTypes.string
};
