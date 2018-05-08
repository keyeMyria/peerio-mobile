import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, action, when } from 'mobx';
import ActionSheet from 'react-native-actionsheet';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { fileState } from '../states';
import routes from '../routes/routes';
import { popupInput } from '../shared/popups';
import { fileHelpers } from '../../lib/icebear';

@observer
export default class FilesActionSheet extends SafeComponent {
    DELETE_INDEX = 3;
    CANCEL_INDEX = 4;

    get items() {
        const result = [this.sharefile, this.moveFile, this.renameFile, this.deleteFile, this.cancel];
        return result;
    }

    get cancel() { return { title: tx('button_cancel') }; }

    get sharefile() {
        return {
            title: tx('button_share'),
            action: () => {
                fileState.currentFile = this.file;
                routes.modal.shareFileTo();
            }
        };
    }

    get moveFile() {
        return {
            title: tx('Move'),
            action: () => {
                fileState.currentFile = this.file;
                routes.modal.moveFileTo();
            }
        };
    }

    get renameFile() {
        return {
            title: tx('button_rename'),
            action: async () => {
                const { file } = this;
                const newFileName = await popupInput(
                    tx('title_fileName'),
                    '',
                    fileHelpers.getFileNameWithoutExtension(file.name),
                    { autoCapitalize: 'sentences' }
                );
                if (newFileName) await file.rename(`${newFileName}.${file.ext}`);
            }
        };
    }

    get deleteFile() {
        const { refreshData } = this.props;
        return {
            title: tx('button_delete'),
            action: async () => {
                const result = await fileState.deleteFile(this.file);
                if (result) refreshData();
            }
        };
    }

    onPress = index => {
        if (this.items[index]) {
            const { action: pressAction } = this.items[index];
            pressAction && pressAction();
        }
    };

    @observable file = null;
    @observable _actionSheet = null;

    /**
     * @param {File} file
     */
    @action.bound show(file) {
        if (!file) {
            console.error(`files-action-sheet: file is undefined`);
            return;
        }
        if (this._showWhen) {
            this._showWhen();
            this._showWhen = null;
        }
        // We need to re-render and re-ref action sheet
        // so that the title is updated accordingly
        if (this.file !== file) {
            this._actionSheet = null;
            this.file = file;
        }
        this._showWhen = when(() => this._actionSheet, () => this._actionSheet.show());
    }

    onFileInfoPress = () => {
        const { file } = this;
        this._actionSheet.hide();
        routes.modal.discard();
        routes.modal.files(file);
    };

    refActionSheet = ref => { this._actionSheet = ref; };

    renderThrow() {
        const { file } = this;
        if (!file) return null;
        const title = `${file.name}\n${file.sizeFormatted} ${moment(file.uploadedAt).format('DD/MM/YYYY')}`;
        return (
            <ActionSheet
                key={file.fileId}
                ref={this.refActionSheet}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.CANCEL_INDEX}
                destructiveButtonIndex={this.DELETE_INDEX}
                onPress={this.onPress}
                title={title}
            />
        );
    }
}

FilesActionSheet.propTypes = {
    refreshData: PropTypes.func
};
