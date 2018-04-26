import React, { Component } from 'react';
import { ScrollView, Dimensions, LayoutAnimation, View } from 'react-native';
import { observer } from 'mobx-react/native';
import { observable, reaction } from 'mobx';
import { vars } from '../../styles/styles';
import AccountUpgradeNavigator from './account-upgrade-navigator';
import AccountUpgradePlan from './account-upgrade-plan';
import plans from '../payments/payments-config';
import icons from '../helpers/icons';
import routes from '../routes/routes';
import { User } from '../../lib/icebear';
import { t } from '../utils/translator';
import { popupYes } from '../shared/popups';

const { width } = Dimensions.get('window');

const card = {
    backgroundColor: vars.darkBlue,
    paddingTop: vars.spacing.large.midi2x
};

const container = { flex: 1, flexGrow: 1, backgroundColor: vars.darkBlue };

@observer
export default class AccountUpgradeSwiper extends Component {
    @observable selected = 0;

    componentWillMount() {
        reaction(() => this.selected, () => LayoutAnimation.easeInEaseOut());
        const topPlanIndex = plans.topPlanIndex();
        setTimeout(() => {
            topPlanIndex === -1 ?
                this._scrollView.scrollToEnd({ animated: false }) :
                this._scrollView.scrollTo({ x: topPlanIndex * width, animated: false });
        }, 0);
        if (User.current) {
            console.log('account-upgrade-swiper: active plans');
            User.current && console.log(User.current.activePlans);
            if (User.current.addresses.filter(e => e.confirmed).length === 0) {
                popupYes('', '', t('error_upgradingAccountNoConfirmedEmail')).then(() => routes.modal.discard());
            }
        }
    }

    jumpTo = (index, skipAnimated) => {
        this._scrollView.scrollTo({ x: index * width, y: 0, animated: !skipAnimated });
    };

    handleScroll = event => {
        const { x } = event.nativeEvent.contentOffset;
        this.selected = Math.round(x / width);
    };

    get exitRow() {
        const s = {
            position: 'absolute',
            top: vars.statusBarHeight + 12,
            right: 12
        };
        return (
            <View style={s} key="exitRow">
                {icons.white('close', () => routes.modal.discard(), { backgroundColor: 'transparent' })}
            </View>
        );
    }

    render() {
        return (
            <View style={container}>
                <ScrollView
                    scrollEventThrottle={0}
                    showsHorizontalScrollIndicator={false}
                    ref={sv => { this._scrollView = sv; }}
                    onScroll={this.handleScroll}
                    key="scroll" horizontal pagingEnabled removeClippedSubviews={false}>
                    <AccountUpgradePlan
                        style={card}
                        plan={plans[0]} />
                    <AccountUpgradePlan
                        style={card}
                        plan={plans[1]} />
                </ScrollView>
                {this.exitRow}
                <AccountUpgradeNavigator key="navigator" selected={this.selected} onJumpTo={this.jumpTo} />
            </View>);
    }
}
