import PropTypes from 'prop-types';
import React from 'react';
import { action, when } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import fileState from '../files/file-state';
import icons from '../helpers/icons';
import FileInlineContainer from './file-inline-container';
import FileSignatureError from './file-signature-error';

@observer
export default class FileInlineProgress extends SafeComponent {
    filePreviouslyDownloaded = this.fileExists;

    get file() {
        return fileState.store.getById(this.props.file);
    }

    get fileExists() {
        return !!this.file && !this.file.isPartialDownload && this.file.cached;
    }

    get downloadProgress() {
        if (!this.file) return 0;
        const { progress, progressMax } = this.file;
        return Math.min(Math.ceil(progress / progressMax * 100), 100);
    }

    @action.bound onOpen() {
        if (this.fileExists && !this.file.downloading) {
            this.file.launchViewer();
        } else {
            when(() => this.fileExists, () => this.file.launchViewer());
            fileState.download(this.file);
        }
    }

    @action.bound onCancel() {
        fileState.cancelDownload(this.file);
    }

    renderThrow() {
        const file = fileState.store.getById(this.props.file);
        const downloadStatusContainer = {
            alignItems: 'center',
            justifyContent: 'center',
            height: 48,
            marginTop: vars.spacing.small.midi2x,
            marginBottom: file.downloading ? vars.spacing.small.midi2x : 0,
            backgroundColor: vars.darkBlueBackground05,
            borderRadius: 4
        };
        const textStyle = {
            color: vars.peerioBlue,
            fontWeight: vars.font.weight.semiBold,
            fontStyle: 'italic'
        };
        const onPress = file.downloading ? this.onCancel : this.onOpen;
        if (!file) return <Text>{`no file ${this.props.file}`}</Text>;
        if (file.signatureError) return <FileSignatureError />;
        return (
            <FileInlineContainer
                file={file}
                onAction={this.props.onAction}>
                {!this.filePreviouslyDownloaded &&
                    <TouchableOpacity
                        style={downloadStatusContainer}
                        onPress={onPress}>
                        <Text style={textStyle}>
                            {file.downloading && !this.fileExists &&
                                <Text>{tx('button_cancelDownload')} ({this.downloadProgress}%)</Text>}
                            {!file.downloading && !this.fileExists &&
                                <Text>{tx('button_downloadToView')} ({file.sizeFormatted})</Text>}
                            {!file.downloading && this.fileExists &&
                                <Text>{tx('button_openFile')}</Text>}
                        </Text>
                    </TouchableOpacity>}
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
