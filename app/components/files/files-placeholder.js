import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Dimensions, Image } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';

const fileUploadZeroState = require('../../assets/file-upload-zero-state.png');

@observer
export default class FilesPlaceholder extends SafeComponent {
    constructor(props) {
        super(props);
        this.width = Dimensions.get('window').width;
    }

    renderThrow() {
        const outerContainer = {
            flex: 1,
            width: this.width,
            justifyContent: 'center',
            marginTop: vars.spacing.medium.maxi
        };
        const infoContainer = {
            flex: 0,
            alignItems: 'center',
            marginTop: vars.spacing.large.maxi,
            marginBottom: vars.spacing.small.midi2x
        };
        const imageContainer = {
            flex: 1,
            paddingLeft: vars.spacing.medium.midi2x,
            paddingRight: vars.spacing.medium.midi2x
        };
        const headerStyle = {
            textAlign: 'center',
            fontSize: vars.font.size.huge
        };
        const infoStyle = {
            textAlign: 'center',
            fontSize: vars.font.size.bigger
        };
        return (
            <View style={outerContainer}>
                <View style={infoContainer}>
                    <Text style={infoStyle}>{tx('title_uploadShareAndManage')}</Text>
                </View>
                <View style={imageContainer}>
                    <Image
                        source={fileUploadZeroState}
                        resizeMode="contain"
                        style={{ flex: 1, width: null, height: null }} />
                </View>
                <View style={{ flex: 0.5 }}>
                    <Text style={headerStyle}>{tx('title_uploadSomething')}</Text>
                </View>
            </View>
        );
    }
}
