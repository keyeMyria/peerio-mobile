import React from 'react';
import { LayoutAnimation, Platform } from 'react-native';
import { observable, reaction, action } from 'mobx';
import Router from './router';
import uiState from '../layout/ui-state';
import SettingsLevel1 from '../settings/settings-level-1';
import SettingsLevel2 from '../settings/settings-level-2';
import SettingsLevel3 from '../settings/settings-level-3';
import Ghosts from '../ghosts/ghosts';
import GhostsLevel1 from '../ghosts/ghosts-level-1';
import Chat from '../messaging/chat';
import ChatList from '../messaging/chat-list';
import Files from '../files/files';
import FileView from '../files/file-view';
import ContactAdd from '../contacts/contact-add';
import ContactView from '../contacts/contact-view';
import ContactList from '../contacts/contact-list';
import ChannelInvite from '../messaging/channel-invite';
import ContactListInvite from '../contacts/contact-list-invite';
import { fileState, ghostState, chatState, settingsState, contactState, contactAddState, invitationState } from '../states';
// import { enablePushNotifications } from '../../lib/push';
import routes from './routes';
import loginState from '../login/login-state';
import preferenceStore from '../settings/preference-store';

class RouterMain extends Router {
    // current route object
    @observable current = null;
    @observable isBackVisible = false;
    @observable isInputVisible = false;
    @observable blackStatusBar = false;
    @observable currentIndex = 0;
    @observable suppressTransition = false;
    @observable chatStateLoaded = false;
    @observable fileStateLoaded = false;
    @observable contactStateLoaded = false;
    @observable loading = false;
    @observable invoked = false;
    _initialRoute = 'chats';

    constructor() {
        super();
        routes.main = this;
        reaction(() => this.currentIndex, i => { this.isBackVisible = i > 0; });
        reaction(() => [this.route, this.currentIndex], () => uiState.hideAll());
        this.add('files', [<Files />, <FileView />], fileState);
        this.add('ghosts', [<Ghosts />, <GhostsLevel1 />], ghostState);
        this.add('chats', [<ChatList />, <Chat />], chatState);
        this.add('contacts', [<ContactList />, <ContactView nonModal />], contactState);
        this.add('contactAdd', [<ContactAdd />], contactAddState);
        this.add('contactInvite', [<ContactListInvite />], contactAddState);
        this.add('settings', [<SettingsLevel1 />, <SettingsLevel2 />, <SettingsLevel3 />], settingsState);
        this.add('channelInvite', [<ChannelInvite />], invitationState);
    }

    @action initialRoute() {
        this[this._initialRoute](null, true);
    }

    get isInitialRoute() {
        return this.route === this._initialRoute;
    }

    @action async initial() {
        if (this.invoked) return;
        this.invoked = true;
        this.loading = true;
        // if (EN === 'peeriomobile') await enablePushNotifications();
        await preferenceStore.init();
        await chatState.init();
        this.chatStateLoaded = true;
        await fileState.init();
        this.fileStateLoaded = true;
        await contactState.init();
        this.contactStateLoaded = true;
        this.loading = false;
        this.initialRoute();
        loginState.transition();
    }

    add(key, components, routeState) {
        const route = super.add(key, null);
        route.components = observable.ref(components);
        route.routeState = routeState;
        this[key] = route.transition = async (item, suppressTransition, index) => {
            await uiState.hideAll();
            if (this.route !== key) {
                !suppressTransition && LayoutAnimation.easeInEaseOut();
                this.onTransition(this.current, false, item);
            }
            this.resetMenus();
            this.current = route;
            this.route = key;

            let newIndex = index;
            if (newIndex === undefined) newIndex = (components.length > 1 && item) ? 1 : 0;
            if (newIndex !== this.currentIndex) {
                !suppressTransition && LayoutAnimation.easeInEaseOut();
            }
            this.currentIndex = newIndex;
            this.onTransition(route, true, item);
            console.log(`router-main: transition to ${this.route}:${this.currentIndex}`);
        };
    }

    get title() {
        return this.current && this.current.routeState ? this.current.routeState.title : null;
    }

    get titleAction() {
        return this.current && this.current.routeState ? this.current.routeState.titleAction : null;
    }

    get pages() {
        return this.current ? this.current.components : [];
    }

    get currentComponent() {
        return this.current && (this.current.components.length > this.currentIndex)
            ? this.current.components[this.currentIndex].type.prototype : {};
    }

    onTransition(route, active, param) {
        try {
            route && route.routeState && route.routeState.onTransition && route.routeState.onTransition(active, param);
        } catch (e) {
            console.error(e);
        }
    }

    @action fabAction() {
        console.log(`router-main.js: fab action`);
        this.current && this.current.routeState && this.current.routeState.fabAction();
    }

    @action async back() {
        await uiState.hideAll();
        if (this.currentIndex > 0) this.currentIndex--;
        this.onTransition(this.current, true);
        if (Platform.OS !== 'android') LayoutAnimation.easeInEaseOut();
        console.log(`router-main: transition to ${this.route}:${this.currentIndex}`);
    }

    @action resetMenus() {
        this.isInputVisible = false;
        this.modalRoute = null;
    }

    @action androidBackHandler() {
        if (this.route === 'files') {
            if (!fileState.currentFolder.isRoot) {
                fileState.currentFolder = fileState.currentFolder.parent;
                return true;
            }
            if (fileState.isFileSelectionMode) {
                fileState.exitFileSelect();
                return true;
            }
        }
        if (this.currentIndex > 0) {
            this.back();
            return true;
        } else if (this.isInitialRoute) {
            return false;
        }
        this.initialRoute();
        return true;
    }
}

const routerMain = new RouterMain();

export default routerMain;
