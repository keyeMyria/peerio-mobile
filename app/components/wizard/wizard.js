import React, { Component } from 'react';
import {
    View, LayoutAnimation, Dimensions
} from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';

const { width } = Dimensions.get('window');

@observer
export default class Wizard extends Component {
    /**
     * Animation sequence (start with index 0)
     * 1. new index becomes 1 (this.index === 1)
     * 2. view 0 slides out (this.index === 1, this.currentIndex === 1)
     * 3. view 1 appears (this.currentIndex === 1) to the left (because this.animatedIndex === 0)
     * 4. view 1 slides in (this.animatedIndex === 1)
     */
    @observable _index = 0;
    @observable currentIndex = 0;
    @observable animatedIndex = 0;
    @observable pages = [];
    direction = 1;

    get index() { return this._index; }
    set index(i) { this._index = i; }

    constructor(props) {
        super(props);
        reaction(() => this.index, i => {
            setTimeout(() => {
                LayoutAnimation.easeInEaseOut();
                this.animatedIndex = i;
            }, 200);
            setTimeout(() => {
                this.currentIndex = i;
            }, 100);
            this.direction = (i >= this.currentIndex) ? 1 : -1;
            LayoutAnimation.easeInEaseOut();
        });
    }

    _animatedContainer(key, item, index) {
        const currentView = index === this.currentIndex;
        const normalizedWidth = this.direction * width;
        const shiftNew = index !== this.animatedIndex ? normalizedWidth : 0;
        const shift = index !== this.index ? -normalizedWidth : shiftNew;
        const animation = { left: shift };
        const container = { flexGrow: 1 };
        return item && currentView && (
            <View key={key} style={[container, animation]}>
                {item}
            </View>
        );
    }

    wizard() {
        return this.pages.map((k, i) => this._animatedContainer(k, this[k](), i));
    }

    footerContainer() {
        const footerBody = this.footer();
        return footerBody && (
            <View style={{ marginHorizontal: -40 }}>
                {footerBody}
            </View>
        );
    }
}