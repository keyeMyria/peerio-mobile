import React from 'react';
import { observable, action } from 'mobx';
import { Image, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import buttons from '../helpers/buttons';
import BackIcon from '../layout/back-icon';
import { contactStore } from '../../lib/icebear';
import routerMain from '../routes/router-main';
import chatState from '../messaging/chat-state';
import AvatarCircle from '../shared/avatar-circle';
import icons from '../helpers/icons';
import ProgressOverlay from '../shared/progress-overlay';
import { invitationState } from '../states';
import IdentityVerificationNotice from './identity-verification-notice';

const emojiTada = require('../../assets/emoji/tada.png');

const container = {
    flex: 1,
    flexGrow: 1,
    paddingTop: vars.dmInvitePaddingTop,
    alignItems: 'center'
};

const emojiStyle = {
    alignSelf: 'center',
    width: vars.iconSizeMedium,
    height: vars.iconSizeMedium,
    marginBottom: vars.spacing.small.mini2x
};

const headingStyle = {
    color: vars.lighterBlackText,
    textAlign: 'center',
    fontSize: vars.font.size.bigger,
    lineHeight: 22,
    marginBottom: vars.spacing.medium.maxi
};

const buttonContainer = {
    flexDirection: 'row',
    marginTop: vars.spacing.large.midi2x,
    justifyContent: 'center'
};

@observer
export default class DmContactInvite extends SafeComponent {
    @observable waiting = false;

    get invitation() { return invitationState.currentInvitation; }

    get leftIcon() { return <BackIcon action={routerMain.chats} />; }

    @action.bound decline() {
        routerMain.chats();
        // TODO call SDK decline
    }

    // TODO call SDK accept
    @action.bound async accept() {
        const { invitation } = this;
        const { id } = invitation;
        let newChat = null;
        try {
            this.waiting = true;
            newChat = await chatState.store.getChatWhenReady(id);
        } catch (e) {
            console.error(e);
        }
        routerMain.chats(newChat);
    }

    renderThrow() {
        const { invitation } = this;
        const inviter = contactStore.getContact(invitation.name);
        // TODO determine if user is existing or new, modify title_dmInviteHeading copy accordingly
        // const headerCopy = !newUser ? tx('title_dmInviteHeading') : tx('title_newUserDmInviteHeading');
        const headerCopy = tx('title_dmInviteHeading');
        return (
            <View style={container}>
                <Image source={emojiTada} style={emojiStyle} resizeMode="contain" />
                <Text style={headingStyle}>
                    {tx(headerCopy, { contactName: inviter.username })}
                </Text>
                <View style={{ alignItems: 'center' }}>
                    <AvatarCircle contact={inviter} large />
                </View>
                <Text style={{ textAlign: 'center', marginBottom: vars.spacing.medium.maxi2x }}>
                    {inviter.usernameTag}
                </Text>
                <IdentityVerificationNotice />
                <View style={buttonContainer}>
                    <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: vars.spacing.medium.maxi2x }}>
                        {buttons.blueTextButton(tx('button_dismiss'), this.decline)}
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                        {buttons.roundBlueBgButton(tx('button_message'), this.accept)}
                    </View>
                </View>
                <ProgressOverlay enabled={this.waiting} />
            </View>);
    }
}
