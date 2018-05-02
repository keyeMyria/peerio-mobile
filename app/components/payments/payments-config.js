import { observable } from 'mobx';
import paymentsNative from '../payments/payments-native';
import { User } from '../../lib/icebear';
import { tx } from '../utils/translator';
import whitelabel from '../../lib/whitelabel-config';

const basicPlanInfo =
`Secure Messaging
Portability across devices
Secure File Storage & Sharing
1 GB of secure Peerio Vault storage
500M max upload file size`;

const professionalIncludesInfo =
`Includes all features of Basic plan`;

const professionalPlanInfo =
`500 GB of secure storage
Unlimited upload file size
Premium support
`;

const professionalPaymentInfo =
`
Monthly plans will be charged $12.99 USD each month.

Annual plans will be charged $118.99 USD each year.

These prices may vary according to your location and local currency.

Your subscription will renew automatically at the end of each billing period unless you disable auto-renew at least 24-hours before the end of your current billing period. If your subscription is renewed, your account will be charged for renewal within 24-hours prior to the end of the current period.
`;

const { professionalYearlyID, professionalMonthlyID }
    = paymentsNative;

const serverPlans = [
    'icebear_premium_monthly',
    'icebear_premium_yearly',
    'icebear_pro_monthly',
    'icebear_pro_yearly'
];

function getActivePlans() {
    return User.current ? User.current.activePlans : [];
}

class BasicPlan {
    title = 'title_basicPlan';
    price = 'title_free';
    info = basicPlanInfo;
    storage = '1 GB';
    uploadFileSize = '500 MB';
    canUpgradeTo = false;
    isFreePlan = true;

    get isCurrent() {
        return getActivePlans().filter(p => serverPlans.indexOf(p) !== -1).length === 0;
    }

    setDefaultSelected = () => {};
}

class PaidPlan {
    @observable selected;

    get intersectServer() {
        return this.priceOptions.filter(p => getActivePlans().indexOf(p.serverID) !== -1);
    }

    get isCurrent() {
        return !!this.intersectServer.length;
    }

    get canUpgradeTo() {
        return getActivePlans().filter(p => serverPlans.indexOf(p) !== -1).length === 0;
    }

    setDefaultSelected() {
        const activePlans = this.intersectServer;
        this.selected = activePlans.length ? activePlans[0].id : this.priceOptions[0].id;
    }
}

class ProfessionalPlan extends PaidPlan {
    title = tx('title_proPlan');
    storage = '500 GB';
    uploadFileSize = tx('title_unlimited');
    priceOptions = [{
        title: 'title_billedMonthly',
        id: professionalMonthlyID,
        serverID: 'icebear_pro_monthly',
        price: whitelabel.PRO_MONTHLY_PRICE || '$12.99 USD/month'
    }, {
        title: 'title_billedAnnually',
        id: professionalYearlyID,
        serverID: 'icebear_pro_yearly',
        price: whitelabel.PRO_YEARLY_PRICE || '$119.88 USD/year'
    }];
    includes = professionalIncludesInfo;
    info = professionalPlanInfo;
    paymentInfo = professionalPaymentInfo;
}

const plans = [new BasicPlan(), new ProfessionalPlan()];

plans.topPlan = function() {
    const p = plans.filter(s => s.isCurrent && !s.isFreePlan);
    return p.length ? p[p.length - 1] : null;
};

plans.topPlanIndex = function() {
    let result = -1;
    for (let i = 0; i < plans.length; ++i) {
        const s = plans[i];
        if (s.isCurrent && !s.isFreePlan) result = i;
    }
    return result;
};

plans.userHasPaidPlan = function() {
    return !!plans.topPlan();
};

export default plans;
