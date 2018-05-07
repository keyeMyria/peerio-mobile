import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import chatState from './chat-state';
import testLabel from '../helpers/test-label';

@observer
export default class ChannelListItem extends SafeComponent {
    onPress = () => {
        const { chat, onPress } = this.props;
        if (onPress) return onPress(chat);
        return chatState.routerMain.chats(chat);
    };

    renderThrow() {
        if (chatState.collapseChannels) return null;
        const { chat } = this.props;
        const { name, unreadCount, headLoaded } = chat;
        if (!headLoaded) return null;
        if (!chat) return null;
        const containerStyle = {
            height: vars.chatListItemHeight,
            paddingHorizontal: vars.spacing.medium.midi,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: vars.white,
            flexDirection: 'row'
        };

        const textStyle = {
            fontSize: vars.font.size.bigger,
            color: vars.subtleText
        };

        const textUnreadStyle = { color: vars.unreadTextColor };

        const circleStyle = {
            width: vars.unreadCircleWidth,
            height: vars.unreadCircleHeight,
            borderRadius: 14,
            backgroundColor: vars.peerioTeal,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const textCircleStyle = {
            fontSize: vars.font.size.normal,
            color: vars.badgeText
        };
        const hasUnread = unreadCount > 0;
        return (
            <View style={{ backgroundColor: vars.chatItemPressedBackground }}>
                <TouchableOpacity
                    {...testLabel(name)}
                    onPress={this.onPress}
                    style={containerStyle}
                    pressRetentionOffset={vars.pressRetentionOffset}>
                    <Text semibold={hasUnread} style={[textStyle, (hasUnread && textUnreadStyle)]}>
                        {`# ${name}`}
                    </Text>
                    {unreadCount > 0 && <View style={circleStyle}><Text semibold style={textCircleStyle}>{unreadCount}</Text></View>}
                </TouchableOpacity>
            </View>
        );
    }
}

ChannelListItem.propTypes = {
    chat: PropTypes.any.isRequired
};
