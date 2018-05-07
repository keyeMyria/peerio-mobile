import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';

const container = {
    marginHorizontal: vars.spacing.medium.midi2x,
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vars.spacing.small.maxi2x
};

const textStyle = {
    overflow: 'hidden',
    paddingRight: vars.spacing.medium.mini2x
};

const text = {
    fontSize: vars.font.size.smaller,
    color: vars.txtMedium
};

@observer
export default class WarningItem extends SafeComponent {
    renderThrow() {
        return (
            <View style={container}>
                <Icon
                    style={{ paddingHorizontal: vars.spacing.medium.mini2x }}
                    name={this.props.iconType || 'warning'}
                    size={vars.iconSize}
                    color="gray"
                />
                <View style={textStyle}>
                    <Text style={text}>
                        {this.props.content}&nbsp;
                        {this.props.linkContent}
                    </Text>
                </View>
            </View>
        );
    }
}

WarningItem.propTypes = {
    icon: PropTypes.any,
    content: PropTypes.any,
    linkContent: PropTypes.any,
    link: PropTypes.any
};
