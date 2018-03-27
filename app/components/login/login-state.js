import { when, observable, action, reaction } from 'mobx';
import RNRestart from 'react-native-restart';
import mainState from '../main/main-state';
import settingsState from '../settings/settings-state';
import { User, validation, fileStore, socket, TinyDb, warnings, config, overrideServer } from '../../lib/icebear';
import keychain from '../../lib/keychain-bridge';
import { rnAlertYesNo } from '../../lib/alerts';
import { popupSignOutAutologin, popupKeychainError } from '../shared/popups';
import { tx } from '../utils/translator';
import RoutedState from '../routes/routed-state';
import routes from '../routes/routes';

const { validators, addValidation } = validation;

const loginConfiguredKey = 'loginConfigured';

class LoginState extends RoutedState {
    @observable username = '';
    @observable usernameValid = null;
    @observable firstName = '';
    @observable lastName = '';
    @observable passphrase = '';
    @observable passphraseValidationMessage = null;
    @observable changeUser = false;
    @observable current = 0;
    @observable selectedAutomatic = null;
    @observable loaded = false;
    _prefix = 'login';
    _resetTouchId = null;

    constructor() {
        super();
        reaction(() => this.passphrase, () => { this.passphraseValidationMessage = null; });
    }

    @action async enableAutomaticLogin(user) {
        user.autologinEnabled = true;
        const key = `${user.username}::${loginConfiguredKey}`;
        await TinyDb.system.setValue(key, user.autologinEnabled);
    }

    @action changeUserAction() {
        if (this.isInProgress) return;
        this.changeUser = true;
        this.clean();
        this.routes.app.loginStart();
    }

    @action checkSavedUserPin() {
        const user = new User();
        user.username = this.username;
        this.firstName = '';
        this.lastName = '';
        return user.hasPasscode().then(has => has && this.saved());
    }

    @action useMasterPassword() {
        this.current = 2;
        this.routes.app.loginStart();
    }

    @action clean() {
        this.current = 0;
        this.username = '';
        this.passphrase = '';
        this.isInProgress = false;
        this.resetValidationState();
    }

    @action saved = () => {
        this.routes.app.loginSaved();
        if (__DEV__ && process.env.PEERIO_QUICK_PIN) {
            this.login(process.env.PEERIO_QUICK_PIN);
        }
    };

    @action _login(user) {
        User.current = user;
        return user.login()
            .then(() => console.log('login-state.js: logged in'))
            .then(async () => {
                mainState.activate(user);
                if (user.autologinEnabled) return;
                // wait for user to answer
                await this.enableAutomaticLogin(user);
            })
            .catch(e => {
                this.isInProgress = false;
                console.error(e);
                User.current = null;
                this.passphraseValidationMessage = tx('error_wrongAK');
                return Promise.reject(new Error(this.error));
            });
    }

    transition() {
        const user = User.current;
        return new Promise(() => mainState.activateAndTransition(user))
            .then(() => this.clean())
            .then(async () => {
                if (this._resetTouchId) {
                    console.log('login-state.js: fixing touch id');
                    await keychain.delete(`user::${this.username}`);
                    await mainState.saveUserTouchID();
                    this._resetTouchId = false;
                }
            })
            .catch(e => {
                console.error(e);
                if (user.deleted) {
                    console.error('deleted');
                    this.passphraseValidationMessage = tx('title_accountDeleted');
                    warnings.addSevere('title_accountDeleted', 'error_accountSuspendedTitle');
                }
                if (user.blacklisted) {
                    console.error('suspended');
                    this.passphraseValidationMessage = tx('error_accountSuspendedTitle');
                    warnings.addSevere('error_accountSuspendedText', 'error_accountSuspendedTitle');
                }
                return Promise.reject(new Error(this.error));
            })
            .finally(() => {
                this.isInProgress = false;
            });
    }

    @action login = async (pin) => {
        if (this.username === config.appleTestUser
            && config.appleTestServer !== socket.url) {
            await overrideServer(config.appleTestServer);
            await TinyDb.system.setValue('apple-review-login', true);
            this.restart();
        }
        const user = new User();
        user.username = this.username;
        user.passphrase = (pin || this.passphrase).trim();
        this.isInProgress = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        }).then(() => mainState.saveUser());
    };

    @action loginCached = (data) => {
        const user = new User();
        user.deserializeAuthData(data);
        this.isInProgress = true;
        user.autologinEnabled = true;
        return new Promise(resolve => {
            when(() => socket.connected, () => resolve(this._login(user)));
        });
    };

    async restart() {
        await RNRestart.Restart();
    }

    async signOut(force) {
        const inProgress = !!fileStore.files.filter(f => f.downloading || f.uploading).length;
        await !force && inProgress ? rnAlertYesNo(tx('dialog_confirmLogOutDuringTransfer')) : Promise.resolve(true);
        let untrust = false;
        if (!force && User.current.autologinEnabled) {
            const popupResult = await popupSignOutAutologin();
            if (!popupResult) {
                routes.main.settings();
                settingsState.transition('security');
                return;
            }
            untrust = popupResult.checked;
        }
        await User.removeLastAuthenticated();
        const { username } = User.current;
        overrideServer(null);
        await TinyDb.system.removeValue(`apple-review-login`);
        await TinyDb.system.removeValue(`${username}::${loginConfiguredKey}`);
        await TinyDb.system.removeValue(`user::${username}::touchid`);
        await TinyDb.system.removeValue(`user::${username}::keychain`);
        await TinyDb.system.removeValue(`${username}::skipTouchID`);
        try {
            await keychain.delete(await mainState.getKeychainKey());
        } catch (e) {
            console.log(e);
        }
        await User.current.signout(untrust);
        await RNRestart.Restart();
    }

    async load() {
        console.log(`login-state.js: loading`);
        const appleReviewLogin = await TinyDb.system.getValue('apple-review-login');
        // TODO: remove this after migration
        if (appleReviewLogin) {
            this.username = config.appleTestUser;
            this.passphrase = config.appleTestPass;
            this.login();
            return;
        }

        setTimeout(() => { this.isInProgress = false; }, 0);
        const load = async () => {
            await new Promise(resolve => when(() => socket.connected, resolve));
            const userData = await User.getLastAuthenticated();
            if (!userData) return;
            const { username /* , firstName, lastName */ } = userData;
            if (this.username && this.username !== username) return;
            this.username = username;
            if (username) {
                this.loaded = await this.loadFromKeychain();
            }
        };
        // TODO: fix this android hack for LayoutAnimation easeInEaseOut on transitions
        setTimeout(() => { this.isInProgress = true; }, 0);
        try {
            await load();
        } catch (e) {
            console.error(e);
        }
        // TODO: fix this android hack for LayoutAnimation easeInEaseOut on transitions
        setTimeout(() => { this.isInProgress = false; }, 0);
    }

    @action async loadFromKeychain() {
        await keychain.load();
        if (!keychain.hasPlugin) return false;
        let data = await keychain.get(await mainState.getKeychainKey(this.username));
        if (!data) {
            return await popupKeychainError(null, tx('error_keychainRead'))
                && this.loadFromKeychain();
        }
        try {
            const touchIdKey = `user::${this.username}::touchid`;
            const secureWithTouchID = !!await TinyDb.system.getValue(touchIdKey);
            data = JSON.parse(data);
            await this.loginCached(data);
            User.current.secureWithTouchID = secureWithTouchID;
            // Temporary: if passphrase was stored unpadded,
            // resave user data, so that it's padded.
            if (!data.paddedPassphrase) {
                console.log('login-state.js: resaving data with padding');
                await mainState.saveUserKeychain(secureWithTouchID);
            }
            return true;
        } catch (e) {
            console.log('login-state.js: logging in with keychain failed');
            this._resetTouchId = true;
        }
        return false;
    }
}

const loginState = new LoginState();

addValidation(loginState, 'username', validators.usernameLogin, 0);

export default loginState;
