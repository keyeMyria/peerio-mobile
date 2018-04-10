import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView, Text, TouchableOpacity, LayoutAnimation, Share } from 'react-native';
import { observable, reaction, when } from 'mobx';
import ProgressOverlay from '../shared/progress-overlay';
import SafeComponent from '../shared/safe-component';
import SimpleTextBox from '../shared/simple-text-box';
import { vars } from '../../styles/styles';
import { contactStore, warnings, User, config } from '../../lib/icebear';
import { tx, tu, t } from '../utils/translator';
import uiState from '../layout/ui-state';
import contactState from './contact-state';
import snackbarState from '../snackbars/snackbar-state';
import buttons from '../helpers/buttons';
import testLabel from '../helpers/test-label';

const textinputContainer = {
    backgroundColor: vars.white,
    marginBottom: vars.spacing.small.midi2x,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden'
};

const inviteContainer = {
    marginBottom: vars.spacing.small.midi2x,
    height: vars.inputHeight,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
    paddingLeft: vars.inputPaddingLeft
};

const buttonRow = {
    marginBottom: vars.spacing.small.midi2x,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    overflow: 'hidden'
};

const textinput = {
    fontSize: vars.font.size.normal,
    height: vars.inputHeight,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1
};

const textStatic = {
    fontSize: vars.font.size.normal,
    color: vars.txtDark,
    marginLeft: vars.inputPaddingLeft,
    flex: 1,
    flexGrow: 1,
    alignSelf: 'center'
};

const label = {
    color: vars.txtDate,
    marginVertical: vars.spacing.small.mini2x,
    marginLeft: vars.spacing.small.maxi
};

const labelDark = [label, { color: vars.txtDark }];

@observer
export default class ContactAdd extends SafeComponent {
    @observable waiting = false;
    @observable notFound = false;
    @observable toInvite = null;
    @observable showValidationError = false;
    @observable query = '';

    componentDidMount() {
        uiState.currentScrollView = this._scrollView;
        reaction(() => this.query, () => {
            this.toInvite = null;
            if (this.showValidationError) {
                LayoutAnimation.easeInEaseOut();
                this.showValidationError = false;
            }
        });
    }

    componentWillUnmount() {
        uiState.currentScrollView = null;
        uiState.currentScrollViewPosition = 0;
    }

    onScroll = ({ nativeEvent: { contentOffset: { y } } }) => {
        uiState.currentScrollViewPosition = y;
    };

    inviteContactDuck(toInvite) {
        if (!toInvite) return null;
        const email = toInvite;
        const fullName = toInvite;
        const username = '';
        const invited = false;
        return observable({ fullName, username, invited, email });
    }

    tryAdding() {
        this.query = this.query.toLocaleLowerCase().trim();
        if (!this.query) return;
        if (this.waiting) return;
        this.waiting = true;
        this.toInvite = null;
        this.notFound = false;
        const contact = contactStore.getContactAndSave(this.query);
        when(() => !contact.loading, () => {
            const { notFound, isLegacy, fullNameAndUsername: name } = contact;
            if (notFound) {
                this.notFound = true;
                const atInd = this.query.indexOf('@');
                const isEmail = atInd > -1 && atInd === this.query.lastIndexOf('@');
                if (isEmail) {
                    warnings.add(`User is not found on Peerio, please invite`);
                    LayoutAnimation.easeInEaseOut();
                    this.toInvite = this.inviteContactDuck(this.query);
                } else if (!isLegacy) {
                    this.showValidationError = true;
                    LayoutAnimation.easeInEaseOut();
                }
                isLegacy && snackbarState.pushTemporary(t('title_inviteLegacy'));
            } else {
                this.query = '';
                warnings.add(t('title_contactAdded', { name }));
            }
            this.waiting = false;
        });
    }

    share() {
        const urls = config.translator.urlMap;
        const message = tx('title_socialShareInviteContent', {
            socialShareUrl: urls.socialShareUrl,
            username: User.current.username
        });
        const title = tx('title_socialShareInvite');
        // const url = 'https://www.peerio.com';
        console.log(title, message);
        Share.share({ message, title });
    }

    get emailButton() {
        let text = 'button_addEmail';
        if (this.showAddEmail) {
            text = this.newEmailText ? 'button_save' : 'button_cancel';
        }
        return this.renderButton1(text, () => this.emailAction(), this.newEmailText && this.showAddEmail && !this.newEmailTextValid);
    }

    get validationError() {
        if (!this.showValidationError) return null;
        return (
            <Text numberOfLines={1} ellipsizeMode="tail" style={[label, { color: vars.txtAlert }]}>
                {tx('error_invalidEmailOrUsername')}
            </Text>
        );
    }

    renderButton1(text, onPress, disabled) {
        return (
            <TouchableOpacity
                {...testLabel(text)}
                onPress={disabled ? null : onPress}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ paddingRight: vars.spacing.small.maxi2x, paddingVertical: vars.spacing.small.maxi }}>
                <Text style={{ fontWeight: 'bold', color: disabled ? vars.txtMedium : vars.peerioBlue }}>
                    {tu(text)}
                </Text>
            </TouchableOpacity>
        );
    }

    renderText(text, style) {
        return (
            <View style={{ flexDirection: 'row', flex: 1, flexGrow: 1 }}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={[textStatic, style]}>
                    {text}
                </Text>
            </View>
        );
    }

    get inviteBlock() {
        const mockContact = this.toInvite || {};
        const { email, invited } = mockContact;
        return (
            <View style={{ overflow: 'hidden', height: email ? undefined : 0, opacity: invited ? 0.5 : 1 }}>
                <View style={inviteContainer}>
                    <Text>{email}</Text>
                    {buttons.uppercaseBlueButton(tx('button_invite'), () => {
                        mockContact.invited = true;
                        contactStore.invite(email);
                    }, invited)}
                </View>
            </View >
        );
    }

    renderThrow() {
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                <ScrollView
                    onScroll={this.onScroll}
                    keyboardShouldPersistTaps="handled"
                    style={{ backgroundColor: vars.darkBlueBackground05 }}
                    ref={ref => { this._scrollView = ref; }}>
                    <View style={{ marginTop: vars.spacing.medium.midi2x }}>
                        {contactState.empty && <View style={{ margin: vars.spacing.small.midi2x }}>
                            <Text style={labelDark}>{tx('title_contactZeroState')}</Text>
                        </View>}
                        <View style={{ margin: vars.spacing.small.midi2x }}>
                            <Text style={label}>{tx('button_addAContact')}</Text>
                            <View style={textinputContainer}>
                                <SimpleTextBox
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    onChangeText={text => { this.query = text; }}
                                    placeholder={tx('title_userSearch')}
                                    style={textinput}
                                    value={this.query}
                                    {...testLabel('contactSearchInput')}
                                />
                                {this.renderButton1('button_add', () => this.tryAdding())}
                            </View>
                            {this.inviteBlock}
                            {this.validationError}
                        </View>
                        <View style={{ margin: vars.spacing.small.midi2x }}>
                            <View style={buttonRow}>
                                <Text style={labelDark}>{tx('title_findContacts')}</Text>
                                {this.renderButton1('title_importContacts', () => contactState.testImport())}
                            </View>
                        </View>
                        <View style={{ margin: vars.spacing.small.midi2x }}>
                            <View style={buttonRow}>
                                <Text style={labelDark}>{tx('title_shareSocial')}</Text>
                                {this.renderButton1('button_share', () => this.share())}
                            </View>
                        </View>
                        <View style={{ height: 180 }} />
                    </View>
                </ScrollView>
                <ProgressOverlay enabled={this.waiting} />
            </View>
        );
    }
}
