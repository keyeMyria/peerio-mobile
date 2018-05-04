import { observable } from 'mobx';
import RoutedState from '../routes/routed-state';

class InvitationState extends RoutedState {
    @observable currentInvitation;

    get title() {
        return this.currentInvitation ? this.currentInvitation.channelName : '';
    }

    onTransition(active, inv) {
        if (active) {
            this.currentInvitation = inv;
        } else {
            this.currentInvitation = null;
        }
    }
}

export default new InvitationState();
