import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import SafeComponent from '../shared/safe-component';
import uiState from '../layout/ui-state';
import icons from '../helpers/icons';
import Text from '../controls/custom-text';

@observer
export default class PickerBoxIos extends SafeComponent {
    constructor(props) {
        super(props);
        this.focus = this.focus.bind(this);
        this.picker = this.props.picker;
    }

    focus() {
        if (uiState.pickerVisible) {
            uiState.hidePicker();
            return;
        }
        uiState.showPicker(this.picker);
    }

    renderThrow() {
        const focused = uiState.pickerVisible && uiState.picker === this.picker;
        const { shadow, background, textview, container, iconContainer, icon } =
            focused ? this.props.style.active : this.props.style.normal;
        return (
            <View style={shadow}>
                <View
                    style={background}>
                    <TouchableOpacity testID="pickerBox" onPress={this.focus}>
                        <View
                            pointerEvents="none"
                            style={container}>
                            <Text style={textview}>
                                {this.props.data[this.props.value]}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View
                        pointerEvents="none"
                        style={iconContainer}>
                        {focused ?
                            icons.dark('arrow-drop-down', () => { }, icon) :
                            icons.white('arrow-drop-down', () => { }, icon)}
                    </View>
                </View>
            </View>
        );
    }
}

PickerBoxIos.propTypes = {
    value: PropTypes.any.isRequired,
    picker: PropTypes.any.isRequired,
    data: PropTypes.any.isRequired,
    style: PropTypes.any.isRequired,
    hint: PropTypes.any.isRequired
};
