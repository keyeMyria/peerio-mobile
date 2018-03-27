const Page = require('../page');

class HomePage extends Page {
    get welcomeMessage() {
        return this.getWhenVisible('~title_startSecureChat');
    }

    get filesTab() {
        return this.getWhenVisible('~folder');
    }

    get isVisible() {
        return this.app.waitForVisible('~forum');
    }

    get settingsTab() {
        return this.getWhenVisible('~settings');
    }
}

module.exports = HomePage;
