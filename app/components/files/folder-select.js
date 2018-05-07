import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ListView } from 'react-native';
import { observable, reaction, computed } from 'mobx';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import FolderInnerItem from './folder-inner-item';
import fileState from './file-state';
import { vars } from '../../styles/styles';
import Center from '../controls/center';
import icons from '../helpers/icons';
import routes from '../routes/routes';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 10;
const PAGE_SIZE = 2;

@observer
export default class FolderSelect extends SafeComponent {
    @observable currentFolder = fileState.store.folders.root;

    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    @observable dataSource = null;
    @observable refreshing = false;

    @computed get data() {
        const { currentFolder } = this;
        const folders = currentFolder.foldersSortedByName.slice();
        currentFolder.isRoot && folders.unshift(fileState.store.folders.root);
        return folders;
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
            this.data.length
        ], () => {
            this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
            this.forceUpdate();
        }, true);
    }

    item = folder => {
        const selectFolder = () => {
            const file = fileState.currentFile;
            if (!file) return;
            folder.moveInto(file);
            routes.modal.discard();
        };
        const changeFolder = () => {
            this.currentFolder = folder;
        };
        return (
            <FolderInnerItem
                radio
                key={folder.folderId}
                folder={folder}
                hideArrow={!folder.hasNested || folder.isRoot}
                onSelect={selectFolder}
                onPress={folder.hasNested ? changeFolder : selectFolder} />
        );
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
            />
        );
    }

    get noFilesInFolder() {
        if (this.data.length || this.currentFolder.isRoot) return null;
        const s = {
            color: vars.txtMedium,
            textAlign: 'center',
            marginTop: vars.headerSpacing
        };
        return <Text style={s}>{tx('title_noFilesInFolder')}</Text>;
    }

    exitRow() {
        const container = {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: vars.statusBarHeight,
            paddingBottom: 0,
            height: vars.headerHeight,
            borderBottomWidth: 1,
            borderBottomColor: '#EFEFEF'
        };
        const style = {
            flexGrow: 1
        };
        const textStyle = {
            fontSize: vars.font.size.normal,
            color: vars.txtMedium
        };
        const leftIcon = this.currentFolder.isRoot ?
            icons.dark('close', () => routes.modal.discard()) :
            icons.dark('arrow-back', () => { this.currentFolder = this.currentFolder.parent; });
        return (
            <View style={container}>
                {leftIcon}
                <Center style={style}><Text semibold style={textStyle}>Move file to...</Text></Center>
                {icons.placeholder()}
            </View>
        );
    }

    renderThrow() {
        return (
            <View style={{ flex: 1, flexGrow: 1, backgroundColor: vars.white }}>
                {this.exitRow()}
                {!this.data.length && !this.currentFolder.isRoot ?
                    this.noFilesInFolder : null}
                {this.listView()}
            </View>
        );
    }
}
