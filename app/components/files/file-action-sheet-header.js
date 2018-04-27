import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';

const { width } = Dimensions.get('window');

const infoIconStyle = {
    position: 'absolute',
    right: 16,
    top: 16,
    bottom: 8
};

const infoTextStyle = {
    fontSize: vars.font.size.smaller,
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: vars.spacing.huge.mini2x,
    lineHeight: 16
};

const container = {
    backgroundColor: vars.actionSheetButtonColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: vars.actionSheetOptionHeight,
    width: width - vars.spacing.small.midi2x * 2,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    marginBottom: 1
};

@observer
export default class FileActionSheetHeader extends SafeComponent {
    renderThrow() {
        const { file, onPress } = this.props;
        if (!file) return null;
        return (
            <TouchableOpacity style={container} onPress={onPress} disabled={!onPress}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={infoTextStyle} numberOfLines={1} ellipsizeMode="middle">
                        {file.name}
                    </Text>
                    <Text style={infoTextStyle} numberOfLines={1} ellipsizeMode="middle">
                        {file.sizeFormatted} {moment(file.uploadedAt).format('DD/MM/YYYY')}
                    </Text>
                </View>
                {icons.plaindark('info', vars.iconSize, infoIconStyle)}
            </TouchableOpacity>
        );
    }
}

FileActionSheetHeader.propTypes = {
    file: PropTypes.any,
    onPress: PropTypes.func
};
