import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';

@observer
export default class AccountUpgradeToggle extends Component {
    render() {
        const { highlight, left, text1, text2 } = this.props;
        const toggleContainer = {
            backgroundColor: highlight ? 'white' : 'transparent',
            borderWidth: 2,
            borderColor: 'white',
            flex: 1,
            flexGrow: 1,
            padding: vars.spacing.small.mini2x,
            alignItems: 'center',
            marginRight: left ? vars.spacing.medium.midi : 0
        };
        const textStyle = {
            color: highlight ? 'black' : 'white'
        };

        const text1Style = [textStyle, {
            fontSize: vars.font.size.smaller
        }];

        const text2Style = [textStyle, {
            opacity: 0.7
        }];

        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                pressRetentionOffest={vars.pressRetentionOffest}
                style={toggleContainer}>
                <Text bold style={text1Style}>{text1}</Text>
                <Text style={text2Style}>{text2}</Text>
            </TouchableOpacity>
        );
    }
}

AccountUpgradeToggle.propTypes = {
    onPress: PropTypes.any,
    highlight: PropTypes.bool,
    left: PropTypes.bool,
    text1: PropTypes.string,
    text2: PropTypes.string
};
