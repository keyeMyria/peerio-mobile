import React from 'react';
import Text from '../controls/custom-text';
import Bold from './bold';
import Italic from './italic';
import Link from './link';
import routes from '../routes/routes';

function a(text, url, style) {
    if (!url) {
        console.error(`tag-handlers.js: bad ${text} link`);
        return text;
    }
    if (url.startsWith('route:')) {
        const [, type, route] = url.split(':');
        const action = () => routes[type][route]();
        if (action) return <Link key={text} onPress={action} style={style}>{text}</Link>;
    }
    return <Link key={url} url={url} style={style}>{text}</Link>;
}

function b(text) {
    return <Bold key={text}>{text}</Bold>;
}

function i(text) {
    return <Italic key={text}>{text}</Italic>;
}

function br() {
    return <Text>{'\n'}</Text>;
}

module.exports = {
    a, b, i, br
};
