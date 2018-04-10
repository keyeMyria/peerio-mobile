const EN = process.env.EXECUTABLE_NAME || 'peeriomobile';
console.log(`Branding ${EN}`);

const brandingDefines = {
    name: EN,
    peeriomobile: {
        bg: '#2C95CF',
        bgGradient: '#32CEC3',
        logo: require('../assets/logo-with-tag.png'),
        darkBlue: '#040B40',
        darkTeal: '#004E69',
        peerioBlue: '#408CFF',
        peerioPurple: '#5461CC',
        peerioTeal: '#02CEDB',
        yellow: '#FDC700',
        red: '#E90162',
        tabsFg: '#757575'
    },
    expandoo: {
        bg: '#009dfd',
        bgGradient: '#009dfd',
        tabsBg: '#f7f7f7',
        tabsFg: '#757575',
        logo: require('../assets/expandoo-logo-white.png')
    }
};

const branding = brandingDefines[EN];
branding.name = EN;

export default branding;
