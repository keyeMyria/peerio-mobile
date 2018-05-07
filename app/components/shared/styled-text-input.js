import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import { TextInput, View, Platform, Animated } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import { vars, styledTextInput } from '../../styles/styles';
import icons from '../helpers/icons';
import testLabel from '../helpers/test-label';
import { tx } from '../utils/translator';

// Because JS has no enums
const VALID = true;
const INVALID = false;
const UNDEFINED = undefined;

const borderOffset = { marginTop: -2 };

@observer
export default class StyledTextInput extends SafeComponent {
    @observable valid;
    @observable focused = false;
    @observable showSecret = false;
    @observable start = 0;
    @observable end = 0;
    @observable focusedAnim;
    @observable errorMessageText;

    constructor(props) {
        super(props);
        if (this.props.alwaysDirty) {
            this.validate();
        } else this.valid = UNDEFINED;
        this.focusedAnim = new Animated.Value(0);
    }

    componentWillUnmount() {
        if (uiState.focusedTextBox === this.textInput) {
            uiState.focusedTextBox = null;
        }
    }

    get isValid() { return this.valid; }

    /**
     * Sets validation state to INVALID and displays the custom error
     * @param {String} error - The error to be displayed
     */
    @action.bound setCustomError(error) {
        this.valid = INVALID;
        this.errorMessageText = error;
    }

    // Checks if text field is empty and validates accordingly
    handleEmptyField() {
        const { validations, alwaysDirty, state, required, testID } = this.props;
        try {
            if (!state.value) {
                if (alwaysDirty) {
                    this.valid = INVALID;
                    this.errorMessageText = validations[0].message;
                    throw new Error();
                }
                if (required) {
                    this.valid = INVALID;
                    this.errorMessageText = tx('title_required');
                }
            }
        } catch (error) {
            console.log(`Text Input ${testID}: No text to validate`);
        }
    }

    /**
     * Validates user input against each validation object in an array of validation objects
     * @prop {Array} validations - Array of validation objects
     * @prop {Object} validation - Consists of "action" and "message"
     * @prop {Func} validation.action - Validates "input". Returns true/false (VALID/INVALID)
     * @prop {String} validation.message - The error to show if validation fails at action
     */
    @action.bound async validate() {
        const { validations, alwaysDirty, state, testID } = this.props;
        this.handleEmptyField();
        // If no validation prop is passed, then no validation is needed and it is always valid
        if (!validations) {
            this.valid = VALID;
            return;
        }
        // Always dirty means the component's intial state will always be INVALID
        if (alwaysDirty) {
            // If its always dirty, assume it only has one validation method
            this.valid = INVALID;
            this.errorMessageText = validations[0].message;
        }
        // Create a promise chain in order to execute one validation at a time
        // Next validation gets executed only if the previous one returns VALID
        let promise = Promise.resolve();
        validations.forEach((validation) => {
            promise = promise.then(async () => {
                const { value } = state;
                const result = await validation.action(state.value)
                    .then((valid) => {
                        // Validation is inapplicable because it is validating against old input
                        if (value !== state.value) return false;
                        this.valid = valid;
                        if (valid === INVALID) {
                            this.errorMessageText = validation.message;
                            return false;
                        }
                        return true;
                    });
                // Throw an error to break the chain if a validation action returns INVALID
                if (result === false) {
                    throw new Error(this.errorMessageText);
                }
            });
        });
        // Append the end of the chain with a catch in order to break the chain
        // when one of the validations is INVALID
        promise = promise.catch(() => console.log(`Text Input ${testID}: Invalid input`));
    }

    @action.bound async onChangeText(text) {
        this.props.state.value = text;
        this.validate();
    }

    onSelectionChange = ({ nativeEvent: { selection: { start, end } } }) => {
        if (this._skip) {
            this._skip = false;
            return;
        }
        this.start = start;
        this.end = end;
    };

    @action.bound async onBlur() {
        if (!this.props.state.value) this.validate();
        uiState.focusedTextBox = null;
        this.focused = false;
        if (this.props.onBlur) this.props.onBlur();
        this.blurAnimation();
    }

    @action.bound onFocus() {
        uiState.focusedTextBox = this.textInput;
        this.focused = true;
        if (this.props.onFocus) this.props.onFocus();
        this.textInput.focus();
        this.focusAnimation();
    }

    focusAnimation() {
        Animated.timing(
            this.focusedAnim,
            {
                toValue: 1,
                duration: 300
            }).start();
    }

    blurAnimation() {
        const { state } = this.props;
        if (!(state.value && state.value.length)) {
            Animated.timing(
                this.focusedAnim,
                {
                    toValue: 0,
                    duration: 300
                }).start();
        }
    }

    get borderColor() {
        if (this.valid === INVALID) return vars.red;
        else if (this.focused) return vars.peerioBlue;
        return vars.inputBorderColor;
    }

    get hint() {
        const normalFont = vars.font.size.normal;
        const smallFont = vars.font.size.smaller;
        const fontSize = this.focusedAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [normalFont, smallFont]
        });
        const bottomMin = (vars.inputHeight - normalFont) / 2 - vars.spacing.small.mini;
        const bottomMax = (vars.inputHeight / 2) + vars.spacing.one;
        const bottom = this.focusedAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [bottomMin, bottomMax]
        });
        let color = vars.textBlack38;
        if (this.focused) color = vars.peerioBlue;
        if (this.valid === INVALID) color = vars.red;
        const animatedhintStyle = {
            alignSelf: 'center',
            color,
            fontSize
        };
        return (this.props.hint &&
            <Animated.View key="hint"
                pointerEvents="none"
                style={{ position: 'absolute', bottom, paddingLeft: vars.inputPaddingHorizontal }}>
                <Animated.Text
                    style={animatedhintStyle}>
                    {this.props.hint}
                </Animated.Text>
            </Animated.View>
        );
    }

    get secretIcon() {
        return !this.props.secureText ? null : (
            <View style={[styledTextInput.iconContainer, borderOffset]}>
                {this.showSecret ?
                    icons.colored('visibility', this.toggleSecret, vars.peerioTeal, 'transparent') :
                    icons.dark('visibility', this.toggleSecret, { backgroundColor: 'transparent' })}
            </View>
        );
    }

    get customIcon() {
        const { customIcon } = this.props;
        return !customIcon ? null : (
            <View style={[styledTextInput.iconContainer, borderOffset]}>
                {customIcon}
            </View>
        );
    }

    @action.bound toggleSecret() {
        const { state } = this.props;
        // we don't give user the ability to hide passphrase again, because Apple
        this.showSecret = !this.showSecret;
        // prevent cursor skip
        if (state.value && Platform.OS === 'android') this._skip = true;
    }

    // reserves space below text input for error message
    get errorSpacer() {
        const marginBottom = styledTextInput.errorStyle.height
            + styledTextInput.errorStyle.marginTop
            + styledTextInput.errorStyle.marginBottom;
        return (<View style={{ marginBottom }} />);
    }

    get errorMessage() {
        if (this.valid === INVALID) {
            return (
                <Text style={styledTextInput.errorStyle}>
                    {tx(this.errorMessageText)}
                </Text>);
        }
        return this.errorSpacer;
    }

    @action.bound textInputRef(ref) { this.textInput = ref; }

    renderThrow() {
        const { style, state, secureText, maxLength, testID } = this.props;
        const { start, end } = this;
        const fieldStyle = {
            height: vars.inputHeight,
            borderColor: this.borderColor,
            borderWidth: 1,
            borderRadius: 4,
            overflow: 'hidden'
        };
        const paddingRight = { paddingRight: secureText ? vars.iconSizeLarge : null };
        return (
            <View style={styledTextInput.outerStyle}>
                <View style={fieldStyle}>
                    {this.hint}
                    {this.secretIcon}
                    {this.customIcon}
                    <TextInput
                        style={[styledTextInput.textinputStyle, style, paddingRight]}
                        value={state.value}
                        secureTextEntry={secureText && !this.showSecret}
                        maxLength={maxLength}
                        selection={{ start, end }}
                        underlineColorAndroid="transparent"
                        autoCapitalize="none"
                        autoCorrect={false}
                        autoComplete={false}
                        onSelectionChange={this.onSelectionChange}
                        onChangeText={this.onChangeText}
                        ref={this.textInputRef}
                        onBlur={this.onBlur}
                        onFocus={this.onFocus}
                        {...testLabel(testID)}
                        {...this.props} />
                </View>
                {this.errorMessage}
            </View>
        );
    }
}

StyledTextInput.propTypes = {
    state: PropTypes.any,
    style: PropTypes.any,
    validations: PropTypes.any,
    hint: PropTypes.any,
    testID: PropTypes.any,
    alwaysDirty: PropTypes.bool,
    customIcon: PropTypes.any,
    secureText: PropTypes.bool,
    required: PropTypes.bool,
    maxLength: PropTypes.number,
    onBlur: PropTypes.any,
    onFocus: PropTypes.any
};
