import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Text from '../controls/custom-text';
import { vars } from '../../styles/styles';

export default class ErrorText extends Component {
    render() {
        const style = {
            color: vars.txtAlert
        };
        return (
            <Text style={[style, this.props.style]}>
                {this.props.children}
            </Text>
        );
    }
}

ErrorText.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any
};

