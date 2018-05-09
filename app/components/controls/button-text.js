import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import Text from '../controls/custom-text';

@observer
export default class ButtonText extends SafeComponent {
    renderThrow() {
        const { text, style, textColor, secondary, disabled, onPress, testID } = this.props;
        let fontColor;
        if (disabled) fontColor = vars.extraSubtleText;
        else if (secondary) fontColor = vars.subtleText;
        else if (textColor) fontColor = textColor;
        else fontColor = vars.peerioBlue;
        const padding = vars.spacing.small.maxi2x;
        const touchable = {
            padding
        };

        return (
            <TouchableOpacity
                {...testLabel(`popupButton-${testID}`)}
                pressRetentionOffset={vars.retentionOffset}
                style={touchable}
                disabled={disabled}
                onPress={disabled ? null : onPress}>
                <Text bold style={[style, { color: fontColor }]}>
                    {text.toUpperCase ? text.toUpperCase() : text}
                </Text>
            </TouchableOpacity>
        );
    }
}

ButtonText.propTypes = {
    text: PropTypes.any,
    textColor: PropTypes.any,
    testID: PropTypes.any,
    onPress: PropTypes.any,
    secondary: PropTypes.bool,
    style: PropTypes.any
};
