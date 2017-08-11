import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Image, Dimensions, TouchableOpacity } from 'react-native';
import Center from './center';
import { branding } from '../../styles/styles';

const origWidth = 1189;
const origHeight = 472;
const width = Dimensions.get('window').width - 100;
const height = width / origWidth * origHeight;

export default class Logo extends Component {
    render() {
        const { logo } = branding;
        return (
            <TouchableOpacity activeOpacity={1} onPress={this.props.onPress}>
                <Center style={{ marginBottom: 32, marginTop: 48, flexGrow: 0 }}>
                    <Image testID="logo" style={{ height, width }} source={logo} />
                </Center>
            </TouchableOpacity>
        );
    }
}

Logo.propTypes = {
    onPress: PropTypes.func
};
