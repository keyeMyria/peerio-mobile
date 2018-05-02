import { Alert } from 'react-native';
import InAppBilling from 'react-native-billing';
import PaymentsBase from './payments-base';
import { socket } from '../../lib/icebear';
import whitelabel from '../../lib/whitelabel-config';

class PaymentsAndroid extends PaymentsBase {
    premiumYearlyID = 'com.peerio.app.messenger.premium.20.yearly';
    premiumMonthlyID = 'com.peerio.app.messenger.premium.20.monthly';
    professionalYearlyID = whitelabel.PRO_YEARLY_PLAN || 'com.peerio.app.messenger.professional.500.yearly';
    professionalMonthlyID = whitelabel.PRO_MONTHLY_PLAN || 'com.peerio.app.messenger.professional.500.monthly';

    async purchaseProduct(productId) {
        let result = {};
        await InAppBilling.close();
        try {
            await InAppBilling.open();
            if (!await InAppBilling.isSubscribed(productId)) {
                result = await InAppBilling.subscribe(productId);
                console.log('payments-android.js: you purchased: ', result);
            }
            const transactionStatus = await InAppBilling.getSubscriptionTransactionDetails(productId);
            console.log('payments-android.js: transaction status', transactionStatus);
            result = transactionStatus;
            const productDetails = await InAppBilling.getSubscriptionDetails(productId);
            console.log(productDetails);
        } catch (err) {
            console.log(err);
            Alert.alert(`Purchase is unsuccessful`, `${productId}, please contact support`);
        } finally {
            await InAppBilling.close();
        }
        return result;
    }

    async purchase(id) {
        this.inProgress = true;
        try {
            const { receiptSignature, receiptData, purchaseToken } = await this.purchaseProduct(id);
            if (!receiptSignature) throw new Error('payments-android.js: receiptSignature is empty');
            if (!receiptData) throw new Error('payments-android.js: receiptData is empty');
            if (!purchaseToken) throw new Error('payments-android.js: purchaseToken is empty');
            const payload = {
                store: 'google',
                receipt: {
                    type: 'android-playstore',
                    purchaseToken,
                    receipt: receiptData,
                    signature: receiptSignature
                }
            };
            console.log(JSON.stringify(payload));
            const serverResponse = await socket.send('/auth/paid-plans/mobile-purchase/register', payload);
            console.log(serverResponse);
            console.log(`🚲 payments-android.js: register result success ${id}`);
        } catch (e) {
            console.log('🚲 payments-android.js: error registering');
            Alert.alert(`Purchase is unsuccessful`, `${id}, please contact support`);
            console.error(e);
        }
        this.inProgress = false;
    }

    test() {
        this.purchase('com.peerio.storage.50.monthly');
    }
}

export default PaymentsAndroid;
