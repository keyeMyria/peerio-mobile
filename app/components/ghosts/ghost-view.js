import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Share from 'react-native-share';
import moment from 'moment';
import SafeComponent from '../shared/safe-component';
import { tx } from '../utils/translator';
// import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import { mailStore } from '../../lib/icebear';

const padding = vars.spacing.small.midi2x;
const marginVertical = vars.spacing.small.mini2x;

const row = {
    flexDirection: 'row',
    justifyContent: 'space-between'
};

const normalText = {
    color: vars.txtDark,
    fontSize: vars.font.size.smaller
};

const lightText = {
    color: vars.subtleText,
    fontSize: vars.font.size.smaller
};

const boldText = {
    fontWeight: '700',
    fontSize: vars.font.size.big,
    height: 36
};

const infoBlock = {
    padding,
    borderTopWidth: 1,
    borderTopColor: '#cfcfcf',
    backgroundColor: '#efefef'
};

const textBlock = {
    flex: 1,
    flexGrow: 1,
    padding,
    fontSize: vars.font.size.smaller,
    marginVertical
};

const filler = {
    flex: 1,
    flexGrow: 1
};

@observer
export default class Ghost extends SafeComponent {
    get ghost() {
        return mailStore.selectedGhost;
    }

    share() {
        Share.open({
            title: tx('title_mail'),
            message: this.ghost.passphrase,
            subject: tx('button_share')
        })
            .catch(() => {
                console.log(`ghost-view.js: share cancelled by user`);
            });
    }

    renderThrow() {
        const g = this.ghost;
        if (!g) return null;

        return (
            <View style={filler}>
                <View style={{ padding }}>
                    <Text style={lightText}>Passphrase</Text>
                    <TouchableOpacity
                        pressRetentionOffset={vars.retentionOffset}
                        onPress={() => this.share()}>
                        <Text style={boldText}>
                            {g.passphrase}
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={infoBlock}>
                    <View style={row}>
                        <Text style={normalText}>Me</Text>
                        <Text style={lightText}>
                            {moment(g.timestamp).format(`LLL`)}
                        </Text>
                    </View>
                    <View style={{ marginVertical }}>
                        <Text style={normalText}>to {g.recipients.join(', ')}</Text>
                    </View>
                    <Text style={normalText}>
                        {g.subject}
                    </Text>
                </View>
                <ScrollView>
                    <TouchableOpacity>
                        <Text style={textBlock} selectable>
                            {g.body}
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}
