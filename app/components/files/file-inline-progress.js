import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import fileState from '../files/file-state';
import icons from '../helpers/icons';
import FileInlineContainer from './file-inline-container';
import FileSignatureError from './file-signature-error';
import { tx } from '../utils/translator';

@observer
export default class FileInlineProgress extends SafeComponent {
    get fileDeletedHack() {
        return (
            <Text style={{ fontStyle: 'italic' }}>
                {tx('error_fileDeleted')}
            </Text>
        );
    }

    renderThrow() {
        const file = fileState.store.getById(this.props.file);
        if (!file) return this.fileDeletedHack;
        if (file.signatureError) return <FileSignatureError />;
        return (
            <FileInlineContainer
                file={file}
                onAction={this.props.onAction}>
                <View style={{ flex: 0 }}>
                    {!file.uploading && this.props.transparentOnFinishUpload && <ActivityIndicator />}
                    {file.uploading && icons.darkNoPadding('close', () => fileState.cancelUpload(file))}
                </View>
            </FileInlineContainer>
        );
    }
}

FileInlineProgress.propTypes = {
    file: PropTypes.any,
    transparentOnFinishUpload: PropTypes.bool,
    onAction: PropTypes.any
};
