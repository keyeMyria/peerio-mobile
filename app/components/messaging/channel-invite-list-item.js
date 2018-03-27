import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { t } from '../utils/translator';
import chatState from './chat-state';
import routes from '../routes/routes';
import testLabel from '../helpers/test-label';

@observer
export default class ChannelInviteListItem extends SafeComponent {
    onPress = () => {
        const { id, channelName, username } = this.props;
        routes.main.channelInvite({
            channelName,
            id,
            username
        });
    };

    renderThrow() {
        if (chatState.collapseChannels) return null;
        const { channelName } = this.props;
        const containerStyle = {
            height: vars.chatListItemHeight,
            paddingHorizontal: vars.spacing.medium.midi,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: vars.white,
            flexDirection: 'row'
        };

        const textStyle = {
            fontSize: vars.fontTitleSize,
            fontWeight: 'bold',
            color: vars.txtDark
        };

        const circleStyle = {
            paddingHorizontal: 4,
            paddingVertical: 1,
            borderRadius: 5,
            backgroundColor: vars.bgGreen,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const textNewStyle = {
            fontSize: vars.font.size.smallerx,
            color: vars.white
        };

        return (
            <View
                {...testLabel(channelName)}
                style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity
                    onPress={this.onPress}
                    style={containerStyle} pressRetentionOffset={vars.pressRetentionOffset}>
                    <Text
                        style={textStyle}>
                        {`# ${channelName}`}
                    </Text>
                    <View style={circleStyle}>
                        <Text style={textNewStyle}>
                            {t('title_new')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

ChannelInviteListItem.propTypes = {
    id: PropTypes.any.isRequired,
    channelName: PropTypes.any.isRequired,
    username: PropTypes.any.isRequired
};
