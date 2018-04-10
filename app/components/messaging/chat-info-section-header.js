import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

@observer
export default class ChatInfoSectionHeader extends SafeComponent {
    renderThrow() {
        const { title, collapsed, toggleCollapsed, hidden } = this.props;
        if (!title) return null;
        if (hidden) return null;
        const collapsible = toggleCollapsed;
        const style = {
            flex: 1,
            flexDirection: 'row',
            height: 48,
            marginTop: 8,
            marginBottom: !collapsed ? 16 : 0,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: vars.spacing.medium.mini2x,
            marginRight: vars.spacing.medium.mini2x
        };

        const textStyle = {
            fontWeight: 'bold',
            color: vars.subtleText
        };
        return (
            <TouchableOpacity
                pressRetentionOffset={vars.retentionOffset}
                style={style} onPress={toggleCollapsed} disabled={!collapsible}>
                <Text style={textStyle}>{title}</Text>
                {collapsible &&
                <Icon
                    name={collapsed
                        ? 'arrow-drop-down' : 'arrow-drop-up'}
                    size={24}
                    style={{ color: vars.subtleText }}
                />}
            </TouchableOpacity>
        );
    }
}

ChatInfoSectionHeader.propTypes = {
    title: PropTypes.any,
    collapsed: PropTypes.bool,
    toggleCollapsed: PropTypes.func,
    hidden: PropTypes.bool
};
