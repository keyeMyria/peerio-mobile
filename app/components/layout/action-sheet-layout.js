import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { action, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

const { width } = Dimensions.get('window');
const borderRadius = 16;

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
    @observable visible = false;

    actionButtons() {
        const { header, actionButtons, destructiveButtonIndex } = this.props;
        return (actionButtons.map((button, i) => {
            const topButton = (i === 0 && !header);
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

    @action.bound show() {
        this.visible = true;
        console.log('show');
    }

    @action.bound handleCancel() {
        this.visible = false;
        console.log('cancel');
    }

    cancelOption() {
        return (
            <TouchableOpacity style={cancelButtonContainer} onPress={this.handleCancel}>
                <Text style={boldButtonTextStyle}>
                    {tx('button_cancel')}
                </Text>
            </TouchableOpacity>
        );
    }

    renderThrow() {
        const { actionButtons, hasCancelButton, header } = this.props;
        if (!header && !actionButtons && !hasCancelButton) return null;
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
                    {header}
                    {actionButtons && this.actionButtons()}
                    {hasCancelButton && this.cancelOption()}
                </View>
            </View>
        );
    }
}

ActionSheetLayout.propTypes = {
    header: PropTypes.any,
    actionButtons: PropTypes.any,
    hasCancelButton: PropTypes.bool,
    destructiveButtonIndex: PropTypes.number
};
