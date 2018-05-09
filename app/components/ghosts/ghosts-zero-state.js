import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Dimensions, Image } from 'react-native';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import Text from '../controls/custom-text';

const ghostZeroState = require('../../assets/ghost-zero-state.png');
const arrowDownZeroState = require('../../assets/arrow-down-zero-state.png');

@observer
export default class GhostsZeroState extends SafeComponent {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
        this.height = Dimensions.get('window').height;
    }

    messaging() {
        const headerStyle = {
            textAlign: 'center',
            fontSize: vars.font.size.huge
        };
        const infoStyle = {
            textAlign: 'center',
            fontSize: vars.font.size.bigger
        };
        const outerContainerStyle = {
            flex: 1,
            alignItems: 'center'
        };
        const imageStyle = {
            flex: 1,
            width: null,
            borderWidth: 0,
            borderColor: 'blue',
            height: null
        };
        const titleBlockStyle = {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'flex-end',
            borderWidth: 0,
            borderColor: 'yellow',
            paddingRight: vars.spacing.large.mini,
            paddingBottom: vars.spacing.huge.maxi2x
        };
        return (
            <View style={outerContainerStyle}>
                <View style={{
                    flex: 1,
                    width: this.width,
                    justifyContent: 'center'
                }}>
                    <View style={{ flex: 0, alignItems: 'center', marginTop: vars.spacing.large.maxi }}>
                        <Text style={infoStyle}>
                            Encrypted, self destructing messages and
                            file sharing for your non-Peerio contacts
                        </Text>
                    </View>
                    <View style={{ borderColor: 'red', borderWidth: 0, flex: 1, paddingLeft: vars.spacing.huge.midi, paddingRight: vars.spacing.huge.midi }}>
                        <Image source={ghostZeroState}
                            resizeMode="contain"
                            style={{ flex: 1, width: null, height: null }} />
                    </View>
                    <View style={{ flex: 0.5 }}>
                        <Text style={headerStyle}>Send something.</Text>
                        <View style={titleBlockStyle}>
                            <View style={{ flex: 1, flexGrow: 0.5, borderWidth: 0, borderColor: 'red' }} />
                            <View style={{ flex: 1, borderWidth: 0, borderColor: 'green', justifyContent: 'flex-end' }}>
                                <Image source={arrowDownZeroState}
                                    resizeMode="contain"
                                    style={imageStyle} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    renderThrow() {
        const s = {
            flex: 1,
            justifyContent: 'space-between'
        };
        return (
            <View style={s}>
                {this.messaging()}
            </View>
        );
    }
}
