import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
/* eslint-disable */
import { Text as RNText, Platform } from 'react-native';
/* eslint-enable */
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

/**
 * Replaces all RN text components in order to use Open Sans font family
 */
@observer
export default class Text extends SafeComponent {
    renderThrow() {
        const { semibold, bold, italic } = this.props;
        const style = this.props.style || {};
        const font = [vars.peerioFontFamily];
        if (Platform.OS === 'android') {
            if (semibold) font.push('SemiBold');
            else if (bold) font.push('Bold');
            if (italic) font.push('Italic');
        } else {
            style.fontWeight = '400';
            // default font style is normal
            style.fontStyle = 'normal';
            if (bold) style.fontWeight = '700';
            if (semibold) style.fontWeight = '600';
            if (italic) style.fontStyle = 'italic';
        }
        let fontFamily = font.join('');
        if (Platform.OS === 'android') fontFamily = fontFamily.replace(' ', '');
        return (
            <RNText {...this.props} style={[style, { fontFamily }]}>
                {this.props.children}
            </RNText>
        );
    }

    render() {
        try {
            return this.renderThrow();
        } catch (e) {
            console.error(e);
            const style = this.props.style || {};
            return (
                <RNText {...this.props} style={style}>
                    {this.props.children}
                </RNText>);
        }
    }
}

Text.propTypes = {
    style: PropTypes.any,
    semibold: PropTypes.any,
    bold: PropTypes.any,
    italic: PropTypes.any,
    children: PropTypes.any
};
