import { Linking, Platform } from 'react-native';
import { observable, action, when } from 'mobx';
import chatState from '../messaging/chat-state';
import RoutedState from '../routes/routed-state';
import { fileStore, TinyDb, socket, fileHelpers, clientApp, chatStore } from '../../lib/icebear';
import { tx } from '../utils/translator';
import { rnAlertYesNo } from '../../lib/alerts';
import { popupInputWithPreview, popupYesCancel, popupOkCancel } from '../shared/popups';
import { promiseWhen } from '../helpers/sugar';

class FileState extends RoutedState {
    @observable currentFile = null;
    @observable currentFolder = null;
    @observable previewFile = null;
    @observable isFileSelectionMode = null;
    @observable findFilesText;
    localFileMap = observable.map();
    forceShowMap = observable.map();
    store = fileStore;
    _prefix = 'files';
    selectedFile = null;

    @action async init() {
        this.currentFolder = fileStore.folders.root;
        return new Promise(resolve => when(() => !this.store.loading, resolve));
    }

    get showSelection() {
        return fileStore.hasSelectedFiles;
    }

    get selected() {
        return fileStore.getSelectedFiles();
    }

    @action delete() {
        const f = this.currentFile ? [this.currentFile] : this.selected;
        const count = f.length;
        const shared = !!f.filter(i => !!i.shared).length;
        let t = tx((count > 1) ? 'dialog_confirmDeleteFiles' : 'dialog_confirmDeleteFile', { count });
        if (shared) t += `\n${tx('title_confirmRemoveSharedFiles')}`;
        rnAlertYesNo(t)
            .then(() => {
                f.forEach(item => {
                    item.remove();
                });
                this.routerMain.files();
            })
            .catch((e) => console.error(e));
    }

    @action async deleteFile(file) {
        const title = tx('dialog_confirmDeleteFile');
        let subtitle = '';
        if (file.shared) subtitle += `\n${tx('title_confirmRemoveSharedFiles')}`;
        const result = await popupOkCancel(title, subtitle);
        if (result) {
            await file.remove();
        }
        return result; // Used to trigger events after deleting
    }

    async remindAboutEncryption() {
        if (Platform.OS !== 'android') return;
        let text = null;
        switch (global.fileEncryptionStatus) {
            case undefined: case 2: return;
            case 1: text = 'dialog_androidEncryptionStatusPartial'; break;
            default: text = 'dialog_androidEncryptionStatusOff';
        }
        if (await TinyDb.system.getValue('fileEncryptionStatusShown')) return;
        try {
            await rnAlertYesNo(null, tx(text));
            Linking.openURL('https://support.google.com/nexus/answer/2844831?hl=en');
        } catch (e) {
            console.log('file-state: user tap cancelled');
        }
        await TinyDb.system.setValue('fileEncryptionStatusShown', true);
    }

    async remindAboutExternal() {
        if (Platform.OS !== 'android') return true;
        if (await TinyDb.system.getValue('saved_toExternalShown')) return true;
        try {
            await rnAlertYesNo(null, tx('dialog_toExternal'));
            TinyDb.system.setValue('saved_toExternalShown', true);
        } catch (e) {
            return false;
        }
        return true;
    }

    @action async download(fp) {
        await this.remindAboutEncryption();
        if (!await this.remindAboutExternal()) {
            console.log('file-state.js: user denied saving to external');
            return;
        }
        const singleFile = fp || this.currentFile;
        const f = singleFile ? [singleFile] : this.selected;
        f.forEach(file => {
            file.selected = false;
            if (file.downloading || file.uploading) return;
            file.readyForDownload && file.download(file.cachePath);
        });
    }

    @action resetSelection() {
        this.selectedFile = null;
        this.selected.forEach(f => { f.selected = false; });
    }

    @action selectFiles() {
        this.resetSelection();
        this.isFileSelectionMode = true;
        return new Promise((resolve, reject) => {
            this.resolveFileSelection = resolve;
            this.rejectFileSelection = reject;
            this.routerMain.files();
        });
    }

    // TODO modify after router push logic is implemented
    @action exitFileSelect() {
        this.resetSelection();
        this.isFileSelectionMode = false;
        this.routerMain.chats(chatStore.activeChat);
        this.rejectFileSelection && this.rejectFileSelection(new Error(`file-state.js: user cancel`));
        this.rejectFileSelection = null;
    }

    @action submitSelectedFiles() {
        this.resolveFileSelection(this.selected.slice());
        this.resolveFileSelection = null;
        this.isFileSelectionMode = false;
        this.exitFileSelect();
    }

    preprocess = async ({ fileName, ext, url }) => {
        const fileProps = {
            fileName,
            ext,
            path: url,
            name: fileHelpers.getFileNameWithoutExtension(fileName)
        };
        const { shouldUpload, newName } = await popupInputWithPreview(tx('title_fileName'), fileProps);
        const newFileName = `${newName}.${ext}`;

        return { shouldUpload, newFileName };
    };

    uploadInline = async (data) => {
        await promiseWhen(() => socket.authenticated);
        const chat = chatState.currentChat;
        if (!chat) throw new Error('file-state.js, uploadInline: no chat selected');
        data.file = chat.uploadAndShareFile(data.url, data.fileName, false, null, data.message);
        await promiseWhen(() => data.file.fileId);
        // TODO: move this to icebear
        this.localFileMap.set(data.file.fileId, data.url);
        return data.file;
    };

    uploadInFiles = async (data) => {
        await promiseWhen(() => socket.authenticated);
        const folder = this.currentFolder;
        const { shouldUpload, newFileName } = await this.preprocess(data);
        let file;
        if (shouldUpload) {
            file = fileStore.upload(data.url, newFileName, folder.isRoot ? null : folder.folderId);
            if (folder && !folder.isRoot) {
                await promiseWhen(() => file.fileId);
                folder.moveInto(file);
            }
        }
        return file;
    };

    cancelUpload(file) {
        return popupYesCancel(tx('title_confirmCancelUpload')).then(r => r && file.cancelUpload());
    }

    onTransition(active, file) {
        console.log('files on transition');
        clientApp.isInFilesView = active && !!file;
        this.currentFile = active ? file : null;
    }

    goToRoot() {
        this.currentFolder = fileStore.folders.root;
    }

    get title() {
        return this.currentFile ? this.currentFile.name : tx('title_fileFilterAll');
    }
}

export default new FileState();
