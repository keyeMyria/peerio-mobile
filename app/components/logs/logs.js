import React, { Component } from 'react';
import { Text, View, TouchableOpacity, NativeModules, Alert, ListView } from 'react-native';
import stringify from 'json-stringify-safe';
import moment from 'moment';
import { vars } from '../../styles/styles';
import { User, config } from '../../lib/icebear';

const { RNMail } = NativeModules;

const mapFormat = ({ time, msg }) => ({
    msg: msg && (typeof msg === 'string' ? msg : stringify(msg)),
    time: moment(time).format(`HH:mm:ss.SSS`)
});

const mapGlue = ({ msg, time }) => `${time}: ${msg}`;

export default class Logs extends Component {
    constructor(props) {
        super(props);
        this.dataSource = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 !== r2
        });
    }

    get data() {
        return console.stack.map(mapFormat).map(({ time, msg }, k) => ({ time, msg, k }));
    }

    sendLogs() {
        const subject = `Support // logs from ${User.current ? User.current.username : 'n/a'}`;
        const recipients = config.logRecipients;
        if (console.logVersion) console.logVersion();
        const body = `<pre>${console.stack.map(mapFormat).map(mapGlue).join('\n')}</pre>`;
        RNMail.mail(
            { subject, recipients, body, isHTML: true },
            (error) => error && Alert.alert(`Error sending logs`, error)
        );
    }

    sendButton() {
        const outer = {
            position: 'absolute',
            right: 40,
            bottom: 40
        };
        const s = {
            padding: vars.spacing.large.mini2x,
            opacity: 0.9,
            backgroundColor: vars.fabEnabled,
            borderRadius: 14
        };
        return (
            <View style={outer}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={() => this.sendLogs()}>
                    <View style={s}>
                        <Text style={{ color: 'white' }}>
                            {`Send Logs`}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }

    componentDidMount() {
        this.dataSource = this.dataSource.cloneWithRows(this.data.slice());
        this.forceUpdate();
    }

    listView() {
        return (
            <ListView
                initialListSize={2}
                pageSize={2}
                dataSource={this.dataSource}
                renderRow={this.item}
                enableEmptySections
                ref={sv => { this.scrollView = sv; }}
            />
        );
    }

    item(item) {
        const { time, msg, k } = item;
        return (
            <Text key={`${time}${k}`}>
                <Text style={{ color: '#666666' }}>{time}</Text>
                {': '}
                {msg}
            </Text>
        );
    }

    render() {
        return (
            <View style={{ flexGrow: 1 }}>
                {this.listView()}
                {this.sendButton()}
            </View>
        );
    }
}
