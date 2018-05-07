import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class ChatChannelInvitesSection extends SafeComponent {
    renderThrow() {
        const { data, onPress, title } = this.props;
        if (!data || data <= 0) return null;

        const container = {
            marginHorizontal: 16,
            marginTop: 10,
            marginBottom: 6,
            borderRadius: 5,
            borderColor: vars.peerioBlue,
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center'
        };

        const textStyle = {
            color: vars.peerioBlue,
            paddingVertical: 9,
            fontSize: vars.font.size.bigger
        };

        return (
            <View >
                <TouchableOpacity disabled={!onPress} onPress={onPress} style={container} pressRetentionOffset={vars.pressRetentionOffset}>
                    <Text semibold style={textStyle}>{title}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

ChatChannelInvitesSection.propTypes = {
    data: PropTypes.any,
    title: PropTypes.any,
    onPress: PropTypes.any
};
