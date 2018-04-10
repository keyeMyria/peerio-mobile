const Page = require('../page');

class ContactsPage extends Page {
    get contactVisible() {
        return this.checkIfVisible(`~${process.env.CHAT_RECIPIENT_USER}`);
    }

    get contactFound() {
        return this.getWhenVisible(`~${process.env.CHAT_RECIPIENT_USER}`);
    }

    get favoriteButton() {
        return this.getWhenVisible('~favoriteButton');
    }

    get backButton() {
        return this.getWhenVisible('~buttonChatBack');
    }

    get addContactButton() {
        return this.getWhenVisible('~addContactButton');
    }

    get searchContactInput() {
        return this.getWhenVisible('~contactSearchInput');
    }

    get searchContactButton() {
        return this.getWhenVisible('~button_add');
    }
}

module.exports = ContactsPage;
