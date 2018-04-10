import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import FileTypeIcon from '../files/file-type-icon';
import Thumbnail from '../shared/thumbnail';
import { fileHelpers } from '../../lib/icebear';

@observer
export default class Progress extends SafeComponent {
    @observable width = 0;
    @observable visible = false;

    get currentWidth() {
        const { value, max } = this.props;
        const { width } = this;
        if (!width || !max) return 0;
        return width * value / max;
    }

    @action.bound layout(evt) {
        this.width = evt.nativeEvent.layout.width;
    }

    componentWillUpdate() {
        // android may break on LayoutAnimation
        if (Platform.OS === 'android') return;
        LayoutAnimation.easeInEaseOut();
    }

    componentDidMount() {
        setTimeout(() => { this.visible = true; }, 0);
    }

    @action.bound cancel() {
        this.visible = false;
        this.props.onCancel && this.props.onCancel();
    }

    get previewImage() {
        const size = vars.fileType.small;
        const s = {
            width: size,
            height: size
        };
        return <Thumbnail path={this.props.path} style={s} />;
    }

    renderThrow() {
        if (this.hidden) return null;
        const { max, file } = this.props;
        if (!max) return null;
        const height = 42;
        // height minus borders
        const innerHeight = height - 3;

        const pbContainer = {
            backgroundColor: vars.white,
            opacity: this.hidden ? 0 : 1,
            borderColor: vars.lightGrayBg,
            borderBottomWidth: 1,
            borderTopWidth: 2
        };
        const pbProgress = {
            // these margins pull out the progress
            // bar background a bit to cover over
            // borders of the outer container
            marginTop: -1,
            marginBottom: -1,
            height: innerHeight,
            backgroundColor: vars.peerioBlueBackground15,
            borderWidth: 0,
            borderColor: 'red',
            width: this.currentWidth
        };
        const text = {
            backgroundColor: 'transparent',
            color: vars.subtleText,
            flexShrink: 1,
            flexGrow: 1,
            paddingLeft: 2
        };
        const row = {
            // minus overlapping border
            height: innerHeight - 2,
            left: 0,
            right: 0,
            flexDirection: 'row',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingLeft: 16
        };
        const animation = {
            height: this.visible ? height - 2 : 0
        };
        let fileImagePlaceholder = null;
        const fileIconType = fileHelpers.getFileIconType(file.ext);
        if (fileIconType) {
            fileImagePlaceholder = (
                <FileTypeIcon
                    size="small"
                    type={fileIconType}
                />
            );
        }
        if (fileHelpers.isImage(file.ext) && this.props.path) {
            fileImagePlaceholder = this.previewImage;
        }

        return (
            <View style={animation}>
                <View style={pbContainer} onLayout={this.layout}>
                    <View style={pbProgress} />
                    <View style={row}>
                        {fileImagePlaceholder}
                        <Text style={text} numberOfLines={1} ellipsizeMode="tail">
                            {this.props.title}
                        </Text>
                        <TouchableOpacity
                            onPress={this.cancel}
                            pressRetentionOffset={vars.retentionOffset}>
                            {icons.plaindark('cancel', this.plus, {
                                paddingHorizontal: 16,
                                backgroundColor: 'transparent'
                            })}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

Progress.propTypes = {
    value: PropTypes.any,
    max: PropTypes.any,
    hidden: PropTypes.any
};

