import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, LayoutAnimation, Dimensions } from 'react-native';
import { reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import uiState from './ui-state';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';

const { width } = Dimensions.get('window');
const borderRadius = 16;

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

const buttonContainer = {
    backgroundColor: vars.actionSheetButtonColor,
    justifyContent: 'center',
    alignItems: 'center',
    height: vars.actionSheetOptionHeight,
    width: width - vars.spacing.small.midi2x * 2
};

const topButtonContainer = [buttonContainer, {
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
    marginBottom: 1
}];

const centerButtonContainer = [buttonContainer, {
    marginBottom: 1
}];

const bottomButtonContainer = [buttonContainer, {
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius
}];

const lonelyButtonContainer = [buttonContainer, {
    borderRadius
}];

const cancelButtonContainer = [buttonContainer, {
    backgroundColor: vars.white,
    marginTop: vars.spacing.small.midi2x,
    borderRadius
}];

const buttonTextStyle = {
    fontSize: vars.font.size.huge,
    color: vars.actionSheetFontColor,
    paddingHorizontal: vars.spacing.huge.mini2x
};

const boldButtonTextStyle = [buttonTextStyle, {
    fontWeight: 'bold'
}];

const redButtonTextStyle = [buttonTextStyle, {
    color: vars.desctructiveButtonFontColor
}];

@observer
export default class ActionSheetLayout extends SafeComponent {
    // componentDidMount() {
    //     reaction(() => uiState.activeActionSheet, () => LayoutAnimation.easeInEaseOut());
    // }

    fileInfo() {
        const { file, handleFileInfo, actionButtons } = this.props;
        let container = topButtonContainer;
        console.log(actionButtons);
        if (!actionButtons || actionButtons.length === 0) container = lonelyButtonContainer;
        return (
            <TouchableOpacity style={container} onPress={handleFileInfo}>
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

    actionButtons() {
        const { handleFileInfo, actionButtons, destructiveButtonIndex } = this.props;
        return (actionButtons.map((button, i) => {
            const topButton = (i === 0 && !handleFileInfo);
            const bottomButton = (i === actionButtons.length - 1);
            const destructiveButton = (i === destructiveButtonIndex);
            let container;
            if (topButton && bottomButton) container = lonelyButtonContainer;
            else if (!topButton && !bottomButton) container = centerButtonContainer;
            else if (topButton) container = topButtonContainer;
            else if (bottomButton) container = bottomButtonContainer;
            const text = destructiveButton ? redButtonTextStyle : buttonTextStyle;
            return (
                <TouchableOpacity style={container} onPress={button.action}>
                    <Text style={text}>
                        {tx(button.title)}
                    </Text>
                </TouchableOpacity>);
        }));
    }

    cancelOption() {
        const { handleCancel } = this.props;
        return (
            <TouchableOpacity style={cancelButtonContainer} onPress={handleCancel}>
                <Text style={boldButtonTextStyle}>
                    {tx('button_cancel')}
                </Text>
            </TouchableOpacity>
        );
    }

    renderThrow() {
        const { handleFileInfo, actionButtons, handleCancel } = this.props;
        // TODO Wire up to uiState
        // const actionSheet = uiState.activeActionSheet;
        // if (!actionSheet) return null;
        if (!actionButtons && !handleFileInfo && !handleCancel) return null;
        const wrapper = {
            position: 'absolute',
            left: 0,
            bottom: 0,
            right: 0,
            top: 0,
            flexGrow: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
            backgroundColor: '#00000020'
        };
        const container = {
            marginBottom: vars.spacing.small.midi2x
        };
        return (
            <View style={wrapper}>
                <View style={container}>
                    {handleFileInfo && this.fileInfo()}
                    {actionButtons && this.actionButtons()}
                    {handleCancel && this.cancelOption()}
                </View>
            </View>
        );
    }
}

ActionSheetLayout.propTypes = {
    file: PropTypes.any,
    handleFileInfo: PropTypes.func,
    actionButtons: PropTypes.any,
    handleCancel: PropTypes.func,
    destructiveButtonIndex: PropTypes.number
};
