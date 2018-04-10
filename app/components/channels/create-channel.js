import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Text, ScrollView, Dimensions, LayoutAnimation, Keyboard } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction, action } from 'mobx';
import ContactSelectorUniversal from '../contacts/contact-selector-universal';
import { tu, tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import ChannelUpgradeOffer from './channel-upgrade-offer';
import CreateChannelTextBox from './create-channel-textbox';
import chatState from '../messaging/chat-state';
import { User, config, socket } from '../../lib/icebear';
import SnackBarConnection from '../snackbars/snackbar-connection';
import testLabel from '../helpers/test-label';

const fillView = { flex: 1, flexGrow: 1, backgroundColor: vars.darkBlueBackground05 };

const { width } = Dimensions.get('window');

const card = {
    width,
    backgroundColor: vars.darkBlueBackground05,
    flexGrow: 1
};

const titleStyle = {
    color: vars.peerioBlue,
    fontSize: vars.font.size.bigger,
    marginLeft: vars.spacing.small.maxi
};

@observer
export default class CreateChannel extends Component {
    @observable channelName = '';
    @observable channelPurpose = '';
    @observable step = 0;
    @observable inProgress = false;

    componentDidMount() {
        reaction(() => this.step, () => {
            this._disableScrollUpdate = true;
            setTimeout(() => this._scrollView.scrollToEnd(), 0);
        });
        reaction(() => this.step, () => LayoutAnimation.easeInEaseOut());
    }

    refContactSelector = ref => { this._contactSelector = ref; };

    next() {
        Keyboard.dismiss();
        if (this.step === 0) {
            this.step = 1;
        } else {
            if (this.inProgress) return;
            this._contactSelector.action();
        }
    }

    @action.bound async createChannel(contacts) {
        this.inProgress = true;
        await chatState.startChat(contacts, true, this.channelName, this.channelPurpose);
        chatState.routerModal.discard();
    }

    get isValid() {
        return this.channelName.trim().length > 0
            && this.channelName.trim().length <= config.chat.maxChatNameLength
            && socket.authenticated
            && !this.inProgress;
    }

    nextIcon() {
        if (this.step === 1) return icons.text(tu('button_go'), () => this.next(), { color: vars.peerioBlue }, 'buttonGo');
        return icons.text(tu('button_next'), () => this.next(), { color: vars.peerioBlue }, 'buttonNext');
    }

    nextIconDisabled() {
        if (this.step === 1) return icons.disabledText(tu('button_go'));
        return icons.disabledText(tu('button_next'));
    }

    exitRow(testId) {
        const container = {
            backgroundColor: vars.darkBlueBackground15,
            flex: 0,
            flexDirection: 'row',
            alignItems: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: vars.statusBarHeight * 2,
            paddingBottom: 0,
            marginBottom: vars.spacing.medium.mini2x,
            height: vars.headerHeight
        };
        const textStyle = {
            textAlign: 'center',
            flexGrow: 1,
            flexShrink: 1,
            fontSize: vars.font.size.huge,
            fontWeight: vars.font.weight.semiBold,
            color: vars.textBlack54
        };
        return (
            <View style={container}
                {...testLabel(testId)}
                accessible={false}>
                {icons.dark('close', () => chatState.routerModal.discard())}
                <Text style={textStyle}>{tx('button_createChannel')}</Text>
                {this.isValid ? this.nextIcon() : this.nextIconDisabled()}
            </View>
        );
    }

    get firstPage() {
        return (
            <View style={card}>
                {this.exitRow()}
                <CreateChannelTextBox
                    labelText="title_channelName"
                    placeholderText="title_channelNamePlaceholder"
                    property="channelName"
                    state={this}
                    bottomText={tx('title_channelNameLimit',
                        { maxChatNameLength: config.chat.maxChatNameLength })}
                    maxLength={config.chat.maxChatNameLength} />
                <CreateChannelTextBox
                    labelText="title_roomPurpose"
                    placeholderText="title_channelTopicPlaceholder"
                    property="channelPurpose"
                    state={this}
                    bottomText="title_channelTopicOptional"
                    maxLength={config.chat.maxChatPurposeLength}
                    multiline />
            </View>
        );
    }

    get secondPage() {
        return this.step === 1 ? (
            <View style={card}>
                {this.exitRow('chooseContacts')}
                <ContactSelectorUniversal
                    multiselect
                    hideHeader
                    action={this.createChannel}
                    ref={this.refContactSelector}
                    leftIconComponent={<Text style={titleStyle}>{tx('title_with')}</Text>}
                    inputPlaceholder="title_roomParticipants" />
            </View>
        ) : <View style={card} />;
    }

    get scrollView() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                ref={sv => { this._scrollView = sv; }}
                key="scroll" horizontal pagingEnabled removeClippedSubviews={false}>
                {this.firstPage}
                {this.secondPage}
            </ScrollView>
        );
    }

    get paywall() {
        return <View style={card}>{this.exitRow()}<ChannelUpgradeOffer /></View>;
    }

    render() {
        return (
            <View style={fillView} contentContainerStyle={fillView}>
                {User.current.channelsLeft <= 0 ? this.paywall : this.scrollView}
                <SnackBarConnection />
            </View>
        );
    }
}

CreateChannel.propTypes = {
    createChat: PropTypes.any
};
