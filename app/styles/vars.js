import { Platform, Dimensions } from 'react-native';

import branding from './branding';

const { width, height } = Dimensions.get('window');

function isIphoneX() {
    const { OS, isPad, isTVOS } = Platform;
    const dim = 812;
    return (
        OS === 'ios' && !isPad && !isTVOS && (width === dim || height === dim)
    );
}

const iPhoneStatusBar = (Platform.OS === 'ios' ? 20 : 0);
const iPhoneXTop = isIphoneX() ? 16 : 0;
const iPhoneXBottom = iPhoneXTop;

const isDeviceScreenBig = isBigScreenSize();
const isDeviceScreenSmall = !isDeviceScreenBig;

// Find a better way to determine if a device is considered 'big' or 'small'
function isBigScreenSize() {
    if (width >= 350 || height >= 600) return true;
    return false;
}

const { bg, bgGradient, tabsBg, tabsFg } = branding;

const statusBarHeight = (Platform.OS === 'android' ? 0 : 10) + iPhoneXTop;
const layoutPaddingTop = statusBarHeight * 2;

const r = 40;
const retentionOffset = { top: r, left: r, bottom: r, right: r };

const tabCellHeight = 56;

// pixel ratio should be factored into scaleDim somehow: const pixRatio = PixelRatio.get();
const defaultHeight = 667;
// scaleDim takes a size value and returns one that is adjusted to the height of the device as it compares to an iPhone 6
// const scaleDim = size => height / defaultHeight * size;
const scaleDim = size => size; // temporary making scaleDim do nothing

const vars = {
    circle: 10,
    circleSize: 4,
    bg,
    bgGradient,
    tabsBg,
    tabsFg,
    bgGreen: '#38CE86',
    bgHighlight: 'rgba(50, 176, 227, 0.38)',
    semiTransparentBg: 'rgba(44, 149, 207, 0.24)',
    yellowLine: '#f5e23e',
    disabled: '#00000020',
    highlight: '#FFFFFFCC',
    midlight: '#FFFFFF55',
    black: '#000',
    white: '#fff',
    whiteIcon: '#fff',
    notificationIcon: '#f00',
    usernameHighlight: '#32CEC3',
    darkIcon: '#00000070',
    txtLight: '#bfdfef',
    txtAlert: '#ff0000aa',
    txtLightGrey: '#7B7B7B',
    txtDark: 'rgba(28, 28, 28, 1)',
    txtMedium: 'rgba(98, 98, 98, 1)',
    txtDate: 'rgba(0, 0, 0, .38)',
    inputBg: '#fff',
    lightGrayBg: '#f0f0f0',
    mediumGrayBg: '#D0D0D0',
    sublteGrayOpacity: 0.54,
    pickerBg: 'rgba(255, 255, 255, .12)',
    pickerText: '#fff',
    subtleBg: '#c3dfee',
    black03: 'rgba(0, 0, 0, 0.03)',
    black12: 'rgba(0, 0, 0, 0.12)',
    subtleText: 'rgba(0, 0, 0, .54)',
    verySubtleGrey: 'rgba(0, 0, 0, .12)',
    extraSubtleText: 'rgba(0, 0, 0, .38)',
    subtleTextBold: 'rgba(0, 0, 0, .54)',
    lighterBlackText: 'rgba(0, 0, 0, .87)',
    inputBgInactive: 'rgba(255, 255, 255, .5)',
    inputBgInactiveText: 'rgba(0,0,0, .54)',
    checkboxInactive: 'rgba(0,0,0,.06)',
    checkboxIconInactive: 'rgba(0, 0, 0, .54)',
    checkboxIconActive: bg,
    snackbarBg: '#4a4a4a',
    snackbarBgGreen: '#38CE86',
    snackbarHeight: 48,
    popupMinHeight: scaleDim(110),
    settingsItemHeight: 56,
    settingsBg: 'rgba(0, 0, 0, 0.06)',
    headerBorderColor: 'rgba(0,0,0,.06)',
    gold: '#ffd700',
    fabEnabled: '#FF7D00',
    fabDisabled: '#CFCFCF',
    buttonGreen: '#2CCF84',
    footerMarginX: 24,
    statusBarHeight,
    layoutPaddingTop,
    headerHeight: 56 + iPhoneStatusBar + iPhoneXTop,
    headerSpacing: 56 + layoutPaddingTop,
    iconSize: 24,
    iconSizeSmall: 16,
    iconSizeMedium: 32,
    iconSizeLarge: 48,
    iconSizeLarge2x: 56,
    iconSizeHuge: 64,
    iconFileViewSize: 72,
    iconPadding: 12,
    iconPaddingLarge: 16,
    iconSizeBigger: 25,
    iconMargin: 30,
    imagePreviewSize: 48,
    chatListItemHeight: 48,
    contactListHeaderHeight: 48,
    roundedButtonWidth: 134,
    menuWidthRatio: 0.8,
    animationDuration: 200,
    progressBarHeight: 4,
    listItemHeight: 56,
    listViewPaddingVertical: 36,
    listViewPaddingHorizontal: 8,
    actionSheetOptionHeight: 56,
    actionSheetFontColor: '#0076FF',
    desctructiveButtonFontColor: '#D0021B',
    actionSheetButtonColor: 'rgba(252, 252, 252, .8)',
    pinnedChatIconSize: 18,
    pinnedChatPaddingHorizontal: 2,
    fileInnerItemPaddingRight: 8,
    loadingScreenMarginBottom: scaleDim(170),
    loadingScreenMarginTop: scaleDim(206),
    chatZeroStateImageWidth: scaleDim(327),
    chatZeroStateImageHeight: scaleDim(125),
    modalPaddingVertical: 40,
    modalPaddingHorizontal: 40,
    wizardPadding: 36,
    height80: height * 0.8,

    font: {
        size: {
            xsmall: scaleDim(8),
            normal: scaleDim(14),
            smaller: scaleDim(12),
            smallerx: scaleDim(11),
            small: scaleDim(10),
            big: scaleDim(18),
            bigger: scaleDim(16),
            huge: scaleDim(20),
            massive: scaleDim(24)
        },
        weight: {
            bold: '700',
            semiBold: '600',
            regular: '400'
        }
    },
    accountTitleFontSize: scaleDim(37),
    accountListFontSize: scaleDim(21),
    signupFontSize: scaleDim(36),
    profileEditFontSize: scaleDim(60),
    readReceiptFontSize: scaleDim(9),
    fontTitleSize: 16,
    largeInputWidth: 240,
    inputHeight: 48,
    searchInputHeight: 32,
    inputPaddingLeft: 10,
    inputPaddedHeight: 56,
    inputHeightLarge: 68,
    fabSize: 60,
    fabRight: 16,
    fabBottom: 32,
    retentionOffset,
    iPhoneXBottom,
    iPhoneXTop,
    tabCellHeight,
    tabsHeight: tabCellHeight + iPhoneXBottom,
    spacing: {
        small: {
            mini: scaleDim(2),
            mini2x: scaleDim(4),
            midi: scaleDim(6),
            midi2x: scaleDim(8),
            maxi: scaleDim(10),
            maxi2x: scaleDim(12)
        },
        medium: {
            mini: scaleDim(14),
            mini2x: scaleDim(16),
            midi: scaleDim(18),
            midi2x: scaleDim(20),
            maxi: scaleDim(22),
            maxi2x: scaleDim(24)
        },
        large: {
            mini: scaleDim(25),
            minix: scaleDim(28),
            mini2x: scaleDim(30),
            midi: scaleDim(32),
            midixx: scaleDim(34),
            midi2x: scaleDim(36),
            maxi: scaleDim(40),
            maxi2x: scaleDim(48)
        },
        huge: {
            mini: scaleDim(50),
            minixx: scaleDim(54),
            mini2x: scaleDim(56),
            midi: scaleDim(60),
            midi2x: scaleDim(64),
            midi3x: scaleDim(68),
            maxi: scaleDim(74),
            maxi2x: scaleDim(75)
        }
    },
    loadingTimeout: 15000,
    isDeviceScreenBig,
    isDeviceScreenSmall,
    fileType: {
        smaller: 24,
        small: 32,
        medium: 48,
        large: 72
    }
};

vars.iconLayoutSize = vars.iconSize + vars.iconPadding * 2;

vars.optimizeImageSize = (sourceWidth, sourceHeight, containerWidth, containerHeight) => {
    let w = sourceWidth + 0.0, h = sourceHeight + 0.0;
    if (w > containerWidth) {
        h *= containerWidth / w;
        w = containerWidth;
    }
    if (h > containerHeight) {
        w *= containerHeight / h;
        h = containerHeight;
    }
    return {
        width: Math.floor(w),
        height: Math.floor(h)
    };
};

export default vars;
