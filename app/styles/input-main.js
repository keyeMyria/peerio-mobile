import vars from './vars';

const sendIconStyleNormal = {
    alignItems: 'center',
    backgroundColor: vars.black12,
    borderRadius: vars.iconSizeSmall,
    justifyContent: 'center',
    height: vars.iconSizeSmall * 2,
    width: vars.iconSizeSmall * 2
};

export default {
    tiStyle: {
        color: vars.txtDark,
        fontSize: vars.font.size.normal
    },

    iconStyle: {
        width: vars.iconSizeSmall,
        height: vars.iconSizeSmall,
        margin: -vars.iconSizeSmall / 2
    },

    outerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    autoExpandingInputContainerStyle: {
        flex: 1,
        flexGrow: 1,
        alignItems: 'stretch',
        marginVertical: vars.iconSizeSmall / 2
    },

    sendIconStyleNormal,

    sendIconStyleActive: [sendIconStyleNormal, {
        backgroundColor: vars.peerioBlue
    }]
};
