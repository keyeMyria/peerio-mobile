import React, { Component } from 'react';
import { observer } from 'mobx-react/native';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import uiState from '../layout/ui-state';
import testLabel from './test-label';

let currentScrollView = null;
let currentScrollPosition = 0;

/**
 * Scroll helper is used to provide scrolling capability
 * to the test script. Note that it overrides ref and onScroll
 * event handlers
 */
const scrollHelper = {
    ref: ref => {
        currentScrollPosition = 0;
        currentScrollView = ref;
    },
    onScroll: e => {
        currentScrollPosition = e.nativeEvent.contentOffset.y;
    }
};

export { scrollHelper };

const { height } = Dimensions.get('window');

/**
 * Test helper displays a yellow helper block
 * rendered only for DEV builds and used for
 * scrolling and hiding keyboard
 */
@observer
export default class TestHelper extends Component {
    scrollEnd = () => {
        currentScrollView.scrollToEnd({ animated: false });
    };

    scrollHome = () => {
        currentScrollView.scrollTo({ y: 0, animated: false });
    };

    scrollUp = () => {
        const y = Math.max(0, currentScrollPosition - height / 2);
        currentScrollView.scrollTo({ y, animated: false });
    };

    scrollDown = () => {
        currentScrollView.scrollTo({ y: currentScrollPosition + height / 2, animated: false });
    };

    item(letter, id, action) {
        return (
            <TouchableOpacity
                {...testLabel(id)}
                onPress={action}>
                <Text style={{ color: 'black' }}>{letter}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        if (!__DEV__) return null;
        const s = {
            position: 'absolute',
            left: 0,
            top: 100,
            backgroundColor: 'yellow',
            alignItems: 'center'
        };
        return (
            <View key="testHelper" style={s}>
                {this.item('⍟', 'hideKeyboard', uiState.hideAll)}
                {this.item('↑', 'homeScroll', this.scrollHome)}
                {this.item('▲', 'upScroll', this.scrollUp)}
                {this.item('▼', 'downScroll', this.scrollDown)}
                {this.item('↓', 'endScroll', this.scrollEnd)}
                {this.item('1', 'testAction1', () => uiState.testAction1())}
                {this.item('2', 'testAction2', () => uiState.testAction2())}
                {this.item('3', 'testAction2', () => uiState.testAction3())}
            </View>
        );
    }
}
