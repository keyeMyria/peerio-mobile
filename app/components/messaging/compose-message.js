import React, { Component } from 'react';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import ContactSelectorUniversal from '../contacts/contact-selector-universal';
import chatState from './chat-state';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';

export default class ComposeMessage extends Component {
    exit = () => chatState.routerModal.discard();
    action = contacts => chatState.startChat(contacts);

    get roomRedirectText() {
        return (
            <View style={{ marginTop: vars.spacing.small.midi2x, flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ fontSize: vars.font.size.normal, color: vars.subtleText }}>
                    {tx('title_chatWithGroup')}
                </Text>
                <Text style={{ fontSize: vars.font.size.normal, color: vars.peerioBlue }}>
                    {tx('title_createRoom')}
                </Text>
            </View>);
    }

    render() {
        return (
            <ContactSelectorUniversal
                onExit={() => chatState.routerModal.discard()}
                subTitleComponent={this.roomRedirectText}
                action={contacts => chatState.startChat(contacts)}
                inputPlaceholder="title_TryUsernameOrEmail"
                title="title_newDirectMessage"
                limit={chatState.LIMIT_PEOPLE_DM} />
        );
    }
}
