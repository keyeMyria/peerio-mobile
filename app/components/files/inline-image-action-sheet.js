import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when } from 'mobx';
import ActionSheet from 'react-native-actionsheet';
import SafeComponent from '../shared/safe-component';
import routerModal from '../routes/router-modal';
import fileState from '../files/file-state';
import { tx } from '../utils/translator';
import { config } from '../../lib/icebear';

@observer
export default class InlineImageActionSheet extends SafeComponent {
    @observable image;

    get shareFile() {
        return {
            title: tx('button_share'),
            action: () => {
                fileState.currentFile = this.image;
                routerModal.shareFileTo();
            }
        };
    }

    get deleteFile() {
        return {
            title: tx('button_delete'),
            action: async () => { await fileState.deleteFile(this.image); }
        };
    }

    get openItem() {
        return {
            title: tx('button_open'),
            action: () => {
                when(() => this.image.tmpCached, () => config.FileStream.launchViewer(this.image.tmpCachePath));
                if (!this.image.tmpCached) this.image.tryToCacheTemporarily(true);
            }
        };
    }

    get cancel() { return { title: tx('button_cancel') }; }

    get items() {
        if (this.image) return [this.openItem, this.shareFile, this.deleteFile, this.cancel];
        // cant delete if not downloaded
        return [this.openItem, this.shareFile, this.cancel];
    }

    onPress = index => {
        const { action } = this.items[index];
        action && action();
    };

    show = (image) => {
        this.image = image;
        this._actionSheet.show();
    };

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
