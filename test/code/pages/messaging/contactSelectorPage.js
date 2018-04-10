const Page = require('../page');

class ContactSelectorPage extends Page {
    get recipientContact() {
        return this.getElementInContainer('~foundContacts', `~${process.env.CHAT_RECIPIENT_USER}`);
    }

    get textInput() {
        return this.getWhenVisible('~textInputContactSearch');
    }

    get firstContact() {
        return this.getElementInContainer('~0', `~${process.env.CHAT_RECIPIENT_USER}`);
    }

    get notFirstContact() {
        return this.checkElementInContainer('~0', `~${process.env.CHAT_RECIPIENT_USER}`);
    }

    get closeButton() {
        return this.getWhenVisible('~closeButton');
    }
}

module.exports = ContactSelectorPage;
