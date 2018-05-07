import vars from './vars';
import common from './common';

const { textInverse } = common;

export default {
    containerNoPadding: {
        paddingTop: 0,
        borderColor: 'red',
        borderWidth: 0,
        backgroundColor: 'transparent'
    },
    container: {
        padding: 50,
        paddingTop: 0,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    containerFlex: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    containerFlexGrow: {
        flexGrow: 1,
        padding: 50,
        paddingTop: 0,
        paddingBottom: 0,
        borderColor: 'violet',
        borderWidth: 0,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    textSubTitle: {
        color: vars.txtLight,
        fontSize: 22,
        marginTop: 12,
        marginBottom: 30
    },
    textInfo: {
    },
    text: {
        title: textInverse,
        subTitle: [textInverse, {
            fontSize: 24,
            marginTop: 12,
            marginBottom: 32
        }],
        info: [textInverse, {
            fontSize: 12
        }]
    },
    footer: {
        row: {
            height: 48,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingBottom: 20
        },
        button: {
            base: {
                height: 60,
                margin: 0,
                padding: 20
            },

            left: {},
            right: {},
            text: {
                color: 'white',
                backgroundColor: 'transparent'
            }
        }
    }
};
