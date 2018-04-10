import React from 'react';
import { observer } from 'mobx-react/native';
import { Animated, Dimensions, StatusBar, Platform, ScrollView } from 'react-native';
import { reaction, observable } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import routerModal from '../routes/router-modal';
import uiState from './ui-state';

@observer
export default class ModalLayout extends SafeComponent {
    @observable modal = null;

    constructor(props) {
        super(props);
        this.height = Dimensions.get('window').height;
        this.modalAnimated = new Animated.Value(this.height);
    }

    componentDidMount() {
        reaction(() => routerModal.modal, modal => {
            const duration = vars.animationDuration;
            const useNativeDriver = true;
            if (modal) {
                uiState.hideKeyboard();
                this.modal = modal;
                routerModal.animating = true;
                // add timeout to allow for render to happen
                setTimeout(() => Animated.timing(this.modalAnimated, { toValue: 0, duration, useNativeDriver })
                    .start(() => { routerModal.animating = false; }), 20);
            } else {
                // this.modal = null;
                Animated.timing(this.modalAnimated, { toValue: this.height, duration, useNativeDriver })
                    .start(() => {
                        setTimeout(() => { this.modal = null; }, 10);
                    });
            }
        });
    }

    get androidTapContainer() {
        const grow = { flex: 1, flexGrow: 1 };
        return (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={grow} style={grow} scrollEnabled={false}>
                {this.modal}
            </ScrollView>
        );
    }

    renderThrow() {
        const modalStyle = {
            backgroundColor: vars.darkBlueBackground05,
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            right: 0
        };
        const transformModal = [{ translateY: this.modalAnimated }];
        const modalAnimatedStyle = [modalStyle, { transform: transformModal }];
        const sbStyle = routerModal.current && routerModal.current.isWhite ? 'light-content' : 'default';
        return (
            <Animated.View style={modalAnimatedStyle}>
                {Platform.OS === 'android' ? this.androidTapContainer : this.modal}
                <StatusBar
                    barStyle={!routerModal.animating && routerModal.current ? sbStyle : undefined}
                    hidden={Platform.OS !== 'android' && !this.modal} />
            </Animated.View>
        );
    }
}
