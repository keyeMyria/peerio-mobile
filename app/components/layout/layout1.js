import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, ScrollView } from 'react-native';
import { observable, reaction, when } from 'mobx';
import { MenuContext } from 'react-native-popup-menu';
import SafeComponent from '../shared/safe-component';
import SnackBarConnection from '../snackbars/snackbar-connection';
import uiState from '../layout/ui-state';
import { vars } from '../../styles/styles';

@observer
export default class Layout1 extends SafeComponent {
    @observable height = 0;

    componentDidMount() {
        uiState.currentScrollView = this._scrollView;
        this.keyboardReaction = reaction(() => [uiState.keyboardHeight, uiState.focusedTextBox], () => {
            if (!this.props.autoScroll) return;
            // console.debug('layout1.js: keyboard height or focused textbox changed');
            if (uiState.focusedTextBox) {
                // console.debug('layout1.js: trying to measure textbox');
                uiState.focusedTextBox.measure((fx, fy, width, height, px, py) => {
                    const padding = height + uiState.height / 8;
                    const preferrableY = uiState.height - padding - uiState.keyboardHeight;
                    // console.debug(`layout1.js: preferrable Y: ${preferrableY}`);
                    // console.debug(`layout1.js: py: ${py}`);
                    if (uiState.keyboardHeight > 0) {
                        if (py > preferrableY) {
                            this._scrollView.scrollTo({ y: py - preferrableY });
                            when(() => uiState.keyboardHeight === 0, () => this._scrollView.scrollTo({ y: 0 }));
                        }
                        if (py < 0) {
                            this._scrollView.scrollTo({ y: 0 });
                        }
                    }
                });
            }
        });
    }

    componentWillUnmount() {
        uiState.currentScrollView = null;
        this.keyboardReaction();
    }

    renderThrow() {
        const boxStyle = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBottom: global.platform === 'android' ? 0 : uiState.keyboardHeight
        };

        const contentContainerStyle = {
            flexGrow: 1,
            minHeight: this.props.noFitHeight ? undefined : this.height
        };

        const fillerStyle = {
            flexGrow: 1,
            justifyContent: 'space-between',
            backgroundColor: vars.darkBlueBackground05
        };

        return (
            <MenuContext>
                <View
                    onLayout={event => { this.height = event.nativeEvent.layout.height; }}
                    style={[boxStyle, this.props.style]}>
                    {this.props.header}
                    <ScrollView
                        ref={ref => { this._scrollView = ref; }}
                        contentContainerStyle={contentContainerStyle}
                        style={{ flex: 1, flexGrow: 1 }}
                        scrollEnabled={!this.props.noScroll}
                        keyboardShouldPersistTaps="handled">
                        <View style={fillerStyle}>
                            {this.props.body}
                            {this.props.footer}
                        </View>
                    </ScrollView>
                    {this.props.footerAbsolute}
                    <View style={{ position: 'absolute', bottom: 0, right: 0, left: 0 }}>
                        <SnackBarConnection />
                    </View>
                </View>
            </MenuContext>
        );
    }
}

Layout1.propTypes = {
    body: PropTypes.any,
    style: PropTypes.any,
    footer: PropTypes.any,
    footerAbsolute: PropTypes.any,
    header: PropTypes.any,
    padding: PropTypes.any,
    noScroll: PropTypes.bool,
    autoScroll: PropTypes.bool,
    noFitHeight: PropTypes.bool,
    noAutoHide: PropTypes.bool,
    noKeyboard: PropTypes.bool,
    defaultBar: PropTypes.bool
};
