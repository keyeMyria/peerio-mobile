import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, Dimensions, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import fileState from './file-state';
import FileSignatureError from './file-signature-error';
import FileTypeIcon from './file-type-icon';
import testLabel from '../helpers/test-label';
import FileProgress from './file-progress';
import { fileHelpers } from '../../lib/icebear';

const { width } = Dimensions.get('window');
const height = vars.filesListItemHeight;
const checkBoxWidth = height;

const fileInfoContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    borderWidth: 0,
    borderColor: 'green'
};

@observer
export default class FileInnerItem extends SafeComponent {
    onPress() {
        const { file } = this.props;
        this.props.onPress && !fileState.isFileSelectionMode ? this.props.onPress(this.props.file)
            : (file.selected = !file.selected);
    }

    checkbox() {
        if (!fileState.isFileSelectionMode) return null;
        const checked = this.props.file && this.props.file.selected;
        const v = vars;
        const iconColor = checked ? v.checkboxIconActive : v.checkboxIconInactive;
        const iconBgColor = 'transparent';
        const icon = checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: checked ? vars.peerioBlueBackground05 : vars.darkBlueBackground05,
            padding: vars.spacing.small.mini2x,
            flex: 0,
            width: checkBoxWidth,
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={outer} pointerEvents="none">
                {icons.colored(icon, null, iconColor, iconBgColor)}
            </View>
        );
    }

    renderThrow() {
        const { file } = this.props;
        if (file.signatureError) return <View style={{ marginHorizontal: vars.spacing.small.midi }}><FileSignatureError /></View>;
        const action = () => !file.uploading && this.onPress();
        const iconRight = file.uploading ? icons.dark('close', () => fileState.cancelUpload(file)) :
            icons.dark('keyboard-arrow-right', action);
        const checked = this.props.file && this.props.file.selected;
        const nameStyle = {
            color: vars.txtDark,
            fontSize: vars.font.size.normal,
            fontWeight: vars.font.weight.bold
        };
        const infoStyle = {
            color: vars.subtleText,
            fontSize: vars.font.size.smaller,
            fontWeight: vars.font.weight.regular
        };
        const itemContainerStyle = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)',
            backgroundColor: checked ? vars.peerioBlueBackground05 : vars.darkBlueBackground05,
            height,
            width,
            borderWidth: 0,
            borderColor: 'red',
            paddingLeft: fileState.isFileSelectionMode ? 0 : vars.spacing.medium.mini2x
        };
        let icon = null;
        if (file.downloading) icon = 'file-download';
        if (file.uploading) icon = 'file-upload';
        let opacity = 1;
        if (file.uploading /* || !file.readyForDownload */) {
            opacity = 0.5;
        }
        if (icon) icon = icons.darkNoPadding(icon);
        const loadingStyle = null;
        const arrow = this.props.hideArrow ? null : (
            <View style={{ flex: 0 }}>
                {iconRight}
            </View>
        );
        const testID = `file${this.props.rowID}`;
        return (
            <View style={{ backgroundColor: vars.chatItemPressedBackground }}>
                <TouchableOpacity
                    onPress={action}
                    {...testLabel(testID)}
                    style={{ backgroundColor: vars.darkBlueBackground05 }}>
                    <View style={[fileInfoContainerStyle, { opacity }]}>
                        {this.checkbox()}
                        <View style={[itemContainerStyle, { width }]}>
                            <View style={[loadingStyle, { flex: 0, paddingRight: vars.fileInnerItemPaddingRight }]}>
                                {icon ||
                                    <FileTypeIcon
                                        size="smaller"
                                        type={fileHelpers.getFileIconType(file.ext)}
                                    />}
                            </View>
                            <View style={{ flexGrow: 1, flexShrink: 1, marginLeft: vars.spacing.medium.mini2x }}>
                                <Text style={nameStyle} numberOfLines={1} ellipsizeMode="tail">{file.name}</Text>
                                <Text style={infoStyle}>
                                    {file.size && <Text>{file.sizeFormatted}</Text>}
                                    &nbsp;&nbsp;
                                    {moment(file.uploadedAt).format('DD/MM/YYYY')}
                                </Text>
                            </View>
                            {arrow}
                        </View>
                    </View>
                </TouchableOpacity>
                <FileProgress file={file} />
            </View>
        );
    }
}

FileInnerItem.propTypes = {
    onPress: PropTypes.func,
    file: PropTypes.any.isRequired,
    checkbox: PropTypes.string,
    hideArrow: PropTypes.bool
};
