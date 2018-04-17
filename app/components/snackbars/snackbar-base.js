import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, Animated, TouchableWithoutFeedback } from 'react-native';
import { reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { warnings, warningStates } from '../../lib/icebear';
import { vars } from '../../styles/styles';
import testLabel from '../helpers/test-label';

@observer
export default class SnackbarBase extends SafeComponent {
    constructor(props) {
        super(props);
        this.animatedHeight = new Animated.Value(0);
    }

    componentDidMount() {
        this.show();
        reaction(() => this.isVisible, vis => {
            vis ? this.show() : this.hide();
        });
    }

    // to override
    getText() { return null; }

    get isVisible() {
        const w = warnings.current;
        return !!(w && w.level === this.level && w.state === warningStates.SHOWING) && this.getText();
    }

    // to override
    getShowDelay() {
        return 0;
    }

    show() {
        if (!this.isVisible) {
            this._timer = null;
            return;
        }
        if (this._timer) {
            this._timer = null;
            this.animate(vars.snackbarHeight);
            return;
        }
        this._timer = setTimeout(() => this.show(), this.getShowDelay());
    }

    hide(cb) {
        this.animate(0, () => {
            cb && cb();
            this.show();
        });
    }

    tap() {
        console.log('snackbar-base.js: tap');
        warnings.current.dismiss();
    }

    animate(toValue, cb) {
        const duration = vars.animatedDuration;
        Animated.timing(this.animatedHeight, { toValue, duration })
            .start(cb);
    }

    renderThrow() {
        const s = {
            backgroundColor: vars.snackbarBg,
            justifyContent: 'flex-start',
            paddingLeft: vars.spacing.medium.mini2x,
            overflow: 'hidden',
            height: this.animatedHeight,
            flexDirection: 'row',
            alignItems: 'center'
        };
        const textStyle = {
            flex: 1,
            flexGrow: 1,
            flexShrink: 1,
            color: vars.white,
            marginRight: vars.spacing.medium.mini2x
        };
        return (
            <TouchableWithoutFeedback
                {...testLabel('snackbar')}
                onPress={() => this.tap()}>
                <Animated.View style={s}>
                    <Text numberOfLines={2} ellipsizeMode="tail" style={textStyle}>{this.getText()}</Text>
                </Animated.View>
            </TouchableWithoutFeedback>
        );
    }
}
