import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { ActivityIndicator, View, Image } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import ErrorCircle from './error-circle';
import { vars } from '../../styles/styles';

const avatarDiameter = 36;

@observer
export default class AvatarCircle extends SafeComponent {
    renderThrow() {
        const { large, medium, contact, loading, invited } = this.props;
        let ratio = 1;
        if (large) ratio = 2 + (2 / 3);
        if (medium) ratio = 2;
        const width = avatarDiameter * ratio;
        const height = width;
        const avatarStyle = {
            width,
            height,
            borderRadius: width / 2,
            marginTop: vars.spacing.small.mini2x * ratio,
            marginBottom: vars.spacing.small.mini2x * ratio
        };
        if (loading) {
            return <ActivityIndicator style={{ height, margin: vars.spacing.small.mini2x }} />;
        }

        const { color, tofuError, letter } = contact || {};
        const coloredAvatarStyle = [avatarStyle, {
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: color || 'gray'
        }];
        const avatarLetter = (
            <View style={coloredAvatarStyle}>
                <Text style={{ color: 'white', textAlign: 'center', width: 14 * ratio, fontSize: vars.font.size.smaller * ratio }}>
                    {letter}
                </Text>
            </View>
        );

        const groupIcon = <View style={coloredAvatarStyle}>{icons.plainWhite('group')}</View>;
        let avatarIcon = null;
        if (contact) {
            if (invited) {
                avatarIcon = (
                    <View style={[avatarStyle, { justifyContent: 'center', alignItems: 'center' }]}>
                        {icons.plaindark('person', width)}
                    </View>
                );
            }
            if (contact.hasAvatar) {
                const uri = (large || medium) ? contact.largeAvatarUrl : contact.mediumAvatarUrl;
                // image is absolute positioned so that it doesn't jump over letter when it loads
                avatarIcon = (
                    <Image
                        source={{ uri, cache: 'force-cache' }}
                        key={uri}
                        style={[avatarStyle, { position: 'absolute' }]}
                    />
                );
            }
        }

        return (
            <View style={{ borderWidth: 0, borderColor: 'green' }}>
                {/* if we don't have contact specified show group icon */}
                {!contact && groupIcon}
                {/* show letter if there's no avatar or it hasn't loaded yet */}
                {!invited && contact && avatarLetter}
                {avatarIcon}
                <ErrorCircle large={this.props.large} visible={tofuError} />
            </View>
        );
    }
}

AvatarCircle.propTypes = {
    contact: PropTypes.any,
    loading: PropTypes.bool,
    large: PropTypes.bool,
    medium: PropTypes.bool,
    invited: PropTypes.bool
};
