import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import Avatar from '../shared/avatar';
import contactState from '../contacts/contact-state';
import fileState from '../files/file-state';
import { systemMessages } from '../../lib/icebear';
import IdentityVerificationNotice from './identity-verification-notice';
import { vars } from '../../styles/styles';

class TestStore {
    constructor() {
        this.fileStoreGet = fileState.store.getById.bind(fileState.store);
        fileState.store.getById = this.get;
    }

    map = observable.map();
    get = (id) => {
        const result = this.map.get(id);
        !result && setTimeout(() => {
            console.log('setting to true');
            this.map.set(id, this.fileStoreGet(id));
        }, 3000);
        return this.map.get(id);
    };
}

const testStore = new TestStore();

@observer
export default class ChatItem extends SafeComponent {
    setRef = ref => { this._ref = ref; };

    renderThrow() {
        if (!this.props || !this.props.message) return null;
        const i = this.props.message;
        if (!i.sender) return null;
        const key = i.id;
        const msg = i.text || '';
        const text = msg.replace(/\n[ ]+/g, '\n');
        const onPressAvatar = () => contactState.contactView(i.sender);
        const onPress = i.sendError ? this.props.onRetryCancel : null;

        // this causes double update on add message
        const error = !!i.signatureError;
        const systemMessageText =
            i.systemData && systemMessages.getSystemMessageText(i) || null;
        const videoCallLink = i.systemData && i.systemData.link || null;
        const files = i.files && i.files.map(id => fileState.store.getById(id)).filter(f => f) || [];
        const images = files.filter(f => f.isImage) || [];
        const normalFiles = files.filter(f => !f.isImage) || [];
        let firstImage = images.length ? images[0] : null;
        if (i.hasUrls && i.externalImages.length) {
            firstImage = i.externalImages[0];
        }
        const hasDeletedFile = i.files && !i.files.find(id => fileState.store.getById(id));
        const shouldDisplayIdentityNotice = i.systemData && i.systemData.action === 'join';

        return (
            <View>
                <Avatar
                    noTap={!i.sendError}
                    sendError={i.sendError}
                    sending={i.sending}
                    contact={i.sender}
                    isDeleted={i.sender ? i.sender.isDeleted : false}
                    files={normalFiles.map(f => f.fileId)}
                    inlineImage={firstImage}
                    receipts={i.receipts}
                    hideOnline
                    firstOfTheDay={i.firstOfTheDay}
                    timestamp={i.timestamp}
                    timestampText={i.messageTimestampText}
                    message={text}
                    hasDeletedFile={hasDeletedFile}
                    isChat
                    fullnameIsBold
                    systemMessage={systemMessageText}
                    videoCallMessage={videoCallLink}
                    key={key}
                    error={error}
                    onPress={onPress}
                    onPressAvatar={onPressAvatar}
                    onLayout={this.props.onLayout}
                    onRetryCancel={this.props.onRetryCancel}
                    onInlineImageAction={this.props.onInlineImageAction}
                    onInlineFileAction={this.props.onInlineFileAction}
                    noBorderBottom
                    collapsed={!!i.groupWithPrevious}
                    extraPaddingTop={8}
                    ref={this.setRef}
                />
                {
                    shouldDisplayIdentityNotice &&
                    <View style={{ padding: vars.spacing.medium.mini2x, paddingVertical: vars.spacing.small.midi }}>
                        <IdentityVerificationNotice />
                    </View>
                }
            </View>
        );
    }
}

ChatItem.propTypes = {
    onLayout: PropTypes.func,
    onPress: PropTypes.func,
    onRetryCancel: PropTypes.func,
    message: PropTypes.any.isRequired
};
