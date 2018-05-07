import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { View, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import { observer } from 'mobx-react/native';
import Text from '../controls/custom-text';
import AccountUpgradeToggle from './account-upgrade-toggle';
import PaymentsInfoPopup from '../payments/payments-info-popup';
import payments from '../payments/payments';
import { vars } from '../../styles/styles';
import { popupControl } from '../shared/popups';
import { tx } from '../utils/translator';

const { width } = Dimensions.get('window');

const topTitleText = {
    fontSize: vars.accountTitleFontSize,
    color: 'white'
};

const smallText = {
    fontSize: vars.font.size.normal,
    opacity: 0.7,
    color: 'white',
    marginLeft: vars.spacing.small.midi2x
};

const featureListText = [topTitleText, {
}];

const featureListTextMedium = [featureListText, {
    fontSize: vars.accountListFontSize
}];

const planFooterInfo = [featureListTextMedium, {
    textAlign: 'center'
}];

const featureSmallText = {
    color: 'white',
    fontSize: vars.font.size.normal
};

const block0 = {
    paddingHorizontal: vars.spacing.medium.maxi2x
};

const block1 = [block0, {
    marginBottom: vars.spacing.medium.maxi2x
}];

const textRow = {
    flexDirection: 'row',
    alignItems: 'center'
};

const borderView = {
    borderColor: '#FFFFFFAA',
    borderBottomWidth: 1,
    paddingBottom: vars.spacing.medium.maxi2x,
    paddingHorizontal: vars.spacing.small.maxi2x,
    marginHorizontal: vars.spacing.small.maxi2x,
    marginBottom: vars.spacing.medium.maxi2x
};

@observer
export default class AccountUpgradePlan extends Component {
    largeSmallTextRow(largeTextString, smallTextString) {
        return (
            <View style={textRow}>
                <Text style={featureListText}>
                    {largeTextString}
                </Text>
                <Text style={smallText}>
                    {smallTextString}
                </Text>
            </View>
        );
    }

    mediumSmallTextRow(largeTextString, smallTextString) {
        return (
            <View style={textRow}>
                <Text style={featureListTextMedium}>
                    {largeTextString}
                </Text>
                <Text style={smallText}>
                    {smallTextString}
                </Text>
            </View>
        );
    }

    featureText(text) {
        return (
            <View style={{ marginBottom: vars.spacing.small.maxi }} key={text}>
                <Text bold style={featureSmallText}>{text}</Text>
            </View>
        );
    }

    get alwaysFree() {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'center', flexGrow: 1, height: 100 }}>
                <Text style={featureListTextMedium}>{tx('title_alwaysFree')}</Text>
            </View>
        );
    }

    get priceOptions() {
        const { priceOptions, canUpgradeTo, isCurrent, paymentInfo } = this.props.plan;
        // if (!priceOptions) return this.alwaysFree;
        if (isCurrent) return <Text style={planFooterInfo}>{tx('title_yourCurrentPlan')}</Text>;
        if (!canUpgradeTo) return <Text style={planFooterInfo}>{tx('title_cannotUpgradePlan')}</Text>;
        return (
            <View style={{ flexDirection: 'row' }}>
                {priceOptions.map(({ title, price, id }, i) => (
                    <AccountUpgradeToggle
                        key={i}
                        onPress={async () => {
                            await popupControl(<PaymentsInfoPopup text={paymentInfo} />, 'button_upgrade');
                            payments.purchase(id);
                        }}
                        text1={price}
                        text2={tx(title).toLowerCase()}
                        left={i === 0}
                        highlight={i > 0} />
                ))}
            </View>
        );
    }

    get footer() {
        return payments.inProgress ? <ActivityIndicator color="white" style={{ marginBottom: vars.spacing.large.mini2x }} /> : this.priceOptions;
    }

    render() {
        const { title, includes, info, storage } = this.props.plan;
        return (
            <View style={{ width, flexDirection: 'column', flexGrow: 1, flex: 1, justifyContent: 'space-between' }}>
                <ScrollView>
                    <View style={block1}>
                        <Text style={topTitleText}>
                            {tx('title_appName')} <Text bold>{tx(title)}</Text>
                        </Text>
                    </View>
                    <View style={borderView}>
                        {this.largeSmallTextRow(storage, tx('title_encryptedStorage'))}
                    </View>
                    <View style={block1}>
                        {includes && this.featureText(includes)}
                        {info.split('\n').map(this.featureText)}
                    </View>
                </ScrollView>
                <View style={block1}>
                    {this.footer}
                </View>
            </View>
        );
    }
}

AccountUpgradePlan.propTypes = {
    plan: PropTypes.any
};
