import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react/native';
import { reaction, observable } from 'mobx';
import { navigator } from '../../styles/styles';
import uiState from '../layout/ui-state';

@observer
export default class RouteNavigator extends Component {
    @observable route = null;

    componentDidMount() {
        const { routes } = this.props;
        this.bindRouteroutes = reaction(() => routes.route, route => {
            console.log(`route-navigator: ${routes.prevRoute}, ${route}`);
            routes.prevRoute = route;
            const rInfo = routes.routes[route];
            uiState.hideAll().then(() => {
                this.route = rInfo;
            });
        }, true);
    }

    renderScene(route) {
        return React.createElement(route.component, { key: `scene${route.key}` });
    }

    render() {
        const { route } = this;
        const hidden = { overflow: 'hidden' };
        const inner = route ?
            (<View
                testID={`route${route.key}Scene`}
                removeClippedSubviews={false}
                style={[navigator.card, hidden]}>
                {this.route ? this.renderScene(this.route) : null}
            </View>)
            : null;
        return (
            <View
                testID="navigatorContainer"
                style={{ flex: 1 }}>
                {inner}
            </View>
        );
    }
}

RouteNavigator.propTypes = {
    routes: PropTypes.any.isRequired
};
