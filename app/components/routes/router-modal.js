import React from 'react';
import { observable } from 'mobx';
import Router from './router';
import ComposeMessage from '../messaging/compose-message';
import CreateChannel from '../channels/create-channel';
import ChannelAddPeople from '../messaging/channel-add-people';
import FileShare from '../files/file-share';
import FileMove from '../files/file-move';
import FileChooseRecipient from '../files/file-choose-recipient';
import ContactView from '../contacts/contact-view';
import ChatInfo from '../messaging/chat-info';
import ChannelInfo from '../messaging/channel-info';
import PinModalAsk from '../controls/pin-modal-ask';
import AccountUpgradeSwiper from '../settings/account-upgrade-swiper';
import popupState from '../layout/popup-state';
import routes from './routes';
import { vars } from '../../styles/styles';
import { uiState } from '../states';

class RouterModal extends Router {
    @observable animating = false;
    resolver = null;

    constructor() {
        super();
        routes.modal = this;
        this.add('compose', ComposeMessage);
        this.add('createChannel', CreateChannel);
        this.add('channelAddPeople', ChannelAddPeople);
        this.add('shareFileTo', FileShare);
        this.add('changeRecipient', FileChooseRecipient);
        this.add('moveFileTo', FileMove);
        this.add('contactView', ContactView);
        this.add('askPin', PinModalAsk, true);
        this.add('chatInfo', ChatInfo);
        this.add('channelInfo', ChannelInfo);
        this.add('accountUpgradeSwiper', AccountUpgradeSwiper, true, true);
    }

    add(route, component, isWhite) {
        const r = super.add(route, component);
        r.isWhite = isWhite;
        this[route] = async () => {
            await uiState.hideAll();
            popupState.discardAllPopups();
            this.flushResolver();
            r.transition();
            return new Promise(resolve => {
                this.resolver = resolve;
            });
        };
    }

    flushResolver(value) {
        if (this.resolver) {
            console.log('router-modal.js: auto-resolving unclosed resolver');
            const { resolver } = this;
            // wait for modal to close
            setTimeout(() => resolver(value), vars.animationDuration);
            this.resolver = null;
        }
    }

    async discard(value) {
        await uiState.hideAll();
        this.flushResolver(value);
        this.route = null;
    }

    get isBlackStatusBar() {
        return !this.animating && this.current && !this.current.isWhite;
    }

    get modal() {
        return this.current ? React.createElement(this.current.component) : null;
    }
}

export default new RouterModal();
