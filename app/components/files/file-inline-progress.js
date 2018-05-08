import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, ActivityIndicator, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { T, tx } from '../utils/translator';
import fileState from '../files/file-state';
import icons from '../helpers/icons';
import FileInlineContainer from './file-inline-container';
import FileSignatureError from './file-signature-error';
import snackbarState from '../snackbars/snackbar-state';

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
            this.file.launchViewer().catch(() => {
                snackbarState.pushTemporary(tx('snackbar_couldntOpenFile'));
            });
        } else {
            fileState.download(this.file);
        }
    }

    @action.bound onCancel() {
        fileState.cancelDownload(this.file);
    }

    renderThrow() {
        const file = fileState.store.getById(this.props.file);

        if (!file) return <Text>{`no file ${this.props.file}`}</Text>;
        if (file.signatureError) return <FileSignatureError />;
        return (
            <FileInlineContainer
                file={file}
                onAction={this.props.onAction}>
                {this.filePreviouslyDownloaded
                    ? null
                    : <TouchableOpacity
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: 48,
                            marginTop: vars.spacing.small.midi2x,
                            marginBottom: file.downloading ? vars.spacing.small.midi2x : 0,
                            backgroundColor: vars.darkBlueBackground05,
                            borderRadius: 4
                        }}
                        onPress={file.downloading
                            ? this.onCancel
                            : this.onOpen
                        }
                    >
                        <Text semibold style={{
                            color: vars.peerioBlue,
                            fontStyle: 'italic'
                        }}>
                            {file.downloading && !this.fileExists &&
                                <Text><T k="button_cancelDownload" /> ({this.downloadProgress}%)</Text>
                            }
                            {!file.downloading && !this.fileExists &&
                                <Text><T k="button_downloadToView" /> ({file.sizeFormatted})</Text>
                            }
                            {!file.downloading && this.fileExists &&
                                <Text><T k="button_openFile" /></Text>
                            }
                        </Text>
                    </TouchableOpacity>
                }
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
