import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { contactStore } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import { t, tx } from '../utils/translator';

@observer
export default class ContactInviteItemPrompt extends SafeComponent {
    @observable invited = false;

    @action.bound invite() {
        const { email } = this.props;
        this.invited = true;
        contactStore.invite(email);
    }

    renderThrow() {
        const { email } = this.props;
        const invited = this.invited || contactStore.invitedContacts.find(i => i.email === email);
        const title = invited ? tx('title_invitedContacts') : tx('button_invite');
        return (
            <View style={{ alignItems: 'center', flexGrow: 1 }}>
                <View style={{ flexDirection: 'row', marginHorizontal: vars.spacing.large.midi2x, flexGrow: 1 }}>
                    <Icon name="help-outline" size={24} color={vars.txtDate} style={{ marginRight: vars.spacing.small.midi2x }} />
                    <Text style={{ color: vars.txtDate }}>{t('title_inviteContactByEmail2', { email })}</Text>
                </View>
                <View style={{ alignSelf: 'flex-end', marginTop: vars.spacing.small.maxi2x }}>
                    {buttons.roundBlueBgButton(title, this.invite, invited)}
                </View>
            </View>
        );
    }
}
