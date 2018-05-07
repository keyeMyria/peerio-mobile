import React from 'react';
import { Clipboard, LayoutAnimation } from 'react-native';
import { observable, action, reaction } from 'mobx';
import Text from '../controls/custom-text';
import RoutedState from '../routes/routed-state';
import { User } from '../../lib/icebear';
import { popupCopyCancel } from '../shared/popups';
import snackbarState from '../snackbars/snackbar-state';
import uiState from '../layout/ui-state';
import { tx } from '../utils/translator';
import keychain from '../../lib/keychain-bridge';
import { vars } from '../../styles/styles';

class SettingsState extends RoutedState {
    @observable subroute = null;
    @observable stack = [];
    _prefix = 'settings';
    _titles = {
        security: 'title_settingsSecurity',
        profile: 'title_settingsProfile',
        account: 'title_settingsAccount',
        preferences: 'title_settingsPreferences',
        upgrade: 'button_upgrade',
        twoFactorAuth: 'title_2FA',
        notifications: 'title_notifications',
        display: 'title_displayPreferences',
        logs: 'title_help'
    };

    get title() {
        const sr = this.subroute && this._titles[this.subroute];
        return sr ? tx(sr) : tx('title_settings');
    }

    onTransition(active) {
        if (!active) {
            if (this.reaction) {
                this.reaction();
                this.reaction = null;
                return;
            }
        }
        this.routerMain.isRightMenuVisible = false;
        this.routerMain.isLeftHamburgerVisible = false;
        if (this.reaction) return;
        this.reaction = reaction(() => this.routerMain.currentIndex, (i) => {
            if (this.routerMain.route === 'settings') {
                while (i < this.stack.length) {
                    this.stack.pop();
                    this.subroute = i ? this.stack[i - 1] : null;
                }
            }
        });
    }

    @action transition(subroute) {
        console.log(`settings-state.js: transition ${subroute}`);
        LayoutAnimation.easeInEaseOut();
        if (subroute) {
            this.subroute = subroute;
            this.stack.push(subroute);
        } else {
            this.stack.clear();
        }
        this.routerMain.settings(subroute, false, this.stack.length);
    }

    upgrade() {
        this.routerModal.accountUpgradeSwiper();
    }

    async showPassphrase() {
        const user = User.current;
        let { passphrase } = user;
        if (!passphrase && keychain.hasPlugin) {
            const data = await keychain.get(`user::${user.username}`);
            if (data) ({ passphrase } = JSON.parse(data));
        }
        if (passphrase) {
            const mp = (
                <Text bold style={{ fontSize: vars.font.size.normal }}>
                    {passphrase}
                </Text>
            );
            popupCopyCancel(
                tx('title_AccountKey'),
                tx('title_AKDetail'),
                mp
            ).then(r => {
                if (!r) return;
                Clipboard.setString(passphrase);
                snackbarState.pushTemporary(tx('title_copied'));
                uiState.debugText = passphrase;
            });
        }
    }
}

export default new SettingsState();
