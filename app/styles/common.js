import vars from './vars';

export default {
    fullAbsoluteContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent'
    },
    textInverse: {
        color: vars.txtLight
    },
    container: {
        root: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: vars.peerioBluebg
        },
        footer: {
        }
    }
};
