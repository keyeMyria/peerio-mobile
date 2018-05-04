import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text } from 'react-native';
import { action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import FileProgress from './file-progress';
import { fileState } from '../states';
import FileTypeIcon from './file-type-icon';
import { fileHelpers } from '../../lib/icebear';
import FileViewActionSheet from './file-view-action-sheet';
import ButtonText from '../controls/button-text';
import MenuIcon from '../layout/menu-icon';
import { tx } from '../utils/translator';

const textStyle = {
    textAlign: 'center',
    fontSize: vars.font.size.bigger,
    color: vars.extraSubtleText,
    marginBottom: vars.spacing.medium.mini2x
};

const fileProgressContainer = {
    justifyContent: 'center',
    height: vars.progressBarHeight,
    paddingHorizontal: vars.spacing.huge.midi2x,
    marginTop: vars.spacing.medium.midi2x,
    marginBottom: vars.spacing.small.midi2x
};

const centered = {
    alignItems: 'center'
};

let actionSheet = null;

@observer
export default class FileView extends SafeComponent {
    get rightIcon() {
        return (
            <MenuIcon action={() => actionSheet.show()} />
        );
    }

    get file() {
        return fileState.currentFile || {};
    }

    get enabled() {
        return this.file && this.file.readyForDownload || fileState.showSelection;
    }

    get fileExists() {
        return !!this.file && !this.file.isPartialDownload && this.file.cached;
    }

    @action.bound onCancel() {
        fileState.cancelDownload(this.file);
    }

    @action.bound onOpen() {
        const { file } = this;
        file.launchViewer();
    }

    @action.bound onDownload() {
        fileState.download(this.file);
    }

    renderThrow() {
        const { file, enabled, fileExists } = this;

        let button;
        if (file.downloading) {
            button = <ButtonText text={tx('button_cancel')} onPress={this.onCancel} disabled={!enabled} />;
        } else if (fileExists) {
            button = <ButtonText text={tx('button_open')} onPress={this.onOpen} disabled={!enabled} />;
        } else {
            button = <ButtonText text={tx('button_download')} onPress={this.onDownload} disabled={!enabled} />;
        }

        return (
            <View style={{ flexGrow: 1, justifyContent: 'center', backgroundColor: vars.darkBlueBackground05 }}>
                <View style={centered}>
                    {<FileTypeIcon size="medium" type={fileHelpers.getFileIconType(file.ext)} /> }
                </View>

                <View style={fileProgressContainer}>
                    {file.downloading && <FileProgress file={file} />}
                </View>

                <View style={centered}>
                    <Text style={textStyle}>
                        {tx(file.downloading
                            ? 'title_downloadingFile'
                            : 'title_noPreview'
                        )}
                    </Text>
                    {button}
                </View>

                <FileViewActionSheet ref={ref => { actionSheet = ref; }} />
            </View>
        );
    }
}
