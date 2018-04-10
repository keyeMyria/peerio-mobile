import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { Text, View, TouchableOpacity, SectionList } from 'react-native';
import { reaction } from 'mobx';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import SafeComponent from '../shared/safe-component';
import chatState from '../messaging/chat-state';
import ChatInfoSectionHeader from '../messaging/chat-info-section-header';
import Avatar from '../shared/avatar';
import icons from '../helpers/icons';
import { tx } from '../utils/translator';
import { vars } from '../../styles/styles';
import { User } from '../../lib/icebear';
import testLabel from '../helpers/test-label';

@observer
export default class MemberList extends SafeComponent {
    dataSource = [];
    channelMembers = [];
    channelInvites = [];

    get data() { return chatState.currentChat; }

    get hasData() { return !!this.channelMembers || !!this.channelInvites; }

    get hasChannelMembers() { return this.channelMembers.length; }

    get hasChannelInvites() { return this.channelInvites.length; }

    componentWillUnmount() {
        this.reaction && this.reaction();
        this.reaction = null;
    }

    componentDidMount() {
        this.reaction = reaction(() => [
            this.data,
            this.data.length
        ], () => {
            const channel = this.data;
            this.channelMembers = channel.allJoinedParticipants || [];
            this.channelInvites = chatState.chatInviteStore.sent.get(channel.id) || [];
            this.dataSource = [
                { data: this.channelMembers, key: tx('title_Members') },
                { data: this.channelInvites, key: tx('title_invited') }
            ];
            this.forceUpdate();
        }, true);
    }

    headers = ({ section: { key } }) => {
        let hidden = false;
        let toggleCollapsed = null;
        if (key === tx('title_Members')) {
            toggleCollapsed = this.props.toggleCollapsed;
            hidden = !this.hasChannelMembers;
        } else if (key === tx('title_invited')) {
            toggleCollapsed = null;
            hidden = this.props.collapsed || !this.hasChannelInvites;
        }
        return (<ChatInfoSectionHeader
            key={key}
            title={key}
            collapsed={this.props.collapsed}
            toggleCollapsed={toggleCollapsed}
            hidden={hidden}
        />);
    };

    participant = ({ item }) => {
        if (chatState.collapseFirstChannelInfoList) return null;
        const contact = item; // readability
        const channel = this.data;
        const { username } = contact;
        const row = {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexGrow: 1
        };
        const adminTextStyle = {
            color: vars.subtleText,
            fontSize: vars.font.size.smallerx,
            fontWeight: vars.font.weight.semiBold
        };
        const isAdmin = channel.isAdmin(contact);
        const isCurrentUser = contact.username === User.current.username;
        return (
            <View
                key={contact.username}
                style={row}
                {...testLabel(`${contact.username}-memberList`)}>
                <View style={{ flex: 1, flexGrow: 1 }}>
                    <Avatar
                        noBorderBottom
                        contact={contact}
                        key={username}
                        message=""
                        hideOnline
                        backgroundColor={vars.darkBlueBackground05} />
                </View>
                <View
                    {...testLabel('moreButton')}
                    style={{ flex: 0, flexDirection: 'row', alignItems: 'center' }}>
                    {isAdmin &&
                        <View style={{
                            backgroundColor: vars.adminBadgeColor,
                            borderRadius: 4,
                            padding: vars.spacing.small.mini2x,
                            overflow: 'hidden',
                            marginRight: isCurrentUser ? vars.spacing.huge.midi : vars.spacing.small.maxi2x
                        }}>
                            <Text style={adminTextStyle}>
                                {tx('title_admin')}
                            </Text>
                        </View>}
                    {channel.canIAdmin && !isCurrentUser && <Menu>
                        <MenuTrigger
                            renderTouchable={() => <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} />}
                            style={{ padding: vars.iconPadding }}>
                            {icons.plaindark('more-vert')}
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption
                                onSelect={() => (isAdmin ?
                                    channel.demoteAdmin(contact) :
                                    channel.promoteToAdmin(contact))}>
                                <Text>{isAdmin ?
                                    tx('button_demoteAdmin') : tx('button_makeAdmin')}
                                </Text>
                            </MenuOption>
                            <MenuOption
                                onSelect={() => channel.removeParticipant(contact)}>
                                <Text {...testLabel('Remove')}>{tx('button_remove')}</Text>
                            </MenuOption>
                        </MenuOptions>
                    </Menu>}
                </View>
            </View>
        );
    };


    renderThrow() {
        if (!this.hasData) return null;
        return (
            <SectionList
                sections={this.dataSource}
                keyExtractor={contact => contact.username}
                renderItem={this.participant}
                renderSectionHeader={this.headers}
                style={{ marginBottom: 8 }}
            />
        );
    }
}

MemberList.propTypes = {
    collapsed: PropTypes.bool,
    toggleCollapsed: PropTypes.func
};
