import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { TextInput } from 'react-native';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import { vars } from '../../styles/styles';

export default class AutoExpandingTextInput extends Component {
    constructor(props) {
        super(props);
        // initial state
        this.state = {
            height: this.props.minHeight,
            maxHeight: this.props.maxHeight || this.props.minHeight * 3
        };
        this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
    }

    static propTypes = {
        onChangeHeight: PropTypes.func.isRequired,
        minHeight: PropTypes.number.isRequired,
        maxHeight: PropTypes.number
    };

    static defaultProps = {};

    componentWillReceiveProps(nextProps) {
        if (nextProps.value === '') {
            this.setState({
                height: this.props.minHeight
            });
        }
    }

    _onChange = (event) => {
        const curHeight = event.nativeEvent.contentSize.height;
        if (curHeight < this.props.minHeight || curHeight > this.state.maxHeight) return;

        if (this.state.height !== curHeight) {
            if (this.props.onChangeHeight) {
                this.props.onChangeHeight(this.state.height, curHeight);
            }
        }

        this.setState({
            height: curHeight
        });
    };

    render() {
        const tmpHeight = Math.min(this.state.maxHeight, this.state.height);

        const style = {
            textAlign: 'left',
            padding: 0,
            fontFamily: vars.peerioFontFamily
        };

        return (
            <TextInput
                {...this.props}
                ref={ti => { this.ti = ti; }}
                placeholderTextColor={vars.extraSubtleText}
                underlineColorAndroid="transparent"
                multiline
                onChange={this._onChange}
                style={[style, this.props.style, { height: tmpHeight }]}
            />
        );
    }
}

AutoExpandingTextInput.propTypes = {
    style: PropTypes.any,
    value: PropTypes.any
};
