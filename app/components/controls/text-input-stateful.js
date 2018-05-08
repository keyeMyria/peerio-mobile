import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { TextInput, View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class TextInputStateful extends SafeComponent {
    renderThrow() {
        const s = this.props.state;
        return (
            <View style={{ borderColor: vars.checkboxIconInactive, borderWidth: 1, marginTop: vars.spacing.small.midi2x }}>
                <TextInput
                    testID={this.props.name}
                    style={{ height: vars.inputHeight, paddingLeft: vars.iconPadding, fontFamily: vars.peerioFontFamily }}
                    underlineColorAndroid="transparent"
                    value={s.value}
                    selectTextOnFocus
                    onChangeText={text => { s.value = text; }}
                    placeholder={this.props.placeholder}
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete={false}
                    {...this.props}
                />
            </View>
        );
    }
}

TextInputStateful.propTypes = {
    returnKeyType: PropTypes.any,
    state: PropTypes.any.isRequired,
    name: PropTypes.string
};
