import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { t, tx } from '../utils/translator';
import { uiState, fileState } from '../states';
import icons from '../helpers/icons';
import routes from '../routes/routes';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';
import snackbarState from '../snackbars/snackbar-state';

const actionCellStyle = {
    flex: 1,
    alignItems: 'center',
    height: vars.tabCellHeight,
    justifyContent: 'center'
};

const actionTextStyle = {
    color: 'rgba(0,0,0,.38)'
};

const bottomRowStyle = {
    flex: 0,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, .12)',
    height: vars.tabsHeight,
    paddingBottom: vars.iPhoneXBottom,
    padding: 0
};

@observer
export default class FileActions extends SafeComponent {
    action(text, icon, onPress, enabled) {
        return (
            <TouchableOpacity
                style={actionCellStyle}
                onPress={onPress && enabled ? onPress : null}
                pointerEvents={onPress ? null : 'none'}
                {...testLabel(`${icon}-tab`)}>
                <View pointerEvents="none" style={{ alignItems: 'center', opacity: enabled ? 1 : 0.5 }}>
                    {onPress ? icons.plaindark(icon) : icons.plain(icon, null, 'rgba(0, 0, 0, .38)')}
                    <Text style={actionTextStyle}>{text}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    onViewFile = () => {
        return Promise.resolve()
            .then(() => {
                this.props.file.launchViewer().catch(() => {
                    snackbarState.pushTemporary(tx('snackbar_couldntOpenFile'));
                });
            }).finally(() => { uiState.externalViewer = false; });
    };

    renderThrow() {
        const { file } = this.props;
        const enabled = file && file.readyForDownload || fileState.showSelection;
        const leftAction = file && !file.isPartialDownload && file.cached ?
            this.action(t('button_open'), 'open-in-new', this.onViewFile, enabled) :
            this.action(t('title_download'), 'file-download', () => fileState.download(), enabled);
        return (
            <Animated.View style={bottomRowStyle}>
                {leftAction}
                {this.action(t('button_share'), 'reply', () => routes.modal.shareFileTo(), file && file.canShare && enabled)}
                {this.action(t('Move'), 'repeat', () => routes.modal.moveFileTo(), file)}
                {this.action(t('button_delete'), 'delete', () => fileState.delete(), enabled)}
                {/* {this.action(t('button_more'), 'more-horiz')} */}
            </Animated.View>
        );
    }
}

FileActions.propTypes = {
    file: PropTypes.any
};
