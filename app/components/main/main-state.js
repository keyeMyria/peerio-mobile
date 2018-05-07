import { observable, action } from 'mobx';
import { User, chatStore, TinyDb } from '../../lib/icebear';
import keychain from '../../lib/keychain-bridge';
import RoutedState from '../routes/routed-state';
import { popupYes } from '../shared/popups';
import { tx } from '../utils/translator';

class MainState extends RoutedState {
    @observable _loading = false;

    get loading() {
        return this._loading || chatStore.loading;
    }

    set loading(v) {
        this._loading = v;
    }

    @action async activate() {
        // preload app while we ask user about automatic login
        this.routerMain.initial();
    }

    @action async activateAndTransition(/* user */) {
        this.activate();
        this.routes.app.main();
    }

    @action async load() {
        console.log('main-state.js: loading');
        this.loading = true;
        const s = await TinyDb.user.getValue('main-state');
        if (s) {
            this.saved = s;
        }
        this.loading = false;
        console.log('main-state.js: loaded');
    }

    @action async checkPin() {
        const user = User.current;
        const hasPin = await user.hasPasscode();
        if (!hasPin) {
            const skipPIN = `${user.username}::skipPIN`;
            if (!await TinyDb.system.getValue(skipPIN)) {
                await this.routes.modal.createPin();
            }
            await TinyDb.system.setValue(skipPIN, true);
        }
    }

    @action async getKeychainKey(cachedUsername) {
        const username = cachedUsername || User.current.username;
        return (await TinyDb.system.getValue(`user::${username}::keychain`)) || `user::${username}`;
    }

    @action async saveUserKeychain(secureWithTouchID) {
        const user = User.current;
        let keychainKey = await this.getKeychainKey();
        try {
            await keychain.delete(keychainKey);
        } catch (e) {
            console.error(e);
        }
        keychainKey = `user::${user.username}::${(new Date().getTime())}`;
        console.log(`main-state.js: keychain key: ${keychainKey}`);
        await TinyDb.system.setValue(`user::${user.username}::keychain`, keychainKey);
        if (!await keychain.save(keychainKey, user.serializeAuthData(), secureWithTouchID)) {
            await popupYes(null, tx('title_autologinSetFail'));
            console.log('main-state.js: keychain is not saved');
            return;
        }
        console.log('main-state.js: keychain saved');
        user.hasTouchIdCached = true;
    }

    @action async damageUserTouchId() {
        const user = User.current;
        const keychainKey = await this.getKeychainKey();
        await keychain.delete(keychainKey);
        await keychain.save(keychainKey, 'blah');
        console.log('main-state.js: touch id damaged');
        user.hasTouchIdCached = true;
    }

    @action async saveUser() {
        const user = User.current;
        console.log(`mainstate.js: ${user.autologinEnabled}`);
        if (!user.autologinEnabled) {
            const keychainKey = await this.getKeychainKey();
            try {
                await keychain.delete(keychainKey);
            } catch (e) {
                console.error(e);
            }
            return;
        }
        await TinyDb.system.setValue('lastUsername', user.username);
        const skipTouchID = `${user.username}::skipTouchID`;
        const skipTouchIDValue = await TinyDb.system.getValue(skipTouchID);
        if (skipTouchIDValue) {
            console.log('main-state.js: skip touch id');
        }
        await keychain.load();
        let secureWithTouchID = false;
        const touchIdKey = `user::${user.username}::touchid`;
        if (await TinyDb.system.getValue(touchIdKey)) {
            console.log('main-state.js: touch id available and value is set');
            user.hasTouchIdCached = true;
            secureWithTouchID = true;
        }
        if (!user.hasTouchIdCached && !skipTouchIDValue && keychain.available) {
            console.log('main-state.js: touch id available but value is not set');
            console.log('main-state.js: offering to save');
            // TODO: disable touch id offering for now
            secureWithTouchID = false; // await popupYesSkip(tx('title_touchID'), tx('dialog_enableTouchID'));
            await TinyDb.system.setValue(skipTouchID, true);
            await TinyDb.system.setValue(touchIdKey, secureWithTouchID);
        }
        user.secureWithTouchID = secureWithTouchID;
        console.log('main-state.js: saving user');
        await this.saveUserKeychain(secureWithTouchID);
    }

    @action async saveUserTouchID(value) {
        const user = User.current;
        const touchIdKey = `user::${user.username}::touchid`;
        let { secureWithTouchID } = user;
        secureWithTouchID = value;
        try {
            await this.saveUserKeychain(secureWithTouchID);
            await TinyDb.system.setValue(touchIdKey, secureWithTouchID);
            user.secureWithTouchID = secureWithTouchID;
        } catch (e) {
            console.error(e);
        }
    }
}

const mainState = new MainState();

export default mainState;
