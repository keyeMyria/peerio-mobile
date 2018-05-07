import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import { tu } from '../utils/translator';
import testLabel from '../helpers/test-label';

export default {
    whiteTextButton(text, onPress, disabled) {
        const buttonStyle = {
            padding: vars.spacing.medium.mini,
            marginTop: vars.spacing.small.mini2x,
            opacity: disabled ? 0 : 1
        };
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={buttonStyle}>
                <Text style={{ backgroundColor: 'transparent', color: disabled ? vars.txtMedium : vars.white }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    },

    whiteTextButtonNoPadding(text, onPress, disabled, textStyle = {}) {
        const buttonStyle = {
            backgroundColor: 'transparent',
            color: disabled ? vars.txtMedium : vars.white
        };
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ opacity: disabled ? 0 : 1 }}>
                <Text style={[textStyle, buttonStyle]}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    },

    blueTextButton(text, onPress, disabled, hidden, accessibilityId) {
        const opacity = hidden ? 0.0 : 1.0;
        const buttonStyle = {
            paddingRight: vars.spacing.small.maxi2x,
            paddingVertical: vars.spacing.small.maxi
        };
        return (
            <View style={{ opacity }}>
                <TouchableOpacity
                    {...testLabel(accessibilityId)}
                    disabled={disabled}
                    onPress={disabled ? null : onPress}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    style={buttonStyle}>
                    <Text bold style={{ color: disabled ? vars.txtMedium : vars.peerioBlue }}>
                        {tu(text)}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    },

    blueBgButton(text, onPress, disabled, accessibilityId) {
        const buttonStyle = {
            borderRadius: 2,
            paddingHorizontal: vars.spacing.medium.mini2x,
            paddingVertical: vars.spacing.small.maxi,
            backgroundColor: disabled ? vars.txtMedium : vars.peerioBlue
        };
        return (
            <TouchableOpacity
                {...testLabel(accessibilityId)}
                disabled={disabled}
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={buttonStyle}>
                <Text bold style={{ textAlign: 'center', color: vars.white }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    },

    roundBlueBgButton(text, onPress, disabled, accessibilityId) {
        const touchableStyle = {
            height: vars.button.touchableHeight,
            alignItems: 'center',
            justifyContent: 'center'
        };
        const buttonStyle = {
            minWidth: vars.button.minWidth,
            height: vars.button.buttonHeight,
            paddingHorizontal: vars.button.paddingHorizontal,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: vars.button.borderRadius,
            backgroundColor: disabled ? vars.mediumGrayBg : vars.peerioBlue
        };
        return (
            <TouchableOpacity
                {...testLabel(accessibilityId)}
                disabled={disabled}
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={touchableStyle}>
                <View style={buttonStyle}>
                    <Text bold style={{ textAlign: 'center', color: vars.white }}>
                        {tu(text)}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    },

    redTextButton(text, onPress, disabled) {
        const buttonStyle = {
            paddingRight: vars.spacing.small.maxi2x,
            paddingVertical: vars.spacing.small.maxi
        };
        return (
            <TouchableOpacity
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={buttonStyle}>
                <Text bold style={{ color: disabled ? vars.txtMedium : vars.red }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }
};
