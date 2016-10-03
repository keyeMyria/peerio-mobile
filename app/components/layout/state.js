import { Keyboard } from 'react-native';
import _ from 'lodash';
import { observable, action, reaction, autorun } from 'mobx';
import translator from 'peerio-translator';
import locales from '../../../locales/locales';

const state = observable({
    isFirstLogin: false,
    route: '',
    prevRoute: '',
    routes: {},
    routesList: [],
    persistentFooter: [],
    pages: [],
    focusedTextBox: null,
    picker: null,
    pickerVisible: false,
    isLeftMenuVisible: false,
    isRightMenuVisible: false,
    keyboardVisible: false,
    keyboardHeight: 0,
    locale: null,
    languageSelected: null,
    languages: {
        en: 'English',
        fr: 'French',
        es: 'Spanish',
        ru: 'Russian'
    },
    modals: [],

    showPicker: action(picker => {
        state.hideKeyboard();
        state.picker = picker;
        setTimeout(() => { state.pickerVisible = true; }, 0);
    }),

    hidePicker: action((/* picker */) => {
        state.hideKeyboard();
        setTimeout(() => { state.pickerVisible = false; }, 0);
    }),

    hideKeyboard: action(() => {
        if (state.focusedTextBox) {
            state.focusedTextBox.blur();
            state.focusedTextBox = null;
        }
    }),

    setLocale: action(lc => {
        translator.loadLocale(lc, locales);
        state.locale = lc;
        state.languageSelected = lc;
    })
});

reaction(() => state.languageSelected, ls => state.setLocale(ls));

autorun(() => {
    const r = state.routes[state.route];
    const pages = [];
    if (r && r.states) {
        _.forOwn(r.states, (val, key) => {
            pages.push(key);
        });
    }
    state.pages = pages;
    if (state.focusedTextBox) {
        state.pickerVisible = false;
    }
});

Keyboard.addListener('keyboardWillShow', (e) => {
    state.keyboardHeight = e.endCoordinates.height;
});

Keyboard.addListener('keyboardWillHide', () => {
    state.keyboardHeight = 0;
});

export default state;
