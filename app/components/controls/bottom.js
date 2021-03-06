import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
    View
} from 'react-native';

export default class Bottom extends Component {
    render() {
        const style = {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0
        };
        return (
            <View pointerEvents="box-none" style={style}>
                {this.props.children}
            </View>
        );
    }
}

Bottom.propTypes = {
    children: PropTypes.any
};
