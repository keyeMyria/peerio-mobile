import React from 'react';
import { when } from 'mobx';
import { observer } from 'mobx-react/native';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';
import routes from '../routes/routes';
import routerModal from '../routes/router-modal';

@observer
export default class FileViewActionSheet extends SafeComponent {
    get fileExists() {
        const file = fileState.currentFile;
        return !!file && !file.isPartialDownload && file.cached;
    }

    get openItem() {
        const file = fileState.currentFile;
        const title = this.fileExists ? tx('button_open') : tx('button_download');
        return {
            title,
            action: () => {
                when(() => this.fileExists, file.launchViewer());
                if (!file.cached) fileState.download(file);
            }
        };
    }

    shareFile = () => {
        routerModal.shareFileTo();
    };
    get shareItem() {
        return {
            title: tx('button_share'),
            action: () => this.shareFile()
        };
    }

    moveFile = () => {
        routes.modal.moveFileTo();
    };
    get moveItem() {
        return {
            title: tx('button_move'),
            action: () => this.moveFile()
        };
    }

    deleteFile = () => {
        fileState.delete();
    };
    get deleteItem() {
        return {
            title: tx('button_delete'),
            action: () => this.deleteFile()
        };
    }

    get items() {
        const array = [];
        array.push(this.openItem);
        if (this.fileExists) { array.push(this.moveItem); }
        array.push(this.shareItem);
        if (this.fileExists) { array.push(this.deleteItem); }
        array.push({ title: tx('button_cancel') });

        return array;
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = () => this._actionSheet.show();

    renderThrow() {
        return (
            <ActionSheet
                ref={sheet => { this._actionSheet = sheet; }}
                options={this.items.map(i => i.title)}
                cancelButtonIndex={this.items.length - 1}
                onPress={this.onPress}
            />
        );
    }
}
