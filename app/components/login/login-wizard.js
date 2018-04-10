import React from 'react';
import { View, Dimensions, StatusBar, TextInput, LayoutAnimation } from 'react-native';
import { when, observable } from 'mobx';
import { observer } from 'mobx-react/native';
import { config, overrideServer, socket } from '../../lib/icebear';
import Wizard from '../wizard/wizard';
import loginState from './login-state';
import { wizard, vars } from '../../styles/styles';
import Layout1 from '../layout/layout1';
import Button from '../controls/button';
import LoginStart from './login-start';
import LoginClean from './login-clean';
import Logs from '../logs/logs';
import uiState from '../layout/ui-state';
import consoleOverride from '../../lib/console-override';

const { height } = Dimensions.get('window');

@observer
export default class LoginWizard extends Wizard {
    pages = ['loginStart', 'loginClean'];

    get index() { return loginState.current; }
    set index(i) { loginState.current = i; }

    loginStart() {
        return <LoginStart login={() => this.changeIndex(1)} />;
    }

    loginClean() {
        const submit = () => uiState.hideAll().then(() => loginState.login()).catch(e => console.log(e));
        return <LoginClean submit={submit} />;
    }

    componentDidMount() {
        // const load = __DEV__ && process.env.PEERIO_SKIPLOGINLOAD ? Promise.resolve(true) : loginState.load();
        // load.then(() => {
        if (__DEV__) {
            when(() => loginState.isConnected, () => {
                loginState.username = process.env.PEERIO_USERNAME || loginState.username;
                loginState.passphrase = process.env.PEERIO_PASSPHRASE || loginState.passphrase;
                process.env.PEERIO_AUTOLOGIN && loginState.login();
            });
        }
        // });
        when(() => socket.connected, () => { this.switchServerValue = config.socketServerUrl; });
    }

    @observable showDebugLogs = false;
    @observable delayDebugMenu = true;
    @observable debugMenuHeight = 0;
    @observable switchServerValue = '';

    async debugServer(serverName) {
        await overrideServer(serverName);
        loginState.restart();
    }

    get debugMenu() {
        if (this.delayDebugMenu) {
            LayoutAnimation.easeInEaseOut();
            this.debugMenuHeight = undefined;
            setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                this.delayDebugMenu = false;
            }, 1000);
        }
        const debugContainer = {
            backgroundColor: vars.darkBlue,
            height: this.debugMenuHeight,
            opacity: this.delayDebugMenu ? 0.5 : 1,
            marginTop: vars.spacing.small.maxi2x
        };
        const s = [wizard.footer.button.base, {
            padding: vars.spacing.small.mini2x,
            justifyContent: 'center',
            backgroundColor: '#FFFFFF10',
            borderColor: '#FFFFFF50',
            borderWidth: 1,
            borderRadius: 6
        }];
        const input = {
            marginHorizontal: vars.spacing.medium.maxi2x,
            height: 40,
            backgroundColor: '#FFFFFF90',
            marginTop: vars.spacing.small.maxi2x
        };
        return (
            <View style={debugContainer} pointerEvents={this.delayDebugMenu ? 'none' : 'auto'}>
                <View style={{ flexDirection: 'row', flexGrow: 1, justifyContent: 'space-between', paddingHorizontal: vars.loginWizard_debugMenu_paddingH }}>
                    <Button style={s} onPress={() => { this.showDebugLogs = !this.showDebugLogs; }} text="Show logs" />
                    <Button style={s}
                        onPress={() => { consoleOverride.verbose = !consoleOverride.verbose; }}
                        text={consoleOverride.verbose ? 'Verbose On' : 'Verbose Off'} />
                    <Button style={s} onPress={() => this.debugServer(this.switchServerValue)} text="Override server" />
                    <Button style={s} onPress={() => this.debugServer(null)} text="Reset" />
                </View>
                <View style={{ flex: 0 }}>
                    <TextInput
                        autoCorrect={false}
                        autoCapitalize="none"
                        value={this.switchServerValue}
                        onChangeText={text => { this.switchServerValue = text; }}
                        style={input} />
                </View>
            </View>
        );
    }

    get debugLogs() {
        return (
            <View style={{ backgroundColor: 'white', flex: 0, height: height * 0.6 }}><Logs /></View>
        );
    }

    render() {
        const style = wizard;
        const body = (
            <View
                style={[style.containerFlex]}>
                {uiState.showDebugMenu ? this.debugMenu : null}
                {this.showDebugLogs ? this.debugLogs : this.wizard()}
                <StatusBar barStyle="light-content" />
            </View>
        );
        return <Layout1 autoScroll body={body} />;
    }
}
