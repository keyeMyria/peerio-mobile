import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView, Animated, Text } from 'react-native';
import { observable, reaction, action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FilesPlaceholder from './files-placeholder';
import ProgressOverlay from '../shared/progress-overlay';
import FileItem from './file-item';
import FolderActionSheet from './folder-action-sheet';
import FileUploadActionSheet from './file-upload-action-sheet';
import fileState from './file-state';
import PlusBorderIcon from '../layout/plus-border-icon';
import { upgradeForFiles } from '../payments/payments';
import BackIcon from '../layout/back-icon';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import icons from '../helpers/icons';
import ButtonText from '../controls/button-text';
import uiState from '../layout/ui-state';
import SearchBar from '../controls/search-bar';

const iconClear = require('../../assets/file_icons/ic_close.png');

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

let fileUploadActionSheet = null;

function backFolderAction() {
    fileState.currentFolder = fileState.currentFolder.parent;
}

@observer
export default class Files extends SafeComponent {
    @observable findFilesText;

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    get leftIcon() {
        if (fileState.currentFolder.isRoot) return null;
        return <BackIcon action={backFolderAction} />;
    }

    get rightIcon() {
        return !fileState.isFileSelectionMode &&
            <PlusBorderIcon
                action={() => fileUploadActionSheet.show()}
                testID="buttonUploadFileToFiles" />;
    }

    get layoutTitle() {
        if (fileState.currentFolder.isRoot) return null;
        return fileState.currentFolder.name;
    }

    @observable dataSource = null;
    @observable refreshing = false;
    @observable maxLoadedIndex = INITIAL_LIST_SIZE;
    actionsHeight = new Animated.Value(0);

    get data() {
        return fileState.store.currentFilter ?
            fileState.store.visibleFilesAndFolders
            : fileState.currentFolder.foldersAndFilesDefaultSorting;
    }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            fileState.routerMain.route === 'files',
            fileState.routerMain.currentIndex === 0,
            this.currentFolder,
            this.data,
            this.data.length,
            this.maxLoadedIndex,
            fileState.store.currentFilter
        ], () => {
            // console.log(`files.js: update ${this.data.length} -> ${this.maxLoadedIndex}`);
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice(0, this.maxLoadedIndex));
            this.forceUpdate();
        }, true);
    }

    onChangeFolder = folder => { fileState.currentFolder = folder; };

    item = (file, sectionID, rowID) => {
        return (
            <FileItem
                key={file.fileId || file.folderId}
                file={file}
                onChangeFolder={this.onChangeFolder}
                onLongPress={() => this._folderActionSheet.show(file)}
                rowID={rowID} />
        );
    };

    onEndReached = () => {
        // console.log('files.js: on end reached');
        this.maxLoadedIndex += PAGE_SIZE;
    };

    listView() {
        return (
            <ListView
                initialListSize={INITIAL_LIST_SIZE}
                pageSize={PAGE_SIZE}
                dataSource={this.dataSource}
                renderRow={this.item}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={20}
                enableEmptySections
                ref={sv => {
                    this.scrollView = sv;
                    uiState.currentScrollView = sv;
                }}
            />
        );
    }

    get isZeroState() {
        return !fileState.store.files.length &&
            // no folders and no files
            !fileState.store.loading
            && fileState.currentFolder.isRoot;
    }

    get noFilesInFolder() {
        if (this.data.length || fileState.currentFolder.isRoot) return null;
        const s = {
            color: vars.txtMedium,
            textAlign: 'center',
            marginTop: vars.headerSpacing
        };
        return <Text style={s}>{tx('title_noFilesInFolder')}</Text>;
    }

    onChangeFindFilesText(text) {
        const items = text.split(/[ ,;]/);
        if (items.length > 1) {
            fileState.findFilesText = items[0].trim();
            this.onSubmit();
            return;
        }
        fileState.findFilesText = text;
        this.searchFileTimeout(text);
    }

    searchFileTimeout(filename) {
        if (this._searchTimeout) {
            clearTimeout(this._searchTimeout);
            this._searchTimeout = null;
        }
        if (!filename) {
            fileState.store.clearFilter();
            return;
        }
        this._searchTimeout = setTimeout(() => this.searchFile(filename), 500);
    }

    searchFile = val => {
        if (val === '' || val === null) {
            fileState.store.clearFilter();
            return;
        }
        fileState.store.filterByName(val);
    };

    @action.bound onChangeText(text) {
        this.clean = !text.length;
        this.onChangeFindFilesText(text);
    }

    searchTextbox() {
        const leftIcon = icons.plain('search', vars.iconSize, vars.black12);
        let rightIcon = null;
        if (fileState.findFilesText) {
            rightIcon = icons.iconImage(
                iconClear,
                () => {
                    fileState.findFilesText = '';
                    this.onChangeFindFilesText('');
                },
                vars.opacity54
            );
        }
        return (
            <SearchBar
                textValue={fileState.findFilesText}
                placeholderText={tx('title_searchAllFiles')}
                onChangeText={this.onChangeText}
                onSubmit={this.onSubmit}
                leftIcon={leftIcon}
                rightIcon={rightIcon}
            />);
    }

    toolbar() {
        const container = {
            height: vars.listItemHeight,
            backgroundColor: vars.darkBlueBackground05,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'center',
            shadowColor: '#000000',
            shadowOpacity: 0.25,
            shadowRadius: 8,
            shadowOffset: {
                height: 1,
                width: 1
            },
            elevation: 10,
            paddingRight: vars.spacing.small.midi2x
        };
        return (
            fileState.isFileSelectionMode && <View style={container}>
                <ButtonText
                    testID="fileShareButtonCancel"
                    onPress={this.handleExit}
                    secondary
                    text={tx('button_cancel')} />
                <ButtonText
                    testID="fileShareButtonShare"
                    onPress={this.submitSelection}
                    text={tx('button_share')}
                    disabled={!fileState.showSelection} />
            </View>
        );
    }

    handleExit() {
        fileState.exitFileSelect();
    }

    submitSelection() {
        fileState.submitSelectedFiles();
    }

    body() {
        if (this.data.length || !fileState.currentFolder.isRoot) return this.listView();
        if (!this.data.length && fileState.findFilesText && !fileState.store.loading) {
            return (
                <Text style={{ marginTop: vars.headerSpacing, textAlign: 'center' }}>
                    {tx('title_noFilesMatchSearch')}
                </Text>
            );
        }
        return this.isZeroState && <FilesPlaceholder />;
    }

    @action.bound fileUploadActionSheetRef(ref) { fileUploadActionSheet = ref; }

    renderThrow() {
        return (
            <View
                style={{ flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: vars.white }}>
                    {!this.isZeroState && this.searchTextbox()}
                    {upgradeForFiles()}
                    {!this.data.length && !fileState.currentFolder.isRoot ?
                        this.noFilesInFolder : null}
                    {this.body()}
                </View>
                <ProgressOverlay enabled={fileState.store.loading} />
                <FolderActionSheet ref={ref => { this._folderActionSheet = ref; }} />
                <FileUploadActionSheet createFolder ref={this.fileUploadActionSheetRef} />
                {this.toolbar()}
            </View>
        );
    }
}
