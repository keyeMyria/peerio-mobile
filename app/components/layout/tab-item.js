import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { observer } from 'mobx-react/native';
import { View, TouchableOpacity } from 'react-native';
import Text from '../controls/custom-text';
import SafeComponent from '../shared/safe-component';
import { vars } from '../../styles/styles';
import fileState from '../files/file-state';
import routerMain from '../routes/router-main';
import icons from '../helpers/icons';
import testLabel from '../helpers/test-label';
import uiState from './ui-state';

const actionCellStyle = {
    flex: 1,
    alignItems: 'center',
    height: vars.tabCellHeight,
    justifyContent: 'center'
};

const actionTextStyle = {
    color: vars.white
};

@observer
export default class TabItem extends SafeComponent {
    @action.bound onPressTabItem() {
        const { route } = this.props;
        if (routerMain.route === route) {
            if (routerMain.route === 'files') {
                fileState.goToRoot();
            }
            if (uiState.currentScrollView.scrollTo) {
                uiState.currentScrollView.scrollTo(0);
            } else {
                uiState.currentScrollView.scrollToLocation(
                    {
                        itemIndex: 0,
                        sectionIndex: 0,
                        viewOffset: vars.contactListHeaderHeight,
                        viewPosition: 0
                    });
            }
        } else {
            routerMain[route]();
        }
    }

    renderThrow() {
        const { text, route, icon, bubble } = this.props;
        const color = routerMain.route === route ? vars.peerioBlue : vars.tabsFg;
        const indicator = bubble ? (
            <View style={{ position: 'absolute', right: -5, top: 0 }}>
                {icons.bubble('')}
            </View>
        ) : null;
        return (
            <TouchableOpacity
                {...testLabel(icon)}
                onPress={this.onPressTabItem}
                pressRetentionOffset={vars.retentionOffset}
                style={actionCellStyle}>
                <View pointerEvents="none" style={{ alignItems: 'center' }}>
                    {icons.plain(icon, undefined, color)}
                    <Text style={[actionTextStyle, { color }]}>{text}</Text>
                    {indicator}
                </View>
            </TouchableOpacity>
        );
    }
}

TabItem.propTypes = {
    text: PropTypes.any,
    route: PropTypes.any,
    icon: PropTypes.any,
    bubble: PropTypes.any
};

