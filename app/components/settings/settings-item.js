import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import { t } from '../utils/translator';
import testLabel from '../helpers/test-label';

const itemContainerStyle = {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingLeft: vars.spacing.small.maxi2x,
    marginBottom: vars.spacing.small.mini,
    minHeight: vars.settingsItemHeight,
    borderRadius: 4
};

const descriptionStyle = {
    color: vars.txtLightGrey,
    fontSize: vars.font.size.smaller
};

@observer
export default class SettingsItem extends SafeComponent {
    press() {
        // console.log('settings-item.js: press');
        this.props.onPress && this.props.onPress();
    }

    get rightIcon() {
        return this.props.icon !== null ?
            icons.dark(this.props.icon || 'keyboard-arrow-right')
            : null;
    }

    renderThrow() {
        const titleStyle = {
            color: this.props.disabled ? vars.txtLightGrey : vars.txtDark,
            fontSize: vars.font.size.bigger
        };
        const offset = vars.retentionOffset;
        return (
            <TouchableOpacity
                {...testLabel(this.props.title)}
                activeOpacity={this.props.untappable ? 1 : 0.3}
                pressRetentionOffset={offset}
                onPress={() => !this.props.untappable && !this.props.disabled && this.press()}>
                <View style={[itemContainerStyle]} pointerEvents={this.props.untappable ? undefined : 'none'}>
                    <View style={{ flexGrow: 1, flexShrink: 1 }}>
                        <Text style={titleStyle}>
                            {t(this.props.title)}
                        </Text>
                        {!!this.props.description && <Text style={descriptionStyle}>
                            {this.props.description}
                        </Text>}
                    </View>
                    <View style={{ flex: 0 }}>
                        {this.props.children}
                    </View>
                    <View style={{ flex: 0 }}>
                        {this.rightIcon}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

SettingsItem.propTypes = {
    children: PropTypes.any,
    title: PropTypes.any,
    description: PropTypes.any,
    disabled: PropTypes.bool,
    untappable: PropTypes.bool,
    icon: PropTypes.string,
    onPress: PropTypes.any
};
