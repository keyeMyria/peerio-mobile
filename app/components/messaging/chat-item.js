import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import Avatar from '../shared/avatar';
import mainState from '../main/main-state';

@observer
export default class ChatItem extends Component {
    render() {
        const i = this.props.chat;
        if (!i.sender) return null;
        const key = i.id;
        const msg = i.text || '';
        const timestamp = i.timestamp;
        const text = msg.replace(/\n[ ]+/g, '\n');
        const onPress = () => mainState.contactView(i.sender);
        return (
            <Avatar
                contact={i.sender}
                files={i.files}
                hideOnline
                date={timestamp}
                message={text}
                key={key}
                onPress={onPress}
                noBorderBottom
            />
        );
    }
}

ChatItem.propTypes = {
    onPress: React.PropTypes.func,
    chat: React.PropTypes.any.isRequired
};
