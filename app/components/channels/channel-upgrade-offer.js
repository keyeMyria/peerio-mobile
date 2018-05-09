import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import { observer } from 'mobx-react/native';
import { User } from '../../lib/icebear';
import buttons from '../helpers/buttons';
import { tx, T } from '../utils/translator';
import settingsState from '../settings/settings-state';
import { vars } from '../../styles/styles';
import { gradient } from '../controls/effects';
import Text from '../controls/custom-text';

@observer
export default class ChannelUpgradeOffer extends Component {
    render() {
        if (User.current.channelsLeft > 0) return null;

        const container = {
            flexGrow: 1,
            flex: 1,
            flexDirection: 'row',
            paddingVertical: vars.spacing.small.midi,
            paddingHorizontal: vars.spacing.medium.mini2x
        };

        const offerStyle = {
            maxWidth: '75%',
            marginRight: vars.spacing.medium.midi2x
        };

        const offerTextStyle = {
            color: 'white',
            backgroundColor: 'transparent',
            fontSize: vars.font.size.smaller,
            lineHeight: 20,
            textAlign: 'justify',
            // Padding is due to React JS bug with lineHeight on android
            paddingBottom: Platform.OS === 'android' ? vars.spacing.small.midi : 0
        };

        const buttonStyle = {
            maxWidth: '25%',
            justifyContent: 'center',
            marginTop: vars.spacing.medium.midi
        };

        return (gradient({ height: 100, alignItems: 'center' },
            <View style={container}>
                <View style={offerStyle}>
                    <Text style={offerTextStyle}>
                        <T k="title_channelUpgradeOffer">{{ limit: User.current.channelLimit }}</T>
                    </Text>
                </View>
                <View style={buttonStyle}>
                    {buttons.whiteTextButtonNoPadding(tx('button_upgrade'), () => settingsState.upgrade(), false, { fontWeight: '600' })}
                </View>
            </View>
        ));
    }
}
