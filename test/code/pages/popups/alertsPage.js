const Page = require('../page');

class AlertsPage extends Page {
    async dismissNotificationsAlert() {
        try {
            if (await this.app.alertText()) {
                await this.app.alertAccept();
            }
        } catch (e) {
            // No push alert present
        }
    }

    get emailConfirmationPopup() {
        return this.getWhenVisible('~popupButton-ok');
    }
}

module.exports = AlertsPage;
