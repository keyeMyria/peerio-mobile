import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import { View, TouchableOpacity, LayoutAnimation } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { t } from '../utils/translator';

const itemContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: vars.spacing.small.maxi,
    marginBottom: vars.spacing.small.mini,
    borderWidth: 0,
    borderColor: 'green',
    overflow: 'hidden',
    height: vars.inputHeight
};

@observer
export default class ChoiceItem extends SafeComponent {
    @observable opened = false;
    @observable selected = null;

    componentDidMount() {
        reaction(() => this.opened, () => LayoutAnimation.easeInEaseOut());
    }

    press() {
        // console.log('settings-item.js: press');
        this.props.onPress && this.props.onPress();
    }

    rightIcon(selected) {
        const selectedIcon = selected ? icons.dark('check') : null;
        return !this.opened ? icons.dark('keyboard-arrow-down') : selectedIcon;
    }

    renderItem(title, onPress, visible, selected) {
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                key={title}
                activeOpacity={this.props.untappable ? 1 : 0.3}
                pressRetentionOffset={offset}
                testID={title}
                style={{ overflow: 'hidden', height: (visible || selected) ? undefined : 0 }}
                onPress={onPress}>
                <View style={itemContainerStyle} pointerEvents="none">
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text style={{ color: vars.txtDark }}>
                            {t(title)}
                        </Text>
                    </View>
                    <View style={{ flex: 0, minHeight: vars.iconLayoutSize }}>
                        {this.rightIcon(selected)}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }

    get items() {
        return this.props.options.map(({ title, id }) => this.renderItem(
            title, () => {
                this.opened = true;
                this.props.state.selected = id;
            }, this.opened, id === this.props.state.selected));
    }

    renderThrow() {
        return <View>{this.items}</View>;
    }
}

ChoiceItem.propTypes = {
    options: PropTypes.any,
    state: PropTypes.any,
    onPress: PropTypes.any
};
