import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import ActionSheetLayout from '../layout/action-sheet-layout';
import FileActionSheetHeader from '../files/file-action-sheet-header';

@observer
export default class MockActionSheet extends Component {
    render() {
        const file = {
            name: 'Karim File',
            sizeFormatted: '22 MB',
            uploadedAt: new Date().getTime()
        };
        const actionButtons = [
            {
                title: 'button_share',
                action: () => console.log('share')
            },
            {
                title: 'button_delete',
                action: () => console.log('delete')
            },
            {
                title: 'button_move',
                action: () => console.log('move')
            },
            {
                title: 'jump',
                action: () => console.log('jump')
            }
        ];
        const header = <FileActionSheetHeader file={file} onPress={() => console.log('Go to file')} />;
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                <ActionSheetLayout
                    header={header}
                    hasCancelButton
                    actionButtons={actionButtons}
                    destructiveButtonIndex={1}
                />
            </View>
        );
    }
}
