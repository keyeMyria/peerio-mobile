import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity
} from 'react-native';
import { observer } from 'mobx-react/native';
import mainState from '../main/main-state';
import { vars } from '../../styles/styles';

@observer
export default class PopupLayout extends Component {
    constructor(props) {
        super(props);
        this.button = this.button.bind(this);
    }

    onPress(item) {
        item.action && item.action();
        mainState.discardPopup();
    }

    button(item) {
        const { text, id } = item;
        const textStyle = {
            color: vars.bg,
            fontWeight: 'bold'
        };
        const padding = 16;
        const touchable = {
            padding
        };
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                style={touchable}
                key={id}
                onPress={() => this.onPress(item)}>
                <Text style={textStyle}>
                    {text}
                </Text>
            </TouchableOpacity>
        );
    }

    render() {
        const popup = mainState.activePopup;
        if (!popup) return null;

        const modalStyle = {
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };

        const popupNonAnimatedStyle = [modalStyle, {
            justifyContent: 'center',
            backgroundColor: '#00000020',
            transform: [{ translateY: 0 }]
        }];

        const container = {
            shadowColor: '#000000',
            shadowOpacity: 0.2,
            shadowRadius: 8,
            shadowOffset: {
                height: 1,
                width: 1
            },
            margin: 20,
            backgroundColor: 'white'
        };

        const title = {
            fontWeight: 'bold',
            fontSize: 16
        };

        const buttonBar = {
            flexDirection: 'row',
            justifyContent: 'flex-end'
        };

        return (
            <View style={popupNonAnimatedStyle}>
                <View style={container}>
                    <View style={{ padding: 20 }}>
                        <Text style={title}>{popup.title}</Text>
                        {popup.subTitle}
                        {popup.contents}
                    </View>
                    <View style={buttonBar}>
                        {popup.buttons.map(this.button)}
                    </View>
                </View>
            </View>
        );
    }
}

PopupLayout.propTypes = {
};