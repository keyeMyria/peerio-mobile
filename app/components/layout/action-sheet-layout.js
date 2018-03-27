import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions, LayoutAnimation } from 'react-native';
import { action, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

const { width, height } = Dimensions.get('window');
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

const state = observable({
    visible: false,
    animating: false,
    config: null
});

@observer
export default class ActionSheetLayout extends SafeComponent {
    actionButtons() {
        const { header, actionButtons } = state.config;
        return (actionButtons.map((button, i) => {
            const topButton = (i === 0 && !header);
            const bottomButton = (i === actionButtons.length - 1);
            let container;
            if (topButton && bottomButton) container = lonelyButtonContainer;
            else if (!topButton && !bottomButton) container = centerButtonContainer;
            else if (topButton) container = topButtonContainer;
            else if (bottomButton) container = bottomButtonContainer;
            const text = button.isDestructive ? redButtonTextStyle : buttonTextStyle;
            return (
                <TouchableOpacity style={container} onPress={button.action}>
                    <Text style={text}>
                        {tx(button.title)}
                    </Text>
                </TouchableOpacity>);
        }));
    }

    @action static show(config) {
        // fade in of background
        LayoutAnimation.easeInEaseOut();
        state.animating = true;
        setTimeout(() => {
            // slide-in of menu
            LayoutAnimation.easeInEaseOut();
            state.animating = false;
        }, 10);
        state.visible = true;
        state.config = config;
        console.log('show');
    }

    @action.bound handleCancel() {
        // slide-out of menu
        LayoutAnimation.easeInEaseOut();
        state.animating = true;
        setTimeout(() => {
            // fade in of background
            LayoutAnimation.easeInEaseOut();
            state.visible = false;
            state.config = null;
            console.log('cancel');
        }, 10);
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
        if (!state.visible) return null;
        const { actionButtons, hasCancelButton, header } = state.config;
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
            paddingBottom: vars.spacing.small.midi2x,
            position: 'absolute',
            bottom: state.animating ? -height : 0
        };
        return (
            <TouchableWithoutFeedback onPress={this.handleCancel}>
                <View style={wrapper}>
                    <View style={container}>
                        {header}
                        {actionButtons && this.actionButtons()}
                        {hasCancelButton && this.cancelOption()}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}
