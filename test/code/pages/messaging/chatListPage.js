const Page = require('../page');

class ChatListPage extends Page {
    get buttonCreateNewChat() {
        return this.getWhenVisible('~buttonCreateNewChat');
    }

    roomWithTitle(selector) {
        return this.getWhenVisible(`~${selector}`);
    }

    roomWithTitleVisible(selector) {
        return this.checkIfVisible(`~${selector}`);
    }

    roomWithTitleExists(selector) {
        return this.checkIfPresent(`~${selector}`, 25000);
    }
}

module.exports = ChatListPage;
