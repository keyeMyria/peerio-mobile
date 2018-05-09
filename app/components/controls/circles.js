import PropTypes from 'prop-types';
import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { circles, vars } from '../../styles/styles';

const s = {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 10,
    marginBottom: vars.spacing.large.midi
};

const style = circles.small;

const dash = {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent'
};

const dashText = {
    color: 'white',
    fontSize: vars.font.size.big
};

@observer
export default class Circles extends SafeComponent {
    active(i) {
        return (
            <View key={i} style={style.active} />
        );
    }

    normal(i) {
        return this.props.empty ? (
            <View key={i} style={style.normal} />
        ) : (
            <View key={i} style={[style.active, dash]}>
                <Text style={dashText}>-</Text>
            </View>
        );
    }

    circle(i, current) {
        const active =
            this.props.fill ? i < current : i === current;
        return active ? this.active(i) : this.normal(i);
    }

    renderThrow() {
        const items = [];
        for (let i = 0; i < this.props.count; ++i) {
            items.push(this.circle(i, this.props.current));
        }
        return (
            <View style={s}>
                {items}
            </View>
        );
    }
}

Circles.propTypes = {
    count: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    fill: PropTypes.bool,
    empty: PropTypes.bool
};
