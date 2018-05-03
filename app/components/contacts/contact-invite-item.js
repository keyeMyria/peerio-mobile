import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import { contactStore } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import { tx } from '../utils/translator';

@observer
export default class ContactInviteItem extends SafeComponent {
    @observable invited = false;

    invite() {
        const { contact } = this.props;
        this.invited = true;
        contactStore.invite(contact.email);
    }

    renderThrow() {
        const { contact } = this.props;
        const { username, fullName } = contact;
        const invited = this.invited || contact.invited;
        const title = invited ? tx('title_invitedContacts') : tx('button_invite');
        return (
            <Avatar
                {...this.props}
                noTap
                sending={invited}
                height={56}
                contact={contact}
                title2={username}
                title={fullName}
                rightIcon={(invited !== null) && buttons.blueTextButton(title, () => this.invite(), invited)}
                hideOnline
                invited />
        );
    }
}

ContactInviteItem.fromEmail = email => {
    return observable({ fullName: email, username: '', invited: null, email });
};

ContactInviteItem.propTypes = {
    contact: PropTypes.any.isRequired
};
