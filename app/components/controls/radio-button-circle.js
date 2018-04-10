import React from 'react';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

const outerCircle = {
    width: 20,
    height: 20,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
};

const innerCircle = {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: vars.peerioBlue
};

export default class Circle extends SafeComponent {
    render() {
        const { isSelected } = this.props;
        const borderColor = isSelected ? vars.peerioBlue : vars.toggleDefault;
        return (
            <View style={{ padding: 10 }}>
                <View style={[outerCircle, { borderColor }]}>
                    {isSelected ? <View style={innerCircle} /> : null}
                </View>
            </View>
        );
    }
}

Circle.propTypes = {
    isSelected: React.PropTypes.bool
};

Circle.defaultProps = {
    isSelected: true
};
