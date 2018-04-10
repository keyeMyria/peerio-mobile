import React, { Component } from 'react';
import { SectionList, Text, View } from 'react-native';
import { observer } from 'mobx-react/native';
import Avatar from '../shared/avatar';
import ContactInviteItem from './contact-invite-item';
import testLabel from '../helpers/test-label';
import { vars } from '../../styles/styles';
import { tx } from '../utils/translator';

const INITIAL_LIST_SIZE = 10;

@observer
export default class ContactSelectorSectionList extends Component {
    keyExtractor(item) {
        return item.username || item.email;
    }

    item = (params) => {
        const { item } = params;
        const { username, fullName, isLegacy, isAdded, email } = item;
        if (!username) {
            return (
                <ContactInviteItem
                    noBorderBottom
                    contact={ContactInviteItem.fromEmail(email)} />
            );
        }
        return (
            <View {...testLabel(params.index.toString())}>
                <Avatar
                    noBorderBottom
                    starred={isAdded}
                    contact={item}
                    title={<Text style={{ fontWeight: 'normal' }}>{fullName || username}</Text>}
                    title2={isLegacy ? username : null}
                    height={vars.listItemHeight}
                    hideOnline
                    onPress={() => this.props.onPress(item)}
                    backgroundColor={vars.darkBlueBackground05} />
            </View>
        );
    };

    sectionHeader({ section: { data, key } }) {
        if (!data || !data.length || !key) return null;
        const s = { fontWeight: 'bold', margin: vars.spacing.small.maxi };
        return (
            <Text style={s}>
                {tx(key, { found: data && data.length })}
            </Text>
        );
    }

    render() {
        return (
            <SectionList
                {...testLabel('foundContacts')}
                accessible={false}
                initialNumToRender={INITIAL_LIST_SIZE}
                sections={this.props.dataSource}
                keyExtractor={this.keyExtractor}
                renderItem={this.item}
                renderSectionHeader={this.sectionHeader}
            />
        );
    }
}

