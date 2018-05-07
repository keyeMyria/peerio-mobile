import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, Dimensions, TouchableOpacity } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import plans from '../payments/payments-config';
import { tx } from '../utils/translator';

const { width, height } = Dimensions.get('window');

@observer
export default class AccountUpgradeNavigator extends Component {
    circle(checked, index) {
        const filled = index === this.props.selected;
        const w = 40;
        const s = {
            width: w,
            height: w,
            borderRadius: w / 2,
            borderColor: 'white',
            borderWidth: 3,
            backgroundColor: filled ? 'white' : 'transparent',
            alignItems: 'center',
            justifyContent: 'center'
        };
        const iconRender = checked && filled ? icons.plaindark : icons.plainWhite;
        const inner = checked ? iconRender('check', w / 1.5) : null;
        return (
            <TouchableOpacity
                onPress={() => this.props.onJumpTo(index)}
                pressRetentionOffset={vars.pressRetentionOffset}
                style={{ alignItems: 'center' }}>
                <View key={`${index}${filled}${checked}`} style={s}>{inner}</View>
            </TouchableOpacity>
        );
    }

    get line() {
        const s = {
            borderBottomWidth: 4,
            borderColor: 'white',
            flex: 1,
            flexGrow: 1,
            width: 40,
            height: 20
        };
        return <View style={s} />;
    }

    plan = index => this.circle(plans[index].isCurrent, index);

    render() {
        const navigator = {
            position: 'absolute',
            bottom: 140,
            width,
            paddingHorizontal: vars.spacing.medium.maxi2x
        };
        const row = {
            flex: 1,
            flexGrow: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
        };
        const t = {
            color: 'white',
            backgroundColor: 'transparent',
            marginTop: vars.spacing.small.midi,
            width: 40,
            textAlign: 'center'
        };
        const t1 = [t];
        const t3 = [t];

        if (height < 500) return null;

        return (
            <View style={navigator} key="navigator">
                <View style={row}>
                    {this.plan(0)}
                    {this.line}
                    {this.plan(1)}
                </View>
                <View style={row}>
                    <Text style={t1}>{tx('title_basicPlan')}</Text>
                    <Text style={t3}>{tx('title_proPlan')}</Text>
                </View>
            </View>
        );
    }
}

AccountUpgradeNavigator.propTypes = {
    selected: PropTypes.number,
    onJumpTo: PropTypes.any
};
