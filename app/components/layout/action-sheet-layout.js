import React from 'react';
import { observer } from 'mobx-react/native';
/* eslint-disable */
import { View, Text, TouchableOpacity, TouchableWithoutFeedback, Dimensions, LayoutAnimation, Platform } from 'react-native';
/* eslint-enable */
import { action, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';
import { uiState } from '../states';

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
    borderRadius
}];

const cancelButtonWrapper = {
    backgroundColor: vars.white,
    marginTop: vars.spacing.small.midi2x,
    borderRadius
};

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

const disabledButtonTextStyle = [buttonTextStyle, {
    color: vars.disabledButtonFontColor
}];

const state = observable({
    visible: false,
    animating: false,
    config: null
});

@observer
export default class ActionSheetLayout extends SafeComponent {
    async executeAction(button) {
        if (button.disabled) return;
        await ActionSheetLayout.hide();
        button.action();
    }

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
            let text;
            if (button.isDestructive) {
                text = redButtonTextStyle;
            } else if (button.disabled) {
                text = disabledButtonTextStyle;
            } else text = buttonTextStyle;
            return (
                <View key={button.title} style={[container, { backgroundColor: vars.lightGrayBg }]} >
                    <TouchableOpacity
                        style={container}
                        onPress={() => this.executeAction(button)} >
                        <Text style={text}>
                            {tx(button.title)}
                        </Text>
                    </TouchableOpacity>
                </View>);
        }));
    }

    @action static async show(config) {
        // Temporary hack for android animation bug
        // fade in of background
        LayoutAnimation.easeInEaseOut();
        if (Platform.OS === 'ios') {
            state.animating = true;
            await new Promise(resolve => setTimeout(() => {
                // slide-in of menu
                LayoutAnimation.easeInEaseOut();
                state.animating = false;
                resolve();
            }, 10));
        }
        state.config = config;
        state.visible = true;
        uiState.actionSheetShown = true;
    }

    @action static async hide() {
        if (!state.visible) return;
        // slide-out of menu
        LayoutAnimation.easeInEaseOut();
        if (Platform.OS === 'ios') {
            state.animating = true;
            await new Promise(resolve => setTimeout(() => {
                // fade in of background
                LayoutAnimation.easeInEaseOut();
                state.visible = false;
                state.config = null;
                resolve();
            }, 10));
        } else {
            state.visible = false;
            state.config = null;
        }
        uiState.actionSheetShown = false;
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
        }, 10);
        uiState.actionSheetShown = false;
    }

    cancelOption() {
        return (
            <View style={cancelButtonWrapper} >
                <TouchableOpacity style={cancelButtonContainer} onPress={this.handleCancel}>
                    <Text style={boldButtonTextStyle}>
                        {tx('button_cancel')}
                    </Text>
                </TouchableOpacity>
            </View>
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
            backgroundColor: '#00000020',
            zIndex: 15
        };
        const container = {
            paddingBottom: vars.spacing.small.midi2x,
            position: 'absolute',
            bottom: state.animating && Platform.OS !== 'android' ? -height : 0
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
