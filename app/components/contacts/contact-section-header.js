import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';

@observer
export default class ContactSectionHeader extends SafeComponent {
    renderThrow() {
        const { title } = this.props;
        if (!title) return null;
        const style = {
            height: vars.contactListHeaderHeight,
            justifyContent: 'center',
            backgroundColor: vars.darkBlueBackground05
        };

        const textStyle = {
            marginLeft: vars.spacing.large.mini,
            color: vars.txtMedium
        };
        return (
            <View style={style}>
                <Text bold style={textStyle}>{title}</Text>
            </View>
        );
    }
}

ContactSectionHeader.propTypes = {
    title: PropTypes.any
};
