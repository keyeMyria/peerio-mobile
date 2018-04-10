import vars from './vars';

function create(size, style) {
    return [{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: vars.txtLight
    }, style];
}

const smallCircle = {
    width: vars.circle,
    height: vars.circle,
    borderRadius: vars.circle / 2,
    marginLeft: vars.circle,
    marginRight: vars.circle,
    backgroundColor: vars.peerioBlue,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)'
};

export default {
    container: {
        height: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    small: {
        base: smallCircle,
        normal: smallCircle,
        active: [smallCircle, {
            backgroundColor: vars.highlight
        }]
    },
    create
};
