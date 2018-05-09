import PropTypes from 'prop-types';
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, action } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import AutoExpandingTextInput from '../controls/auto-expanding-textinput';
import { inputMain, vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { uiState, chatState } from '../states';
import testLabel from '../helpers/test-label';

@observer
export default class InputMain extends SafeComponent {
    @observable value = '';
    get hasText() {
        return this.value && this.value.length;
    }
    constructor(props) {
        super(props);
        this.value = this.props.value;
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value) {
            this.value = nextProps.value;
        }
    }

    @action.bound onChangeText(text) {
        this.value = text;
    }

    @action.bound plus() {
        this.props.plus();
    }

    @action.bound send() {
        if (!this.canSend) return;
        this.hasText ? this.props.send(this.value) : this.props.sendAck();
        this.value = '';
    }

    setFocus() {
        this.input.ti.focus();
    }

    get canSend() {
        return this.props.canSend || uiState.isAuthenticated && (this.hasText ? chatState.canSend : chatState.canSendAck);
    }

    renderThrow() {
        const { tiStyle, iconStyle, outerStyle, autoExpandingInputContainerStyle,
            sendIconStyleNormal, sendIconStyleActive } = inputMain;
        const icon = icons.white(this.hasText ? 'send' : 'thumb-up', this.send, iconStyle, vars.iconSizeSmall, 'buttonSendMessage');
        const sendIconStyle = this.canSend ? sendIconStyleActive : sendIconStyleNormal;
        const chatName = chatState.title;
        return (
            <View style={outerStyle}>
                {icons.dark(
                    'add-circle-outline',
                    this.plus,
                    {
                        paddingLeft: vars.spacing.small.mini2x,
                        paddingRight: vars.spacing.medium.maxi2x
                    },
                    null,
                    'buttonUploadToChat'
                )}
                <View style={autoExpandingInputContainerStyle}>
                    <AutoExpandingTextInput
                        onChangeText={this.onChangeText}
                        value={this.value}
                        placeholder={tx('title_messageInputPlaceholder', { chatName })}
                        minHeight={vars.iconSizeSmall * 2}
                        maxHeight={146}
                        style={tiStyle}
                        blurOnSubmit={false}
                        ref={ref => { this.input = ref; }}
                        {...testLabel('textInputMessage')}
                    />
                </View>
                <TouchableOpacity
                    {...testLabel('buttonSendMessage')}
                    pressRetentionOffset={vars.pressRetentionOffset}
                    onPress={this.send}
                    style={{ padding: vars.iconSizeSmall }}>
                    <View style={sendIconStyle}>
                        {icon}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}


InputMain.propTypes = {
    value: PropTypes.any,
    plus: PropTypes.func.isRequired,
    send: PropTypes.func.isRequired,
    sendAck: PropTypes.func.isRequired
};
