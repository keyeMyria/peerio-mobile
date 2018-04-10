import PropTypes from 'prop-types';
import React from 'react';
import { observable, computed, when } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { t } from '../utils/translator';
import chatState from './chat-state';
import routes from '../routes/routes';
import testLabel from '../helpers/test-label';
import uiState from '../layout/ui-state';
import { chatInviteStore } from '../../lib/icebear';

@observer
export default class ChannelInviteListItem extends SafeComponent {
    @observable animating;
    @observable declinedStyle;

    componentDidMount() {
        this.fadeOutReaction = when(() => uiState.declinedChannelId === this.props.id, () => {
            this.declinedStyle = true;
            setTimeout(() => {
                this.animating = true;
                LayoutAnimation.configureNext({ duration: 2000 });
                LayoutAnimation.easeInEaseOut();
            }, 400);
            chatInviteStore.rejectInvite(this.props.id);
            uiState.declinedChannelId = null;
        });
    }

    componentWillReceiveProps(nextProps) {
        this.animating = false;
        this.declinedStyle = false;
    }

    componentWillUnmount() {
        this.fadeOutReaction();
    }

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
            height: this.animating ? 0 : vars.chatListItemHeight,
            paddingHorizontal: vars.spacing.medium.midi,
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: this.declinedStyle ? vars.chatFadingOutBg : vars.white,
            flexDirection: 'row',
            overflow: 'hidden'
        };

        const textStyle = {
            fontSize: vars.fontTitleSize,
            fontWeight: 'bold',
            color: vars.txtDark,
            textDecorationLine: this.declinedStyle ? 'line-through' : 'none'
        };

        const circleStyle = {
            paddingHorizontal: 4,
            paddingVertical: 1,
            maxWidth: 32,
            borderRadius: 5,
            backgroundColor: vars.peerioBlue,
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center'
        };

        const textNewStyle = {
            fontSize: vars.font.size.smaller,
            color: vars.white
        };

        return (
            <View
                style={{ backgroundColor: vars.chatItemPressedBackground }}
                {...testLabel(channelName)}>
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
