import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TextInput, LayoutAnimation, TouchableOpacity, Platform } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { t } from '../utils/translator';
import uiState from '../layout/ui-state';
import { vars, textbox } from '../../styles/styles';
import icons from '../helpers/icons';
import testLabel from '../helpers/test-label';

@observer
export default class TextBox extends SafeComponent {
    @observable focused = false;
    @observable showSecret = false;
    @observable _value = '';
    @observable start = 0;
    @observable end = 0;

    get nextField() {
        const { byOrder, byName } = this.props.state;
        if (!byOrder || !byName) return null;
        const { name } = this.props;
        return byOrder[byName[name] + 1];
    }

    get value() {
        return this.props.state ?
            this.props.state[this.props.name] : this.props.value;
    }

    get valid() {
        return this.props.state ?
            this.props.state[`${this.props.name}Valid`] : this.props.valid;
    }

    get validationMessage() {
        return this.props.state ?
            this.props.state[`${this.props.name}ValidationMessage`] : this.props.validationMessage;
    }

    componentDidMount() {
        reaction(() => this.value, text => {
            if (this._value === text) return;
            this._value = text;
        }, true);
        reaction(() => [this.focused, this.value], () => {
            LayoutAnimation.easeInEaseOut();
        }, true);
        const s = this.props.state;
        if (s) {
            // add focus callback so that we can be focused on Next action
            const focus = s.focus || {};
            focus[this.props.name] = () => this.focus();
            s.focus = focus;
        }
    }

    componentWillUnmount() {
        if (uiState.focusedTextBox === this.textinput) {
            uiState.focusedTextBox = null;
        }
    }

    _callState(name, value) {
        const s = this.props.state;
        const n = `${this.props.name}${name}`;
        s && s[n] && s[n](value);
    }

    blur = () => {
        console.log('textbox.js: blur');
        this._callState(`OnBlur`);
        uiState.focusedTextBox = null;
        this.focused = false;
    };

    changeText = (text) => {
        console.log('textbox.js: changeText');
        let tx = text;
        const { Version, OS } = Platform;
        if (OS !== 'android' || Version > 22) {
            tx = this.props.lowerCase ? text.toLowerCase() : text;
        }
        if (this.props.state) {
            this.props.state[this.props.name] = tx;
        } else {
            this.props.value = tx;
        }
        this._callState(`OnChange`, tx);
        this.props.onChangeText && this.props.onChangeText(this.props.name, tx);
    };

    focus = () => {
        console.log('textbox.js: focus');
        this.textinput.offsetY = this.offsetY;
        this.textinput.offsetHeight = this.offsetHeight;
        uiState.focusedTextBox = this.textinput;
        this.focused = true;
        requestAnimationFrame(() => this.textinput.focus());
    };


    onSelectionChange = ({ nativeEvent: { selection: { start, end } } }) => {
        if (this._skip) {
            this._skip = false;
            return;
        }
        this.start = start;
        this.end = end;
    };

    toggleSecret = () => {
        // we don't give user the ability to hide passphrase again, because Apple
        this.showSecret = !this.showSecret;
        // prevent cursor skip
        if (this.value && Platform.OS === 'android') this._skip = true;
    };

    submit = () => {
        const s = this.props.state;
        if (!s) return;
        // if no next field, we are the last one in form
        const { nextField } = this;
        if (!nextField) {
            this.props.onSubmit && this.props.onSubmit();
            return;
        }
        // we hope that other textbox actually added "focus" handler
        const focuser = s.focus[nextField];
        focuser && focuser();
    };

    get validationControl() {
        return !this.valid ? (
            <Text
                style={{
                    height: 14,
                    color: vars.red,
                    fontSize: vars.font.size.smaller,
                    backgroundColor: 'transparent'
                }}>{t(this.validationMessage)}</Text>
        ) : (
            <View style={{ height: 14 }} />
        );
    }

    get customIcon() {
        const { customIcon } = this.props;
        return customIcon ?
            <View style={textbox.iconContainer}>
                {icons.colored(customIcon, null, vars.confirmColor)}
            </View> : null;
    }

    get secretIcon() {
        return !this.props.secureTextEntry ? null : (
            <View style={textbox.iconContainer}>
                {this.showSecret ?
                    icons.colored('visibility', this.toggleSecret, vars.peerioTeal, 'transparent') :
                    icons.dark('visibility', this.toggleSecret, { backgroundColor: 'transparent' })}
            </View>
        );
    }

    get hint() {
        const style = (this.focused || (this.value && this.value.length)) ?
            textbox.hint.small : textbox.hint.normal;
        return (
            <View key="hint"
                pointerEvents="none"
                style={[style.container]}>
                <Text style={style.text}>
                    {this.props.hint}
                </Text>
            </View>
        );
    }

    layout = () => {
        this._container.measure((frameX, frameY, frameWidth, frameHeight, pageX, pageY) => {
            this.offsetY = pageY;
            this.offsetHeight = frameHeight;
        });
    };
    renderThrow() {
        // console.log('re-render');
        const returnKeyType = this.props.returnKeyType || 'default';
        const style = this.focused ? textbox.focused : textbox.blurred;
        const icAlert = this.validationMessage ? textbox.alertVisible : textbox.alertInvisible;
        let fontSize = vars.font.size.normal;
        const astl = this.props.autoShrinkTextLimit;
        if (astl && this.value && this.value.length && astl < this.value.length) {
            fontSize = Math.floor(fontSize * astl / this.value.length);
        }
        const { secretIcon, customIcon, start, end } = this;
        // temporary hack until textbox component is replaced with new one
        let borderColorOverride;
        if (this.value || this.focused) {
            borderColorOverride = vars.peerioBlue;
        } else {
            borderColorOverride = vars.black38;
        }
        return (
            <View style={textbox.outerContainer} onLayout={this.layout} ref={ref => { this._container = ref; }}>
                <View style={[style.outer]}>
                    <View
                        style={[style.radius, { borderColor: borderColorOverride }]}>
                        {this.hint}
                        <View
                            style={[textbox.inputContainer, icAlert]}>
                            <TextInput
                                keyboardType={this.props.keyboardType}
                                style={[style.textbox, { fontSize },
                                    { height: vars.inputPaddedHeight, top: 0, marginRight: this.secretIcon ? 42 : 0 }]}
                                ref={ref => { this.textinput = ref; }}
                                underlineColorAndroid="transparent"
                                returnKeyType={returnKeyType}
                                secureTextEntry={this.props.secureTextEntry && !this.showSecret}
                                value={this._value}
                                maxLength={this.props.maxLength}
                                selection={{ start, end }}
                                onFocus={() => {
                                    uiState.focusTextBox(this.textinput);
                                    this.focused = true;
                                }}
                                onBlur={this.blur}
                                onChangeText={this.changeText}
                                onSubmitEditing={this.submit}
                                onSelectionChange={this.onSelectionChange}
                                autoCorrect={false}
                                autoComplete={false}
                                autoCapitalize="none"
                                {...testLabel(this.props.name)}
                            />
                        </View>
                        {secretIcon}
                        {customIcon}
                        {!this.focused && !process.env.CIRCLE_TEST_REPORTS ? <TouchableOpacity
                            disabled={this.props.disabled}
                            activeOpacity={0.9}
                            pressRetentionOffset={vars.retentionOffset}
                            style={[style.touchable]}
                            onPress={this.focus} /> : null}
                    </View>
                </View>
                {this.validationControl}
            </View>
        );
    }
}

TextBox.propTypes = {
    onChangeText: PropTypes.func,
    onSubmit: PropTypes.func,
    value: PropTypes.any,
    state: PropTypes.any,
    valid: PropTypes.bool,
    validationMessage: PropTypes.string,
    hint: PropTypes.any.isRequired,
    info: PropTypes.any,
    name: PropTypes.string.isRequired,
    returnKeyType: PropTypes.any,
    keyboardType: PropTypes.any,
    secureTextEntry: PropTypes.bool,
    lowerCase: PropTypes.bool,
    autoCapitalize: PropTypes.oneOf(['none', 'sentences', 'words', 'characters']),
    autoCorrect: PropTypes.bool,
    autoShrinkTextLimit: PropTypes.number,
    maxLength: PropTypes.number
};
