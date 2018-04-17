import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import { observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import FileInnerItem from './file-inner-item';
import FolderInnerItem from './folder-inner-item';
import fileState from './file-state';
import { vars } from '../../styles/styles';

@observer
export default class FileItem extends SafeComponent {
    @observable store = {
        get checkBoxHidden() {
            return !fileState.showSelection;
        },

        set checkBoxHidden(value) {
            // noop
        }
    };

    select() {
        this.props.file.selected = true;
    }

    press(file) {
        if (fileState.showSelection) {
            file.selected = !file.selected;
        } else {
            fileState.routerMain.files(file);
        }
    }

    renderThrow() {
        const { file } = this.props;
        return (
            <View style={{ backgroundColor: vars.filesBg, paddingHorizontal: vars.spacing.medium.mini2x }}>
                {file.isFolder ?
                    <FolderInnerItem folder={file} onLongPress={this.props.onLongPress} onPress={() => this.props.onChangeFolder(file)} /> :
                    <FileInnerItem onPress={f => this.press(f)} file={file} rowID={this.props.rowID} />}
            </View>
        );
    }
}

FileItem.propTypes = {
    file: PropTypes.any.isRequired,
    onChangeFolder: PropTypes.any
};
