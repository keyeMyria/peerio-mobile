import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, LayoutAnimation, TouchableOpacity } from 'react-native';
import { reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import { vars, helpers } from '../../styles/styles';

const inactiveColor = vars.toggleInactive;
const activeColor = vars.toggleActive;

@observer
export default class Toggle extends SafeComponent {
    componentDidMount() {
        reaction(() => this.props.active, () => LayoutAnimation.easeInEaseOut());
    }

    renderThrow() {
        const { active } = this.props;

        const outer = {
            marginHorizontal: vars.spacing.medium.mini2x,
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center'
        };
        const under = {
            borderRadius: 2,
            width: 36,
            height: 4,
            backgroundColor: active ? vars.toggleLineActive : vars.toggleLineInactive
        };

        const circle = helpers.circle(24);
        const circleOuter = {
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: active ? 'flex-end' : 'flex-start'
        };
        const circleAll = {
            backgroundColor: active ? activeColor : inactiveColor
        };

        return (
            <TouchableOpacity style={outer} pressRetentionOffset={vars.retentionOffset} onPress={this.props.onPress}>
                <View style={under} />
                <View style={circleOuter}>
                    <View style={[circle, circleAll]} />
                </View>
            </TouchableOpacity>
        );
    }
}

Toggle.propTypes = {
    active: PropTypes.bool,
    onPress: PropTypes.any
};
