import { observable, action, when, reaction } from 'mobx';
import { chatStore, chatInviteStore, clientApp, warnings } from '../../lib/icebear';
import RoutedState from '../routes/routed-state';
import sounds from '../../lib/sounds';
import { tx } from '../utils/translator';
import routes from '../routes/routes';
import { promiseWhen } from '../helpers/sugar';

class ChatState extends RoutedState {
    @observable store = chatStore;
    @observable chatInviteStore = chatInviteStore;
    @observable collapseChannels = false;
    @observable collapseDMs = false;
    @observable selfNewMessageCounter = 0;
    LIMIT_PEOPLE_DM = 1;

    // Only one list can be shown at a time
    @observable collapseFirstChannelInfoList = false;

    // to be able to easily refactor, keep the name "chatStore"
    get chatStore() { return this.store; }

    _loading = true;

    constructor() {
        super();
        this.chatStore.events.on(this.chatStore.EVENT_TYPES.messagesReceived, () => {
            console.log('chat-state.js: messages received');
            sounds.received();
        });

        reaction(() => this.chatStore.activeChat, chat => {
            if (chat) {
                console.log(`chat-store switched to ${chat.id}`);
                console.log(`chat-store: loading ${chat.id}`);
                this.loading = false;
            } else if (this.routerMain && this.routerMain.route === 'chats') this.routerMain.chats();
        }, true);
    }

    @action async init() {
        const { store } = this;
        store.loadAllChats();
        await promiseWhen(() => store.loaded);
        await promiseWhen(
            () => store.chats.filter(c => c.headLoaded).length === store.chats.length,
            5000
        );
    }

    get currentChat() {
        return this.chatStore.activeChat;
    }

    @observable _loading = true;

    get loading() {
        const c = this.currentChat;
        return this._loading ||
            this.chatStore.loading || c && (c.loadingMeta || c.loadingInitialPage);
    }

    set loading(v) {
        this._loading = v;
    }

    get title() {
        if (this.routerMain.currentIndex === 0) return tx('title_chats');
        return this.currentChat ? this.currentChat.name : '';
    }

    activate(chat) {
        if (chat.id) {
            console.log(`chat-state.js: activating chat ${chat.id}`);
            this.chatStore.activate(chat.id);
        }
    }

    onTransition(active, c) {
        console.log(`chat-state.js: loading all chats`);
        clientApp.isInChatsView = active && !!c;
        this.loading = c && c.loadingMeta;
        if (active) {
            when(() => !this.chatStore.loading, () => {
                if (!this.chatStore.chats.length) this.loading = false;
                c && this.activate(c);
                console.log(`chat-state.js: active: ${c && c.active}, isFocused: ${clientApp.isFocused}, isInChatsView: ${clientApp.isInChatsView}`);
            });
        }
    }

    get unreadMessages() {
        let r = 0;
        this.chatStore.chats.forEach(c => { r += c.unreadCount; });
        return r;
    }

    get canSend() {
        return this.currentChat && this.currentChat.id &&
            !this.currentChat.loadingMessages;
    }

    get canSendAck() {
        return this.canSend && this.currentChat.canSendAck;
    }

    get canSendJitsi() {
        return this.canSend && this.currentChat.canSendJitsi;
    }

    @action async startChat(recipients, isChannel = false, name, purpose) {
        try {
            const chat = this.store.startChat(recipients, isChannel, name, purpose);
            this.loading = true;
            return new Promise(resolve => when(() => !chat.loadingMeta, () => {
                this.loading = false;
                this.routerMain.chats(chat, true);
                resolve(chat);
            }));
        } catch (e) {
            this.loading = false;
            warnings.add(e.message);
            console.error(e);
            return null;
        }
    }

    @action async startChatAndShareFiles(recipients, file) {
        if (!file) return;
        await this.store.startChatAndShareFiles(recipients, file);
        this.routerMain.chats(this.store.activeChat, true);
    }

    @action addMessage(msg) {
        this.selfNewMessageCounter++;
        this.currentChat && msg &&
            this.currentChat.sendMessage(msg).catch(sounds.destroy);
    }

    @action shareFiles(files) {
        this.selfNewMessageCounter++;
        this.currentChat && files && files.length &&
            this.currentChat.shareFiles(files).catch(sounds.destroy);
    }

    @action addVideoMessage(link) {
        this.selfNewMessageCounter++;
        this.currentChat && this.currentChat.createVideoCall(link);
    }

    @action addAck() {
        this.selfNewMessageCounter++;
        this.currentChat && this.currentChat
            .sendAck().catch(sounds.destroy);
    }

    get titleAction() {
        if (this.routerMain.currentIndex === 0) return null;
        return this.currentChat ? (() => {
            this.currentChat.isChannel ? this.routerModal.channelInfo() : this.routerModal.chatInfo();
        }) : null;
    }

    fabAction() {
        console.log(`chat-state.js: fab action`);
        routes.modal.compose();
    }
}

export default new ChatState();
