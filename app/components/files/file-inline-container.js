import PropTypes from 'prop-types';
import React from 'react';
import { View, Text } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import FileTypeIcon from './file-type-icon';
import FileProgress from './file-progress';
import { fileHelpers } from '../../lib/icebear';

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
        const name = isImage ? file.name : `${file.name} (${file.sizeFormatted})`;
        return (
            <View style={container}>
                <View style={outer} {...this.props}>
                    <View>
                        {!!title && <Text style={titleText}>{title}</Text>}
                        {!!description && <Text style={descText}>{description}</Text>}
                    </View>
                    <View style={[header, { marginBottom: downloading && !isImage ? spacingDifference : 0 }]}>
                        {isLocal && <FileTypeIcon type={fileHelpers.getFileIconType(file.ext)} size="smaller" />}
                        {!!name && <Text numberOfLines={1} ellipsizeMode="tail" style={text}>{name}</Text>}
                        {isLocal && <View style={{ flexDirection: 'row' }}>
                            {extraActionIcon}
                            {!downloading && icons.darkNoPadding(
                                'more-vert',
                                () => this.props.onAction(file),
                                { marginHorizontal: vars.spacing.small.midi2x }
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
