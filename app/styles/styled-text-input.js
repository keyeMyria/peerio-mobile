import vars from './vars';
import common from './common';

const outerStyle = {
    marginHorizontal: vars.inputMarginHorizontal,
    flex: 1,
    flexGrow: 1
};

const textinputStyle = {
    paddingHorizontal: vars.inputPaddingHorizontal,
    color: vars.black87,
    fontSize: vars.font.size.normal,
    // without input height text input is rendered zero-height on iOS
    height: vars.inputHeight,
    marginTop: vars.spacing.small.midi
};

const errorStyle = {
    fontSize: vars.font.size.smaller,
    color: vars.red,
    marginTop: vars.spacing.small.mini,
    marginBottom: vars.spacing.small.mini2x,
    height: vars.spacing.medium.midi
};

const inputContainer = [
    common.fullAbsoluteContainer,
    { flexDirection: 'row' }
];

const hintContainer = [inputContainer, { paddingLeft: vars.inputPaddingHorizontal }];
const hintStyle = {
    normal: {
        container: hintContainer,
        text: {
            color: vars.textBlack38,
            alignSelf: 'center',
            fontSize: vars.font.size.normal
        }
    },
    small: {
        container: [hintContainer, { top: -vars.inputHeight / 2 }],
        text: {
            color: vars.peerioBlue,
            alignSelf: 'center',
            fontSize: vars.font.size.small
        }
    }
};

const iconContainer = {
    flexGrow: 0,
    flexShrink: 1,
    alignSelf: 'flex-end',
    position: 'absolute',
    zIndex: 15
};

export default {
    outerStyle,
    textinputStyle,
    errorStyle,
    inputContainer,
    hintContainer,
    hintStyle,
    iconContainer
};
