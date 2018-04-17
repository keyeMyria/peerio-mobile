import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react/native';
import { observable, when, reaction, action } from 'mobx';
import { View, Image, Text, Dimensions, LayoutAnimation, TouchableOpacity, ActivityIndicator } from 'react-native';
import SafeComponent from '../shared/safe-component';
import Progress from '../shared/progress';
import FileProgress from './file-progress';
import FileInlineContainer from './file-inline-container';
import InlineUrlPreviewConsent from './inline-url-preview-consent';
import inlineImageCacheStore from './inline-image-cache-store';
import { vars } from '../../styles/styles';
import icons from '../helpers/icons';
import fileState from '../files/file-state';
import settingsState from '../settings/settings-state';
import { clientApp, config, util } from '../../lib/icebear';
import { T, tx } from '../utils/translator';

const toSettings = text => (
    <Text
        onPress={() => {
            settingsState.transition('preferences');
            settingsState.transition('display');
        }}
        style={{ textDecorationLine: 'underline' }}>
        {text}
    </Text>
);

const toSettingsParser = { toSettings };

const textMessageOuter = {
    padding: this.outerPadding,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center'
};

const textMessageTextStyle = {
    color: vars.txtDark,
    backgroundColor: 'transparent',
    textAlign: 'center'
};

@observer
export default class FileInlineImage extends SafeComponent {
    @observable cachedImage;
    @observable width = 0;
    @observable height = 0;
    @observable optimalContentWidth = 0;
    @observable optimalContentHeight = 0;
    @observable opened;
    @observable loaded;
    // image is a bit big but we still can display it manually
    @observable tooBig;
    // image is too big to be displayed
    @observable oversizeCutoff;
    // force loading image
    @observable loadImage;
    @observable showUpdateSettingsLink;
    // set this to true when we have network download problems
    @observable downloadSlow;
    // set this to true, when we have decoding problems
    @observable errorDisplayingImage;
    // TODO: fix icebear behaviour when it doesn't redownload cachingFailed images
    @observable cachingFailed = false;
    @observable loadedBytesCount = 0;
    @observable totalBytesCount = 0;
    outerPadding = 8;

    componentWillMount() {
        this.optimalContentHeight = Dimensions.get('window').height;
        when(() => this.cachedImage, () => this.fetchSize());
        const { image } = this.props;
        const { fileId, url, isOverInlineSizeLimit, isOversizeCutoff } = image;
        let { tmpCachePath, tmpCached } = image;
        this.tooBig = isOverInlineSizeLimit || isOversizeCutoff;
        this.oversizeCutoff = isOversizeCutoff;
        this.loadImage = fileState.forceShowMap.get(url || fileId);

        // if we uploaded the image ourselves and we have it cached
        // TODO: this should be moved to icebear
        const selfTmpCachePath = fileId && fileState.localFileMap.get(fileId);
        if (selfTmpCachePath) {
            this.loadImage = true;
            tmpCached = true;
            tmpCachePath = selfTmpCachePath;
        }

        when(() => image.cachingFailed, () => { this.cachingFailed = true; });
        if (fileId) {
            // we have local inline file
            when(() => clientApp.uiUserPrefs.peerioContentEnabled, () => { this.opened = true; });
            if (!this.loadImage) {
                when(() => clientApp.uiUserPrefs.peerioContentEnabled && !this.tooBig && !this.oversizeCutoff,
                    () => { this.loadImage = true; });
            }
            when(() => tmpCached || image.tmpCached, () => {
                this.cachedImage = inlineImageCacheStore.getImage(tmpCachePath);
            });
            if (!image.tmpCached) {
                when(() => this.loadImage, async () => {
                    // TODO: HACK FOR ANDROID
                    // should be replaced with FileStream update to handle content paths
                    if (tmpCachePath.startsWith('content:/')
                        || await config.FileStream.exists(tmpCachePath)) {
                        image.tmpCached = true;
                        return;
                    }
                    image.tryToCacheTemporarily(true);
                    this.handleLoadStart();
                });
            }
        } else {
            // we have external url
            when(() => clientApp.uiUserPrefs.externalContentConsented && clientApp.uiUserPrefs.externalContentEnabled,
                () => { this.loadImage = true; });
            this.opened =
                clientApp.uiUserPrefs.externalContentConsented && clientApp.uiUserPrefs.externalContentEnabled;
            when(() => this.loadImage, () => {
                this.cachedImage = inlineImageCacheStore.getImage(url);
                this.opened = true;
                this.handleLoadStart();
            });
        }
    }

    forceShow = () => {
        this.loadImage = true;
        const { url, fileId } = this.props.image;
        fileState.forceShowMap.set(url || fileId, true);
    };

    fetchSize() {
        const { cachedImage } = this;
        // if width or height is undefined, there was an error loading it
        when(() => cachedImage.width !== undefined && cachedImage.height !== undefined && this.optimalContentWidth, () => {
            const { width, height } = cachedImage;
            const { optimalContentWidth, optimalContentHeight } = this;
            if (width <= 0 && height <= 0) this.onErrorLoadingImage();
            Object.assign(this, vars.optimizeImageSize(width, height, optimalContentWidth, optimalContentHeight));
            // console.debug(`calculated width: ${this.width}, ${this.height}`);
        });
    }

    componentDidMount() {
        reaction(() => this.opened, () => LayoutAnimation.easeInEaseOut());
    }

    layout = (evt) => {
        this.optimalContentWidth = evt.nativeEvent.layout.width - this.outerPadding * 2 - 2;
    };

    get displayTooBigImageOffer() {
        const outer = {
            padding: this.outerPadding
        };
        const text0 = {
            color: vars.txtDark
        };
        const text = {
            color: vars.peerioBlue,
            fontStyle: 'italic',
            marginVertical: 10
        };
        return (
            <View style={outer}>
                <Text style={text0}>
                    {tx('title_imageSizeWarning', { size: util.formatBytes(config.chat.inlineImageSizeLimit) })}
                </Text>
                <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} onPress={this.forceShow}>
                    <Text style={text}>{tx('button_displayThisImageAfterWarning')}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    get displayCutOffImageOffer() {
        const outer = {
            padding: this.outerPadding
        };
        const text0 = {
            color: vars.txtDark
        };
        return (
            <View style={outer}>
                <Text style={text0}>
                    {tx('title_imageTooBigCutoff', { size: util.formatBytes(config.chat.inlineImageSizeLimitCutoff) })}
                </Text>
            </View>
        );
    }

    get displayPoorConnectionDownload() {
        const outer = {
            padding: this.outerPadding
        };
        const text0 = {
            color: vars.txtDark,
            backgroundColor: vars.lightGrayBg,
            paddingVertical: 54,
            textAlign: 'center'
        };
        return (
            <View style={outer}>
                <Text style={text0}>
                    {tx('title_poorConnectionInlineImage')}
                </Text>
            </View>
        );
    }

    get displayImageOffer() {
        const text = {
            color: vars.peerioBlue,
            fontStyle: 'italic',
            textAlign: 'center',
            marginVertical: 10
        };
        return (
            <TouchableOpacity pressRetentionOffset={vars.pressRetentionOffset} onPress={() => { this.loadImage = true; }}>
                <Text style={text}>{tx('button_displayThisImage')}</Text>
            </TouchableOpacity>
        );
    }

    get updateSettingsOffer() {
        const text = {
            color: vars.txtDate,
            fontStyle: 'italic',
            marginBottom: 4
        };
        return (
            <View style={{ flexDirection: 'row' }}>
                <View style={{ paddingTop: 2, marginRight: 4 }}>
                    {icons.coloredAsText('check-circle', vars.peerioTeal, 14)}
                </View>
                <Text style={text}>
                    <T k="title_updateSettingsAnyTime">{toSettingsParser}</T>
                </Text>
            </View>
        );
    }

    get downloadErrorMessage() {
        return (
            <View style={textMessageOuter}>
                <Text style={textMessageTextStyle}>
                    {tx('Image preview is not available')}
                </Text>
            </View>
        );
    }

    get downloadSlowMessage() {
        return (
            <View style={textMessageOuter}>
                <Text style={textMessageTextStyle}>
                    {tx('title_poorConnectionExternalURL')}
                </Text>
            </View>
        );
    }

    @action.bound handleLoadStart() {
        this.loadingTimeoutId = setTimeout(() => {
            if (!this.loaded) {
                this.downloadSlow = true;
            }
        }, vars.loadingTimeout);
    }

    @action.bound handleLoadEnd() {
        if (this.loadingTimeoutId) {
            clearTimeout(this.loadingTimeoutId);
            this.loadingTimeoutId = null;
        }
    }

    @action.bound handleProgress(e) {
        const { loaded, total } = e.nativeEvent;
        this.loadedBytesCount = loaded;
        this.totalBytesCount = total;
    }

    @action.bound onLoad() {
        this.loaded = true;
    }

    @action.bound onErrorLoadingImage() {
        this.errorDisplayingImage = true;
    }

    get displayErrorMessage() {
        const outer = {
            padding: this.outerPadding
        };
        const text0 = {
            color: vars.txtDark,
            backgroundColor: vars.lightGrayBg,
            paddingVertical: vars.spacing.large.midi2x,
            textAlign: 'center',
            paddingHorizontal: vars.spacing.small.maxi
        };
        return (
            <View style={outer}>
                <Text style={text0}>
                    {tx('error_loadingImage')}
                </Text>
            </View>
        );
    }

    /**
     * Opens the image if it cached, else attempts to cache it.
     * Checking if image is downloaded is not done since it is done as a pre-condition to this function.
     */
    @action.bound imageAction() {
        const { image } = this.props;
        if (image.tmpCached) {
            try {
                config.FileStream.launchViewer(image.tmpCachePath);
            } catch (e) {
                console.log(e);
            }
        } else image.tryToCacheTemporarily(true);
    }

    renderThrow() {
        const { image } = this.props;
        const { fileId, downloading } = image;
        const { width, height, loaded, showUpdateSettingsLink, cachingFailed } = this;
        const { source, acquiringSize } = this.cachedImage || {};
        const isLocal = !!fileId;
        if (!clientApp.uiUserPrefs.externalContentConsented && !isLocal) {
            return <InlineUrlPreviewConsent onChange={() => { this.showUpdateSettingsLink = true; }} />;
        }

        const inner = {
            backgroundColor: loaded ? vars.white : vars.lightGrayBg,
            minHeight: loaded ? undefined : 140,
            justifyContent: 'center'
        };
        return (
            <View>
                <FileInlineContainer
                    onLayout={this.layout}
                    file={image}
                    onAction={this.props.onAction}
                    isImage
                    isOpen={this.opened}
                    extraActionIcon={!downloading && icons.darkNoPadding(
                        this.opened ? 'arrow-drop-up' : 'arrow-drop-down',
                        () => { this.opened = !this.opened; },
                        { marginHorizontal: vars.spacing.small.midi2x }
                    )}>
                    {this.opened &&
                        <View style={inner}>
                            {!downloading && this.loadImage && width && height ?
                                <TouchableOpacity onPress={this.fileAction} >
                                    <Image
                                        onProgress={this.handleProgress}
                                        onLoadEnd={this.handleLoadEnd}
                                        onLoad={this.onLoad}
                                        onError={this.onErrorLoadingImage}
                                        source={{ uri: source.uri, width, height }}
                                        style={{ width, height }} />
                                </TouchableOpacity>
                                : null }
                            {!this.loadImage && !this.tooBig && this.displayImageOffer}
                            {!this.loadImage && this.tooBig && !this.oversizeCutoff && this.displayTooBigImageOffer}
                            {this.oversizeCutoff && this.displayCutOffImageOffer}
                            {!this.loaded && cachingFailed && this.downloadErrorMessage}
                            {!this.loaded && !cachingFailed && this.downloadSlow && this.downloadSlowMessage}
                            {this.errorDisplayingImage && this.displayErrorMessage}
                            {(acquiringSize || downloading)
                                && !this.downloadSlow
                                && !cachingFailed && <ActivityIndicator />}
                            {this.totalBytesCount > 0 && <Progress max={this.totalBytesCount} value={this.loadedBytesCount} />}
                        </View>}
                    {isLocal && <FileProgress file={image} />}
                </FileInlineContainer>
                {!isLocal && showUpdateSettingsLink && this.updateSettingsOffer}
            </View>
        );
    }
}

FileInlineImage.propTypes = {
    image: PropTypes.any,
    onAction: PropTypes.any
};
