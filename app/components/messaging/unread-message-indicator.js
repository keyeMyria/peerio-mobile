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
        const { visible, action } = this.props;
        if (!visible) return null;
        const container = {
            position: 'absolute',
            bottom: 0,
            right: 0,
            left: 0,
            height: 36,
            marginHorizontal: vars.spacing.small.midi2x,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: vars.peerioBlue,
            justifyContent: 'center',
            alignItems: 'center'
        };
        const text = {
            color: 'white',
            marginRight: vars.spacing.small.mini2x
        };
        return (
            <TouchableOpacity style={container} onPress={action}>
                <View style={{ flexDirection: 'row', marginTop: vars.spacing.small.mini2x }}>
                    <Text semiBold style={text}>{tx('title_unreadMessages')}</Text>
                    {icons.plainWhite('keyboard-arrow-down', vars.iconSize)}
                </View>
            </TouchableOpacity>
        );
    }
}

UnreadMessageIndicator.propTypes = {
    visible: PropTypes.bool,
    action: PropTypes.any
};
