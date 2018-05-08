import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import Layout1 from '../layout/layout1';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';

@observer
export default class LayoutModalExit extends SafeComponent {
    exitRow() {
        const container = {
            flexGrow: 1,
            flexDirection: 'row',
            alignItems: 'center',
            padding: vars.spacing.small.mini2x,
            paddingTop: vars.statusBarHeight * 2,
            paddingBottom: 0,
            backgroundColor: vars.darkBlueBackground15
        };
        const textStyle = {
            flexGrow: 1,
            flexShrink: 1,
            flex: 1,
            fontSize: vars.font.size.normal,
            textAlign: 'center',
            color: 'rgba(0, 0, 0, .54)'
        };
        return (
            <View style={container}>
                {icons.dark('close', () => this.props.onClose())}
                <Text semibold style={textStyle} ellipsizeMode="tail" numberOfLines={1}>{this.props.title}</Text>
                {this.props.rightIcon || icons.placeholder()}
            </View>
        );
    }

    lineBlock(content) {
        const s = {
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, .12)'
        };
        return (
            <View style={s}>{content}</View>
        );
    }

    header() {
        return (
            <View>
                {this.lineBlock(this.exitRow())}
            </View>
        );
    }

    renderThrow() {
        const header = this.header();
        const layoutStyle = {
            backgroundColor: 'white'
        };
        return (
            <Layout1
                defaultBar
                noFitHeight
                body={this.props.body}
                header={header}
                style={layoutStyle} />
        );
    }
}

LayoutModalExit.propTypes = {
    title: PropTypes.string,
    body: PropTypes.any,
    onClose: PropTypes.any,
    rightIcon: PropTypes.any
};
