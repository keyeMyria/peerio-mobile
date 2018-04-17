import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { reaction } from 'mobx';
import { TouchableOpacity, View, Text, LayoutAnimation } from 'react-native';
// TODO fix imports after merging Fonts
// import { TouchableOpacity, View } from 'react-native';
// import Text from './controls/custom-text';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

@observer
export default class UnreadMessageIndicator extends SafeComponent {
    componentDidMount() {
        reaction(() => this.props.visible, () => {
            LayoutAnimation.easeInEaseOut();
        }, true);
    }

    renderThrow() {
        const { isAlignedTop, visible, action } = this.props;
        if (!visible) return null;
        const container = {
            position: 'absolute',
            right: 0,
            left: 0,
            height: 36,
            marginHorizontal: vars.spacing.small.midi2x,
            backgroundColor: vars.peerioBlue,
            justifyContent: 'center',
            alignItems: 'center'
        };
        const topAlignStyle = {
            top: 0,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10
        };
        const bottomAlignStyle = {
            bottom: 0,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
        };
        const alignmentStyle = isAlignedTop ? topAlignStyle : bottomAlignStyle;
        const marginTopStyle = !isAlignedTop ? { marginTop: vars.spacing.small.mini2x } : null;
        const text = {
            color: 'white',
            marginRight: vars.spacing.small.mini2x,
            marginTop: isAlignedTop ? vars.spacing.small.mini : null
        };
        const iconName = isAlignedTop ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
        return (
            <TouchableOpacity style={[container, alignmentStyle]} onPress={action}>
                <View style={[marginTopStyle, { flexDirection: 'row' }]}>
                    <Text semiBold style={text}>{tx('title_unreadMessages')}</Text>
                    {icons.plainWhite(iconName, vars.iconSize)}
                </View>
            </TouchableOpacity>
        );
    }
}

UnreadMessageIndicator.propTypes = {
    isAlignedTop: PropTypes.bool,
    visible: PropTypes.bool,
    action: PropTypes.any
};
