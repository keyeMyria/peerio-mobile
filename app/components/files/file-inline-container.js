import PropTypes from 'prop-types';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { action, when } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import FileTypeIcon from './file-type-icon';
import FileProgress from './file-progress';
import { fileHelpers, config } from '../../lib/icebear';
import { fileState } from '../states';

const padding = 8;
const borderWidth = 1;

const container = {
    borderColor: vars.lightGrayBg,
    borderWidth,
    marginVertical: 4,
    borderRadius: 2
};

const titleText = {
    color: vars.peerioBlue,
    marginVertical: 2,
    ellipsizeMode: 'tail'
};

const descText = {
    color: vars.txtDark,
    marginBottom: 2
};

const text = {
    flexGrow: 1,
    flexShrink: 1,
    fontSize: vars.font.size.normal,
    fontWeight: vars.font.weight.semiBold,
    color: vars.txtMedium,
    paddingLeft: padding
};

export default class FileInlineContainer extends SafeComponent {
    // Behaves differently based on whether file is an image or not
    // If file/image is cached, open in viewer
    // If file/image is NOT cached, download and then when download is finished open in viewer
    @action.bound fileAction() {
        const { file, isImage } = this.props;
        if (file.downloading) return;
        if (isImage) {
            if (file.tmpCached) {
                try {
                    config.FileStream.launchViewer(file.tmpCachePath);
                } catch (e) {
                    console.log(e);
                }
            } else file.tryToCacheTemporarily(true);
        } else {
            const exists = file && !file.isPartialDownload && file.cached;
            if (exists) file.launchViewer();
            else if (!file.cached) {
                when(() => file.cached, () => file.launchViewer());
                fileState.download(file);
            }
        }
    }

    get fileTypeIcon() {
        const { file } = this.props;
        return (
            <TouchableOpacity
                onPress={this.fileAction}
                pressRetentionOffset={vars.pressRetentionOffset}>
                <FileTypeIcon type={fileHelpers.getFileIconType(file.ext)} size="smaller" />
            </TouchableOpacity>);
    }

    get fileName() {
        const { file, isImage } = this.props;
        const name = isImage ? file.name : `${file.name} (${file.sizeFormatted})`;
        return (!!name &&
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flexGrow: 1, flexShrink: 1 }}
                onPress={this.fileAction}
                pressRetentionOffset={vars.pressRetentionOffset}>
                <Text numberOfLines={1} ellipsizeMode="tail" style={text}>{name}</Text>
            </TouchableOpacity>);
    }

    render() {
        const { file, isImage, isOpen, extraActionIcon } = this.props;
        const { title, description, fileId, downloading } = file;
        const isLocal = !!fileId;
        const spacingDifference = padding - vars.progressBarHeight;
        let containerHeight = isLocal ? 30 : 0;
        if (isLocal && isOpen) containerHeight += padding;
        const outer = {
            padding,
            paddingBottom: (downloading && !isImage) ? spacingDifference : padding
        };
        const header = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: (isLocal && isOpen) ? (padding + borderWidth) : 0,
            height: containerHeight
        };
        return (
            <View style={container}>
                <View style={outer} {...this.props}>
                    <View>
                        {!!title && <Text style={titleText}>{title}</Text>}
                        {!!description && <Text style={descText}>{description}</Text>}
                    </View>
                    <View style={header}>
                        {isLocal && this.fileTypeIcon}
                        {this.fileName}
                        {isLocal && <View style={{ flexDirection: 'row' }}>
                            {extraActionIcon}
                            {icons.darkNoPadding(
                                'more-vert',
                                () => this.props.onAction(file),
                                { marginHorizontal: vars.spacing.small.midi2x },
                                null,
                                downloading ? true : null
                            )}
                        </View>}
                    </View>
                    {this.props.children}
                </View>
                {!isImage && <FileProgress file={file} />}
            </View>
        );
    }
}

FileInlineContainer.propTypes = {
    file: PropTypes.any,
    onLayout: PropTypes.any,
    extraActionIcon: PropTypes.any,
    onAction: PropTypes.any,
    isImage: PropTypes.bool,
    isOpen: PropTypes.bool
};
