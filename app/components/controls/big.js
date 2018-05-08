import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';

export default class Big extends Component {
    render() {
        const style = {
            fontSize: vars.font.size.big
        };
        return (
            <Text style={[style, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

Big.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any
};
