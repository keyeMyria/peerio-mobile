import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';

@observer
export default class CheckBox extends Component {
    toggle() {
        this.props.isChecked = !this.props.isChecked;
        this.props.onChange && this.props.onChange(this.props.isChecked);
    }

    render() {
        const { isChecked } = this.props;
        const borderColor = isChecked ? vars.peerioBlue : 'gray';
        const backgroundColor = isChecked ? vars.peerioBlueBackground15 : undefined;
        const container = {
            flexDirection: 'row',
            flexGrow: 1,
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingVertical: vars.spacing.medium.mini2x
        };
        const checkbox = {
            borderRadius: 2,
            borderWidth: 2,
            borderColor,
            backgroundColor,
            height: 16,
            width: 16,
            marginHorizontal: vars.spacing.small.midi2x
        };
        const text = {
            color: '#000000AA',
            height: 20
        };
        return (
            <TouchableOpacity
                {...testLabel(this.props.accessibilityLabel)}
                onPress={() => this.toggle()}
                pressRetentionOffset={vars.retentionOffset}
                style={container}>
                <Text style={text}>{this.props.text}</Text>
                <View style={checkbox}>
                    {this.props.isChecked && <Icon name="check" color={borderColor} />}
                </View>
            </TouchableOpacity>
        );
    }
}

CheckBox.propTypes = {
    text: PropTypes.any,
    isChecked: PropTypes.bool,
    onChange: PropTypes.any
};
