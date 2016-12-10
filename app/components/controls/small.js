import React, { Component } from 'react';
import {
    Text
} from 'react-native';
import styles, { vars } from '../../styles/styles';

export default class Small extends Component {
    render() {
        let style = {
            fontSize: vars.font.size.smaller
        };
        if (this.props.style) {
            style = styles.inherit(style, this.props.style);
        }
        return (
            <Text style={style}>
                {this.props.children}
            </Text>
        );
    }
}

Small.propTypes = {
    children: React.PropTypes.any.isRequired,
    style: React.PropTypes.any
};
