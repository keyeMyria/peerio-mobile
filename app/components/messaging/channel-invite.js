import React from 'react';
import { action, observable } from 'mobx';
import { Image, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { invitationState } from '../states';
import buttons from '../helpers/buttons';
import ButtonText from '../controls/button-text';
import BackIcon from '../layout/back-icon';
import { User, chatInviteStore, contactStore } from '../../lib/icebear';
import routerMain from '../routes/router-main';
import chatState from './chat-state';
import AvatarCircle from '../shared/avatar-circle';
import ChannelUpgradeOffer from '../channels/channel-upgrade-offer';
import ProgressOverlay from '../shared/progress-overlay';
import uiState from '../layout/ui-state';

const emojiTada = require('../../assets/emoji/tada.png');

const headingStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    fontSize: vars.font.size.bigger,
    lineHeight: 22
};

const headingSection = {
    paddingTop: 116,
    flex: 0.6
};

const sectionLine = {
    marginHorizontal: vars.spacing.medium.mini2x,
    borderWidth: 1,
    borderColor: vars.black12
};

const infoSection = {
    paddingTop: vars.spacing.medium.mini2x,
    flex: 0.4,
    alignItems: 'center'
};

const infoText = {
    flexDirection: 'row',
    justifyContent: 'center'
};

const hostedByStyle = {
    color: vars.subtleText,
    fontSize: vars.font.size.normal
};

const hostNameStyle = {
    color: vars.black,
    fontSize: vars.font.size.normal
};

const buttonContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.medium.mini2x,
    justifyContent: 'center'
};

@observer
export default class ChannelInvite extends SafeComponent {
    @observable waiting = false;

    get invitation() { return invitationState.currentInvitation; }

    @action.bound async acceptInvite() {
        const chatId = this.invitation.id;
        chatInviteStore.acceptInvite(chatId);
        let newChat = null;
        try {
            this.waiting = true;
            newChat = await chatState.store.getChatWhenReady(chatId);
        } catch (e) {
            console.error(e);
        }
        // if we failed to accept invite, newChat is null
        // and it just goes to the chat list
        routerMain.chats(newChat);
    }

    @action.bound declineInvite() {
        uiState.declinedChannelId = this.invitation.id;
        routerMain.chats();
    }

    get leftIcon() { return <BackIcon action={routerMain.chats} />; }

    renderThrow() {
        const hasPaywall = User.current.channelsLeft <= 0;
        const host = contactStore.getContact(this.invitation.username);

        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                {!this.waiting && hasPaywall && <ChannelUpgradeOffer />}
                <View style={headingSection}>
                    <Image source={emojiTada}
                        style={{
                            alignSelf: 'center',
                            width: vars.iconSizeMedium,
                            height: vars.iconSizeMedium,
                            marginBottom: vars.spacing.small.mini2x
                        }}
                        resizeMode="contain" />
                    <Text style={headingStyle}>
                        {tx('title_roomInviteHeading')}
                    </Text>
                    <Text style={[headingStyle, { fontWeight: vars.font.weight.bold }]}>
                        #{this.invitation.channelName}
                    </Text>
                    <View style={buttonContainer}>
                        <ButtonText
                            text="Decline"
                            onPress={this.declineInvite}
                            testID="decline"
                            textColor={vars.peerioBlue}
                            style={{ width: vars.roundedButtonWidth, textAlign: 'center' }}
                        />
                        {buttons.uppercasePeerioBlueButton(tx('button_accept'), this.acceptInvite, hasPaywall, null, 'accept')}
                    </View>
                </View>
                <View style={sectionLine} />
                <View style={infoSection}>
                    <View style={infoText}>
                        <Text style={hostedByStyle}>
                            {tx('title_hostedBy')}
                        </Text>
                        <Text style={hostNameStyle}>
                            &nbsp;
                            {host.fullName}
                        </Text>
                    </View>
                    <AvatarCircle contact={host} />
                </View>
                <ProgressOverlay enabled={this.waiting} />
            </View>);
    }
}
