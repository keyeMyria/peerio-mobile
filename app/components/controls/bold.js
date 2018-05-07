import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Text from '../controls/custom-text';

export default class Bold extends Component {
    render() {
        return (
            <Text bold style={this.props.style}>
                {this.props.children}
            </Text>
        );
    }
}

Bold.propTypes = {
    children: PropTypes.any.isRequired,
    style: PropTypes.any
};
