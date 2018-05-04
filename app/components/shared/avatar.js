import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, Dimensions, LayoutAnimation, Linking } from 'react-native';
import { observable, reaction } from 'mobx';
import SafeComponent from '../shared/safe-component';
import icons from '../helpers/icons';
import { vars } from '../../styles/styles';
import FileInlineProgress from '../files/file-inline-progress';
import FileInlineImage from '../files/file-inline-image';
import AvatarCircle from './avatar-circle';
import ErrorCircle from './error-circle';
import DeletedCircle from './deleted-circle';
import OnlineCircle from './online-circle';
import ReadReceipt from './read-receipt';
import CorruptedMessage from './corrupted-message';
import tagify from './tagify';
import { User } from '../../lib/icebear';
import { tx } from '../utils/translator';
import testLabel from '../helpers/test-label';

const pinOn = require('../../assets/chat/icon-pin.png');

const itemStyle = {
    flex: 1,
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 0,
    borderColor: 'red'
};

const bottomBorderStyle = {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, .12)'
};

const itemContainerStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 0,
    paddingLeft: vars.spacing.medium.mini2x,
    paddingRight: vars.spacing.medium.mini2x
};

const nameContainerStyle = {
    borderWidth: 0,
    borderColor: 'yellow',
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
};

const nameMessageContainerStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    borderWidth: 0,
    borderColor: 'red',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: vars.spacing.medium.mini2x,
    marginRight: vars.spacing.small.midi,
    paddingTop: 0
};

const videoCallMsgStyle = {
    color: 'rgba(0,0,0,.38)'
};

const linkStyle = {
    color: '#2F80ED'
};

const nameTextStyle = {
    color: vars.txtMedium
};

const fullnameTextStyle = {
    color: vars.txtDark,
    fontSize: vars.font.size.normal
};

const usernameTextStyle = {
    color: vars.txtMedium,
    fontStyle: 'italic',
    fontSize: vars.font.size.normal,
    fontWeight: 'normal'
};

const dateTextStyle = {
    color: vars.txtDate,
    marginLeft: vars.spacing.small.midi2x
};

const lastMessageTextStyle = {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    fontWeight: vars.font.weight.regular,
    color: vars.txtMedium,
    fontSize: vars.font.size.normal,
    lineHeight: 22,
    borderWidth: 0,
    borderColor: 'green'
};

const systemMessageStyle = {
    fontStyle: 'italic'
};

const lastMessageWithIcon = {
    fontWeight: vars.font.weight.regular,
    color: vars.txtMedium,
    fontSize: vars.font.size.normal,
    lineHeight: 22,
    borderWidth: 0
};

const { width } = Dimensions.get('window');

@observer
export default class Avatar extends SafeComponent {
    @observable showError = false;

    componentDidMount() {
        this._observer = reaction(() => this.props.receipts && this.props.receipts.length,
            () => LayoutAnimation.easeInEaseOut());
    }

    componentWillUnmount() {
        this._observer();
    }

    get checked() {
        const cs = this.props.checkedState;
        const ck = this.props.checkedKey;
        return cs && ck && !!cs.has(ck);
    }

    get checkbox() {
        if (!this.props.checkbox) return null;
        const v = vars;
        const color = this.checked ? v.checkboxActive : v.checkboxInactive;
        const iconColor = this.checked ? 'white' : v.checkboxIconInactive;
        const iconBgColor = 'transparent';
        const icon = this.checked ? 'check-box' : 'check-box-outline-blank';
        const outer = {
            backgroundColor: color,
            height: this.props.height,
            width: this.props.height,
            alignItems: 'center',
            justifyContent: 'center'
        };
        return (
            <View style={outer} pointerEvents="none">
                {icons.colored(icon, null, iconColor, iconBgColor)}
            </View>
        );
    }

    onPressAll = () => {
        if (this.props.error) {
            this.showError = !this.showError;
            return null;
        }
        if (this.props.sendError && this.props.onRetryCancel) {
            return this.props.onRetryCancel();
        }
        return this.props.onPress && this.props.onPress();
    };

    get message() {
        const { ellipsize } = this.props;
        const ellipsizeMode = ellipsize ? 'tail' : undefined;
        const numberOfLines = ellipsize ? 1 : undefined;
        return this.props.message ? (
            <Text
                ellipsizeMode={ellipsizeMode}
                numberOfLines={numberOfLines}
                selectable
                style={lastMessageTextStyle}>
                {tagify(this.props.message || '', User.current.username)}
            </Text>
        ) : this.props.messageComponent;
    }

    get systemMessage() {
        const { systemMessage, videoCallMessage } = this.props;
        if (videoCallMessage) {
            const videoCallShort = videoCallMessage.replace(/(https:\/\/)/, '');
            return (
                <View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={[lastMessageWithIcon, videoCallMsgStyle]}>
                            {systemMessage}
                        </Text>
                    </View>
                    <TouchableOpacity onPress={() => Linking.openURL(videoCallMessage)}
                        pressRetentionOffset={vars.pressRetentionOffset}>
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            {icons.plaindark('videocam', vars.iconSizeSmall)}
                            <Text style={[linkStyle]}>
                                {videoCallShort}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
        return systemMessage && (
            <Text style={[lastMessageTextStyle, systemMessageStyle]}>
                {systemMessage}
            </Text>
        );
    }

    get files() {
        const { onInlineFileAction } = this.props;
        return this.props.files ?
            this.props.files.map(file =>
                <FileInlineProgress key={file} file={file} onAction={onInlineFileAction} />
            ) : null;
    }

    get inlineImage() {
        const { inlineImage, onInlineImageAction } = this.props;
        return inlineImage ?
            <FileInlineImage key={inlineImage} image={inlineImage} onAction={onInlineImageAction} /> : null;
    }

    get errorCircle() {
        return <ErrorCircle onPress={this.onPressAll} invert={!this.props.sendError} visible={this.props.error || this.props.sendError} />;
    }

    get corruptedMessage() {
        return <CorruptedMessage visible={this.props.error && this.showError} />;
    }

    get retryCancel() {
        const notSentMessageStyle = {
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginBottom: vars.spacing.small.midi2x
        };
        return this.props.sendError ?
            <View style={notSentMessageStyle}>
                <Text style={{ color: vars.txtAlert }}>{tx('error_messageSendFail')}</Text>
            </View> : null;
    }

    get fileUnavailable() {
        return this.props.hasDeletedFile ?
            <Text style={{ fontStyle: 'italic' }}>
                {tx('error_fileDeleted')}
            </Text> : null;
    }

    get date() {
        const unreadStyle = this.props.unread
            ? { color: vars.peerioBlue, fontWeight: '600' }
            : null;
        const { timestampText } = this.props;
        return timestampText ?
            <Text style={[dateTextStyle, unreadStyle]}>
                {timestampText}
            </Text> : null;
    }

    get errorStyle() {
        return this.props.error ? {
            backgroundColor: '#ff000020',
            borderRadius: 14,
            marginVertical: vars.spacing.small.mini,
            marginHorizontal: vars.spacing.small.mini2x
        } : null;
    }

    get borderStyle() {
        return this.props.noBorderBottom ? null : bottomBorderStyle;
    }

    get paddingStyle() {
        const paddingVertical = this.props.extraPaddingVertical;
        const paddingTop = this.props.extraPaddingTop;
        return (paddingVertical || paddingTop) ? { paddingVertical, paddingTop } : null;
    }

    get avatar() {
        if (this.props.hideAvatar) return null;
        const { height } = this.props;
        const style = height ? {
            alignSelf: 'center',
            justifyContent: 'center',
            borderColor: 'red',
            borderWidth: 0,
            height
        } : { alignSelf: 'flex-start' };
        return (
            <TouchableOpacity
                style={style}
                pressRetentionOffset={vars.retentionOffset}
                onPress={this.props.onPressAvatar || this.onPressAll}>
                <AvatarCircle contact={this.props.contact} loading={this.props.loading} invited={this.props.invited} />
                <DeletedCircle visible={this.props.isDeleted} />
            </TouchableOpacity>
        );
    }

    get pinned() {
        return this.props.pinned ?
            icons.iconPinnedChat(pinOn) : null;
    }

    get title() {
        const unreadStyle = this.props.unread
            ? { fontWeight: '600' }
            : null;
        const { contact, title, title2 } = this.props;
        return (
            <View style={nameContainerStyle}>
                <View style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text ellipsizeMode="tail" numberOfLines={title2 ? 2 : 1}>
                        <Text style={[nameTextStyle, unreadStyle]}>
                            {title ||
                                <Text>
                                    {contact ? contact.fullName : ''}
                                    <Text style={{ color: vars.txtMedium }}>
                                        {' '}{contact.username}
                                    </Text>
                                </Text>}
                        </Text>
                        {title2 ?
                            <Text style={lastMessageTextStyle}>{'\n'}{title2}</Text> : null}
                    </Text>
                </View>
                <View style={{ flex: 0 }}>
                    {this.date}
                </View>
            </View>
        );
    }

    get name() {
        const fullnameBoldStyle = this.props.fullnameIsBold ? { fontWeight: vars.font.weight.bold } : null;
        const unreadStyle = this.props.unread
            ? { fontWeight: vars.font.weight.seminBold }
            : null;
        const { contact, title } = this.props;
        const text = contact ? contact.username : title;
        return (
            <View style={nameContainerStyle}>
                <View style={{ flexShrink: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Text ellipsizeMode="tail" numberOfLines={1}>
                        <Text style={[fullnameTextStyle, unreadStyle, fullnameBoldStyle]}>
                            {contact ? contact.fullName : ''}
                            <Text style={[usernameTextStyle, unreadStyle]}>
                                {` `}{text}
                            </Text>
                        </Text>
                    </Text>
                </View>
                <View style={{ flex: 0 }}>
                    {this.date}
                </View>
            </View>
        );
    }

    get receipts() {
        const { receipts } = this.props;
        if (!receipts || !receipts.length) return null;
        const receiptRow = {
            alignSelf: 'flex-end',
            flexDirection: 'row',
            justifyContent: 'flex-end',
            borderWidth: 0,
            marginRight: vars.spacing.small.mini2x,
            width: width / 1.5
        };
        let marginLeft = (width / 1.5 - 26 * receipts.length) / receipts.length;
        marginLeft = marginLeft < 0 ? marginLeft : 0;
        return (
            <View style={receiptRow}>
                {receipts.map(r => (
                    <View key={r.username} style={{
                        flex: 0, marginLeft, alignItems: 'flex-end', borderWidth: 0
                    }}>
                        <ReadReceipt username={r.username} />
                    </View>
                ))}
            </View>
        );
    }

    get firstOfTheDay() {
        const { timestamp, firstOfTheDay } = this.props;
        if (!firstOfTheDay) return null;
        const ts = timestamp.toLocaleDateString();
        const separator = {
            flex: 1,
            flexGrow: 1,
            borderBottomWidth: 1,
            borderBottomColor: '#CFCFCF',
            height: 11
        };
        return (
            <View style={{ flex: 1, flexGrow: 1, flexDirection: 'row', justifyContent: 'flex-start', marginVertical: vars.spacing.small.midi2x }}>
                <View style={separator} />
                <Text style={{ flex: 0, color: vars.txtDark, marginHorizontal: vars.spacing.small.mini2x }}>
                    {ts === new Date().toLocaleDateString() ? tx('title_today') : ts}
                </Text>
                <View style={separator} />
            </View>
        );
    }

    renderCollapsed() {
        const { inlineImage, files } = this;
        const shrinkStrategy = { flexShrink: 1 };
        if (inlineImage || files) shrinkStrategy.flexGrow = 1;
        const backgroundColor = {
            backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : vars.white
        };
        return (
            <View style={{ flexGrow: 1 }}>
                <View style={[itemStyle, this.errorStyle, backgroundColor]}>
                    <View
                        pointerEvents={this.props.disableMessageTapping ? 'none' : undefined}
                        style={[this.itemContainerStyle, { paddingLeft: 68, marginRight: 22 }, shrinkStrategy]}>
                        <View style={{ flex: 1, flexGrow: 1 }}>
                            {this.corruptedMessage}
                            {files}
                            {inlineImage}
                            {this.message}
                            {this.systemMessage}
                            {this.retryCancel}
                            {this.fileUnavailable}
                        </View>
                    </View>
                    {this.errorCircle}
                </View>
                {this.receipts}
            </View>
        );
    }

    renderFull() {
        const backgroundColor = {
            backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : vars.white
        };
        return (
            <View style={[itemStyle, this.borderStyle, this.errorStyle, this.paddingStyle, backgroundColor]}>
                {this.checkbox}
                <View style={[{ flexGrow: 1, maxWidth: width, flexShrink: 1, borderWidth: 0 }]}>
                    <View
                        pointerEvents={this.props.disableMessageTapping ? 'none' : undefined}
                        style={itemContainerStyle}>
                        {this.pinned}
                        {this.avatar}
                        <View style={[nameMessageContainerStyle]}>
                            {this.props.isChat ? this.name : this.title}
                            {this.files}
                            {this.inlineImage}
                            {this.message}
                            {this.systemMessage}
                            {this.retryCancel}
                            {this.fileUnavailable}
                        </View>
                        {this.props.rightIcon}
                        <OnlineCircle visible={!this.props.hideOnline} online={this.props.online} />
                    </View>
                    {this.errorCircle}
                    {this.corruptedMessage}
                    {this.receipts}
                </View>
            </View>
        );
    }

    renderOuter(inner) {
        const opacity = this.props.sending ? 0.5 : 1;
        const activeOpacity = this.props.noTap && !this.props.error && !this.props.sendError ?
            1 : 0.2;
        const testID = this.props.contact ? this.props.contact.username : null; // May not cover all cases
        return (
            <View
                style={{ backgroundColor: vars.chatItemPressedBackground }}
                ref={ref => { this._ref = ref; }}>
                <TouchableOpacity
                    pressRetentionOffset={vars.retentionOffset}
                    onPress={this.onPressAll}
                    activeOpacity={activeOpacity}
                    style={{ backgroundColor: vars.white }}
                    onLayout={this.props.onLayout}
                    {...testLabel(testID)}>
                    {this.firstOfTheDay}
                    <View style={{ opacity }}>
                        {inner}
                    </View>
                </TouchableOpacity >
            </View>
        );
    }

    renderThrow() {
        const inner = this.props.collapsed ? this.renderCollapsed() : this.renderFull();
        return this.renderOuter(inner);
    }
}

Avatar.propTypes = {
    onPress: PropTypes.func,
    onPressAvatar: PropTypes.func,
    onRetryCancel: PropTypes.func,
    contact: PropTypes.any,
    timestamp: PropTypes.any,
    timestampText: PropTypes.any,
    files: PropTypes.any,
    receipts: PropTypes.any,
    rightIcon: PropTypes.any,
    message: PropTypes.string,
    messageComponent: PropTypes.any,
    hasDeletedFile: PropTypes.any,
    title: PropTypes.any,
    fullnameIsBold: PropTypes.any,
    isChat: PropTypes.any,
    systemMessage: PropTypes.any,
    firstOfTheDay: PropTypes.bool,
    online: PropTypes.bool,
    error: PropTypes.bool,
    loading: PropTypes.bool,
    showError: PropTypes.bool,
    checkbox: PropTypes.bool,
    checkedKey: PropTypes.string,
    checkedState: PropTypes.any,
    hideOnline: PropTypes.bool,
    noBorderBottom: PropTypes.bool,
    noTap: PropTypes.bool,
    collapsed: PropTypes.bool,
    sending: PropTypes.bool,
    sendError: PropTypes.bool,
    ellipsize: PropTypes.bool,
    unread: PropTypes.bool,
    pinned: PropTypes.bool,
    starred: PropTypes.bool,
    isDeleted: PropTypes.bool,
    disableMessageTapping: PropTypes.bool,
    extraPaddingVertical: PropTypes.number,
    extraPaddingTop: PropTypes.number,
    onLayout: PropTypes.func,
    backgroundColor: PropTypes.any
};
