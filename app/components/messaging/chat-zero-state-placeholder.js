import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Image } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';

const redArrowSrc = require('../../assets/zero_chat_state/arrow-red.png');
const roomSrc = require('../../assets/zero_chat_state/zeroState-room-big.png');
const dmSrc = require('../../assets/zero_chat_state/zeroState-dm-big.png');

const container = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center'
};

const wrapper = {
    flex: 1,
    flexGrow: 1
};

const titleStyle = {
    color: vars.peerioBlue,
    fontSize: vars.font.size.massive,
    marginTop: vars.spacing.medium.maxi2x,
    marginBottom: vars.isDeviceScreenBig ? vars.spacing.medium.mini : vars.spacing.small.mini2x,
    textAlign: 'center'
};

const headingStyle = {
    color: vars.subtleTextBold,
    fontSize: vars.font.size.big,
    marginTop: vars.isDeviceScreenBig ? vars.spacing.large.midi : vars.spacing.large.mini2x,
    marginBottom: vars.isDeviceScreenBig ? vars.spacing.small.midi2x : vars.spacing.small.mini2x,
    justifyContent: 'flex-start'
};

const descriptionStyle = {
    color: vars.subtleTextBold,
    fontSize: vars.font.size.normal,
    marginBottom: vars.isDeviceScreenBig ? vars.spacing.small.mini2x : vars.spacing.small.mini
};

@observer
export default class ChatZeroStatePlaceholder extends SafeComponent {
    title() {
        return (
            <View>
                <Text italic style={titleStyle} {...testLabel('title_startSecureChat')}>
                    {tx('title_startSecureChat')}
                </Text>
                <Image
                    source={redArrowSrc}
                    style={{
                        width: vars.isDeviceScreenBig ? vars.iconSizeHuge : vars.iconSizeLarge2x,
                        height: vars.isDeviceScreenBig ? vars.iconSizeHuge : vars.iconSizeLarge2x,
                        position: 'absolute',
                        right: vars.iconPadding
                    }}
                />
            </View>
        );
    }

    roomsUI() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text semidbold style={headingStyle}>
                    {tx('title_channels')}
                </Text>
                <Text style={descriptionStyle}>
                    {tx('title_zeroChatRoomDescription')}
                </Text>
                <Image
                    source={roomSrc}
                    style={{
                        width: vars.chatZeroStateImageWidth,
                        height: vars.chatZeroStateImageHeight
                    }}
                />
            </View>);
    }

    dmUI() {
        return (
            <View style={{ alignItems: 'center' }}>
                <Text semibold style={headingStyle}>
                    {tx('title_zeroChatDmHeading')}
                </Text>
                <Text style={descriptionStyle}>
                    {tx('title_zeroChatDmDescription')}
                </Text>
                <Image
                    source={dmSrc}
                    style={{
                        width: vars.chatZeroStateImageWidth,
                        height: vars.chatZeroStateImageHeight
                    }}
                />
            </View>);
    }

    renderThrow() {
        return (
            <View style={container}>
                <View style={wrapper}>
                    {this.title()}
                    {this.roomsUI()}
                    {this.dmUI()}
                </View>
            </View>
        );
    }
}
