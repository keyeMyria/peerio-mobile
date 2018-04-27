import React from 'react';
import { View, Text, PanResponder,
    AppState, ActivityIndicator, NativeModules,
    Dimensions, PixelRatio, Platform, StatusBar } from 'react-native';
import { observer } from 'mobx-react/native';
import SafeComponent from './shared/safe-component';
import PopupLayout from './layout/popup-layout';
import ModalLayout from './layout/modal-layout';
import RouteNavigator from './routes/route-navigator';
import routerApp from './routes/router-app';
import uiState from './layout/ui-state';
import { clientApp, crypto, startSocket, config, User, TinyDb } from '../lib/icebear';
import { scryptNative, signDetachedNative, verifyDetachedNative } from '../lib/scrypt-native';
import push from '../lib/push';
import { enableIdfa } from '../lib/idfa';
import consoleOverride from '../lib/console-override';
import '../lib/sounds';
import './utils/bridge';
import socketResetIfDead from './utils/socket-reset';
import TestHelper from './helpers/test-helper';
import MockComponent from './mocks';
import ActionSheetLayout from './layout/action-sheet-layout';

const { height, width } = Dimensions.get('window');

@observer
export default class App extends SafeComponent {
    constructor(props) {
        super(props);
        uiState.load();

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => {
                uiState.hidePicker();
                return false;
            }
        });

        console.logVersion = () => {
            console.log(`App.js: app version ${config.appVersion}, SDK version: ${config.sdkVersion}, OS: ${Platform.OS}, OS version: ${Platform.Version}`);
            console.log(`App.js: screen specs: ${width}, ${height}, ${PixelRatio.get()}`);
        };

        this._handleAppStateChange = this._handleAppStateChange.bind(this);
        this._handleMemoryWarning = this._handleMemoryWarning.bind(this);

        consoleOverride.configureConsole().then(() => {
            startSocket();
            push.clearBadge();
            enableIdfa();
        });
    }

    async componentWillMount() {
        if (!MockComponent) {
            let route = routerApp.routes.loading;
            if (!await User.getLastAuthenticated()
                && !await TinyDb.system.getValue('apple-review-login')) {
                route = routerApp.routes.loginStart;
            }
            route.transition();
        }
    }
    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        AppState.addEventListener('memoryWarning', this._handleMemoryWarning);
        NativeModules.PrivacySnapshot && NativeModules.PrivacySnapshot.enabled(true);
        if (NativeModules.RNSodium && NativeModules.RNSodium.scrypt) {
            console.log(`App.js: using native scrypt`);
            crypto.setScrypt(scryptNative);
        }
        console.log(`App.js: settings worker sign/verify`);
        if (NativeModules.RNSodium) {
            const { signDetached, verifyDetached } = NativeModules.RNSodium;
            if (signDetached && verifyDetached) {
                crypto.sign.setImplementation(signDetachedNative, verifyDetachedNative);
            }
        }
    }

    _handleAppStateChange(appState) {
        console.log(`App.js: AppState change: ${appState}`);
        if (uiState.appState === 'background' && appState === 'active') {
            socketResetIfDead();
        }
        uiState.appState = appState;
        if (appState === 'active') {
            push.clearBadge();
            push.disableServerSide();
            clientApp.isFocused = true;
        }
        if (appState === 'background') {
            push.enableServerSide();
            clientApp.isFocused = false;
        }
    }

    _handleMemoryWarning() {
        console.log(`App.js: AppState memory warning`);
    }

    _placeHolder() {
        return (
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    renderThrow() {
        if (!uiState.locale) return this._placeHolder();
        if (MockComponent) return <MockComponent />;
        const tabletHack = { top: 0, height, left: 0, right: 0 };
        return (
            <View style={(height < 500) ? tabletHack : { flex: 1, flexGrow: 1 }}>
                <RouteNavigator key="navigator" routes={routerApp} />
                <ModalLayout key="modals" />
                <PopupLayout key="popups" />
                <ActionSheetLayout key="actionSheets" />
                {uiState.picker}
                <Text key="debug" style={{ height: 0 }} testID="debugText">{uiState.debugText}</Text>
                <StatusBar barStyle="light-content" hidden={false} key="statusBar" />
                {!process.env.NO_DEV_BAR && <TestHelper key="testHelper" />}
            </View>
        );
    }
}
