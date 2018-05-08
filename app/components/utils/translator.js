import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { t, has } from 'peerio-translator';
import { reaction } from 'mobx';
import Text from '../controls/custom-text';
import uiState from '../layout/ui-state';

class T extends Component {
    componentDidMount() {
        this.localeUpdateReaction = reaction(() => uiState.locale, () => {
            // console.log('update reaction');
            this.forceUpdate();
        });
    }

    componentWillUnmount() {
        // console.log('umount');
        this.localeUpdateReaction && this.localeUpdateReaction();
    }

    render() {
        let name = `${this.props.k}_mobile`;
        name = has(name) ? name : this.props.k;

        let translated = t(name, this.props.children);
        if (Array.isArray(translated)) {
            return (
                <Text>
                    {translated.map((o, i) => <Text key={i}>{o}</Text>)}
                </Text>
            );
        }
        if (this.props.uppercase) {
            translated = translated.toUpperCase();
        }
        return <Text>{translated}</Text>;
    }
}

T.propTypes = {
    children: PropTypes.any,
    k: PropTypes.string,
    uppercase: PropTypes.bool
};

module.exports = {
    T,
    t(k, params) {
        const r = t(k, params);
        if (r instanceof String || typeof r === 'string') return r;
        return React.createElement(T, { k }, params);
    },
    tu(k, params) {
        const r = t(k, params);
        if (r.toUpperCase) return r.toUpperCase();
        return React.createElement(T, { k, uppercase: true }, params);
    },
    tx: (k, params) => t(k, params)
};
