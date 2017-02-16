import React, { Component } from 'react';
import {
    View, Text
} from 'react-native';
import { observer } from 'mobx-react/native';
import { contactStore } from '../../lib/icebear';

const circleDiameter = 18;

const circleStyle = {
    width: circleDiameter,
    height: circleDiameter,
    borderRadius: circleDiameter / 2,
    margin: 4,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center'
};

@observer
export default class ReadReceipt extends Component {
    constructor(props) {
        super(props);
        this.contact = contactStore.getContact(props.username);
    }

    render() {
        const username = this.props.username;
        const { firstName, color } = this.contact;
        const letter = (firstName || username || ' ')[0].toUpperCase();

        const circleOnline = {
            backgroundColor: color || '#ccc'
        };

        return (
            <View style={[circleStyle, circleOnline]}>
                <Text style={{ fontSize: 9, color: 'white' }}>{letter}</Text>
            </View>
        );
    }
}

ReadReceipt.propTypes = {
    username: React.PropTypes.string
};