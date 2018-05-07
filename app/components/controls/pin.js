import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { t } from 'peerio-translator';
import { observable } from 'mobx';
import * as Animatable from 'react-native-animatable';
import SafeComponent from '../shared/safe-component';
import Circles from '../controls/circles';
import Center from '../controls/center';
import icons from '../helpers/icons';
import { vars, circles, pin } from '../../styles/styles';
import Util from '../helpers/util';
import Text from '../controls/custom-text';

@observer
export default class Pin extends SafeComponent {
    @observable message = '';
    @observable enteredPin = '';
    @observable pin = '';
    @observable isConfirm = false;
    @observable circleW = 0;
    @observable isSpinner = false;
    maxPinLength = 6;

    constructor(props) {
        super(props);
        this.layout = this.layout.bind(this);
        this.enter = this.enter.bind(this);
        this.shake = this.shake.bind(this);
    }

    componentWillMount() {
        this.initial();
    }

    get loading() {
        return this.isSpinner || this.props.inProgress;
    }

    check() {
        if (this.pin === this.enteredPin) {
            this.message = t('title_wait');
            this.isSpinner = true;
            this.props.onConfirm && this.props.onConfirm(this.enteredPin);
        } else {
            this.shake();
        }
    }

    confirm = () => {
        this.enteredPin = this.pin;
        this.pin = '';
        this.isConfirm = true;
        this.message = '';
        this.subTitle = t('title_PINConfirm');
    };

    error(msg) {
        this.isConfirm = false;
        this.message = msg || this.props.messageWrong || t('error_wrongPIN');
    }

    initial() {
        this.enteredPin = '';
        this.pin = '';
        this.isSpinner = false;
        this.isConfirm = false;
        this.subTitle = this.props.messageInitial;
        this.message = '';
    }

    circle(key, text, subText, action) {
        const r = this.circleW || 60;
        if (!text) {
            const s = { width: r, height: r, alignItems: 'center', justifyContent: 'center' };
            return (
                <View style={s} key={key}>
                    { subText && icons.white(subText, action) }
                </View>
            );
        }
        const circle = circles.create(r, {
            backgroundColor: vars.bg,
            borderColor: vars.highlight,
            borderWidth: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: this.circleW,
            height: this.circleW
        });
        const circleHl = circles.create(r, {
            backgroundColor: vars.midlight,
            width: this.circleW,
            height: this.circleW
        });
        return (
            <View style={circleHl} key={key}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    delayPressOut={0}
                    testID={`pin${text}`} onPressOut={() => this.enter(text)}>
                    <View style={circle}>
                        <Text style={{ color: vars.highlight, fontSize: vars.font.size.big }}>{text}</Text>
                        <Text style={{ color: vars.midlight, fontSize: vars.font.size.small }}>{subText}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    enter(num) {
        if (this.loading) return;
        if (this.pin.length >= this.maxPinLength) return;
        const pinValue = this.pin + num;
        this.pin = pinValue;
        console.log(`pin.js: pin ${this.pin}`);
        if (this.pin.length === this.maxPinLength) {
            console.log(`pin.js: pin ${this.pin}`);
            if (this.props.onEnter) {
                this.isSpinner = true;
                this.props.onEnter(pinValue)
                    .then(r => {
                        console.log(`returned ${r}`);
                        return this.props.onSuccess && this.props.onSuccess(r);
                    })
                    .catch(e => {
                        console.log(`pin.js: error ${e}`);
                        this.error();
                        this.isSpinner = false;
                        this.shake();
                    })
                    .finally(() => { this.isSpinner = false; });
                return;
            }
            if (this.isConfirm) {
                this.check();
            } else {
                if (this.props.preventSimplePin) {
                    if (!Util.pinEntropyCheck(this.pin)) {
                        this.shake(t('error_PINWeak'));
                        return;
                    }
                }
                const callback = this.props.checkPin || this.confirm;
                callback(this.pin, this);
            }
        }
    }

    backspace() {
        const l = this.pin.length;
        if (!l) return;
        this.pin = this.pin.substring(0, l - 1);
    }

    layout(e) {
        const { width, height } = e.nativeEvent.layout;
        this.circleW = Math.min(width / 3.9, height / 7.7);
    }

    row(index, items) {
        const children = items.map((i, ci) => this.circle(`${index}${ci}`, i.text, i.subText, i.action));
        return (
            <View key={index} style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: items.length === 1 ? 'center' : 'space-between'
            }}>
                {children}
            </View>
        );
    }

    shake(msg) {
        this.error(msg);
        this.shaker.shake(500, 5, 5);
        setTimeout(() => this.initial(), 1000);
    }

    spinner(value) {
        this.isSpinner = value;
    }

    renderThrow() {
        const style = pin;
        const p = (text, subText, action) => ({ text, subText, action });
        const bs = this.pin.length ? p(null, 'backspace', () => this.backspace()) : p();
        const inProgress = this.loading;
        const body = (
            <View style={{ flexGrow: 1, borderColor: 'green', borderWidth: 0, justifyContent: 'space-between' }}>
                <Text style={style.message.subTitle}>
                    {this.subTitle}
                </Text>
                <Animatable.View ref={v => { this.shaker = v; }} style={{ flex: 0, borderColor: 'blue', borderWidth: 0 }}>
                    <Center style={style.message.container}>
                        <Text style={style.message.text}>
                            {this.message}
                        </Text>
                    </Center>
                    <View style={{ height: 40, flexDirection: 'column' }}>
                        { inProgress ?
                            <View style={{ flex: 1, alignSelf: 'center' }}>
                                <ActivityIndicator style={{ marginTop: -6 }} color={vars.highlight} />
                            </View> :
                            <Circles count={this.maxPinLength} current={this.pin.length} fill empty={this.isConfirm} /> }
                    </View>
                </Animatable.View>
                <View style={{ flexGrow: 1,
                    opacity: inProgress ? 0.5 : 1,
                    borderWidth: 0,
                    borderColor: 'yellow',
                    marginTop: vars.spacing.medium.maxi2x,
                    marginLeft: vars.spacing.medium.mini2x,
                    marginRight: vars.spacing.medium.mini2x }}>
                    {this.row(0, [p(1), p(2, `ABC`), p(3, `DEF`)])}
                    {this.row(1, [p(4, `GHI`), p(5, `JKL`), p(6, `MNO`)])}
                    {this.row(2, [p(7, `PQRS`), p(8, `TUV`), p(9, `WXYZ`)])}
                    {this.row(3, [p(), p(`0`), bs])}
                </View>
            </View>
        );
        return (
            <View style={{
                flex: 1,
                flexGrow: 1
            }} onLayout={this.layout}>
                {this.circleW ? body : null}
            </View>
        );
    }
}

Pin.propTypes = {
    onConfirm: PropTypes.func,
    onEnter: PropTypes.func,
    onSuccess: PropTypes.func,
    checkPin: PropTypes.func,
    messageEnter: PropTypes.any,
    messageWrong: PropTypes.any,
    messageConfirm: PropTypes.any,
    messageInitial: PropTypes.any,
    preventSimplePin: PropTypes.bool,
    inProgress: PropTypes.bool
};
