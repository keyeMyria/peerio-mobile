import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import ActionSheetLayout from '../layout/action-sheet-layout';

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
        return (
            <View style={{ flex: 1, flexGrow: 1 }}>
                <ActionSheetLayout
                    file={file}
                    handleFileInfo={() => console.log('info')}
                    handleCancel={() => console.log('cancel')}
                    actionButtons={actionButtons}
                    destructiveButtonIndex={1}
                />
            </View>
        );
    }
}
