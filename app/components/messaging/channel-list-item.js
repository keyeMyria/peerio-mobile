import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity } from 'react-native';
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
            fontSize: vars.fontTitleSize,
            color: vars.txtDark
        };

        const textUnreadStyle = {
            fontWeight: 'bold'
        };

        const circleRadius = 12;
        const circleStyle = {
            width: circleRadius * 2,
            height: circleRadius * 2,
            borderRadius: circleRadius,
            backgroundColor: vars.bg,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const textCircleStyle = {
            fontSize: vars.font.size.small,
            fontWeight: 'bold',
            color: vars.white
        };

        return (
            <View style={{ backgroundColor: vars.bg }}>
                <TouchableOpacity
                    {...testLabel(name)}
                    onPress={this.onPress}
                    style={containerStyle} pressRetentionOffset={vars.pressRetentionOffset}>
                    <Text style={[textStyle, (unreadCount > 0 && textUnreadStyle)]}>
                        {`# ${name}`}
                    </Text>
                    {unreadCount > 0 && <View style={circleStyle}><Text style={textCircleStyle}>{unreadCount}</Text></View>}
                </TouchableOpacity>
            </View>
        );
    }
}

ChannelListItem.propTypes = {
    chat: PropTypes.any.isRequired
};
