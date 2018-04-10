import vars from './vars';
import common from './common';

const inputContainer = [common.fullAbsoluteContainer, {
    flexDirection: 'row'
}];

const alertInvisible = {
    borderBottomColor: 'transparent',
    borderBottomWidth: 2
};

const alertVisible = {
    borderBottomColor: vars.red,
    borderBottomWidth: 2
};

const textbox = {
    flexGrow: 1,
    marginLeft: vars.inputPaddingLeft,
    padding: 0,
    height: 28,
    color: vars.textBlack87,
    fontSize: vars.font.size.normal
};

const radius = {
    height: vars.inputHeight,
    overflow: 'hidden',
    borderRadius: 4,
    borderWidth: 1
};

const outerContainer = {
    marginBottom: 10,
    marginTop: 6
};

const hintContainer = [inputContainer, { paddingLeft: vars.inputPaddingLeft }];

export default {
    inputContainer,
    outerContainer,
    alertInvisible,
    alertVisible,
    focused: {
        outer: [{
            // ios shadow
            // shadowOpacity: 0.4,
            elevation: 10
        }],
        radius: [radius, {
            // android shadow
            // elevation: 10
        }],
        touchable: [inputContainer],
        textbox
    },
    blurred: {
        outer: [],
        radius,
        touchable: [inputContainer],
        textbox
    },
    hint: {
        normal: {
            container: hintContainer,
            text: {
                color: vars.black38,
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
    },
    iconContainer: {
        flexGrow: 0,
        flexShrink: 1,
        alignSelf: 'flex-end'
    }
};
