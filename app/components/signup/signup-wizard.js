import React from 'react';
import { View } from 'react-native';
import Layout1 from '../layout/layout1';
import Layout2 from '../layout/layout2';
import { wizard } from '../../styles/styles';
import Wizard from '../wizard/wizard';
import SignupStep1 from './signup-step1';
import SignupAccountKey from './signup-account-key';
import SignupConfirmBackup from './signup-confirm-backup';
import SignupContactSyncStart from './signup-contact-sync-start';
import SignupContactAdd from './signup-contact-add';
import SignupContactInvite from './signup-contact-invite';
import signupState from './signup-state';
import Bottom from '../controls/bottom';
import SnackBar from '../snackbars/snackbar';

export default class SignupWizard extends Wizard {
    pages = ['signupStep1', 'signupAccountKey', 'signupConfirmBackup',
        'signupContactSyncStart', 'signupContactAdd', 'signupContactInvite'];

    get index() { return signupState.current; }
    set index(i) { signupState.current = i; }

    signupStep1 = () => <SignupStep1 />;
    signupAccountKey = () => <SignupAccountKey />;
    signupConfirmBackup = () => <SignupConfirmBackup />;
    signupContactSyncStart = () => <SignupContactSyncStart />;
    signupContactAdd = () => <SignupContactAdd />;
    signupContactInvite = () => <SignupContactInvite />;

    renderThrow() {
        const style = wizard;
        const component = this.currentPage.type.prototype;
        const body = (
            <View
                style={[style.containerFlex]}>
                {this.wizard()}
                <Bottom><SnackBar /></Bottom>
            </View>
        );
        return component.useLayout2 ?
            <Layout2 body={body} autoScroll /> :
            <Layout1 body={body} autoScroll />;
    }
}
