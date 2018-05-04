

import React, { Component } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable } from 'mobx';
import StyledTextInput from '../shared/styled-text-input';

const { width } = Dimensions.get('window');

@observer
export default class MockStyleTextInput extends Component {
    validation1 = async (value) => {
        const expression = '123';
        return value === expression;
    };

    validation2 = async (value) => {
        const expression = '123';
        return value === expression;
    };

    state1 = observable({ value: '' });
    state2 = observable({ value: '' });

    render() {
        return (
            <ScrollView
                keyboardShouldPersistTaps="handled"
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
                ref={sv => { this._scrollView = sv; }}
                key="scroll" horizontal pagingEnabled removeClippedSubviews={false}>
                <View style={{ marginTop: 150, width }}>
                    <StyledTextInput
                        state={this.state1}
                        errorText="Wrong pass (Hint: it might be 123)"
                        validation={this.validation1}
                        hint="This guy hides his secrets"
                        secureText
                    />
                    <StyledTextInput
                        state={this.state2}
                        errorText="Dirty until proven innocent (Try 123)"
                        validation={this.validation2}
                        hint="This guy is always dirty"
                        alwaysDirty
                    />
                </View>
            </ScrollView>
        );
    }
}
