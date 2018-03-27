const Page = require('../page');

class ChatPage extends Page {
    get textInput() {
        return this.getWhenVisible(`~textInputMessage`);
    }

    get buttonSendMessage() {
        return this.getWhenVisible('~buttonSendMessage');
    }

    get buttonUploadToChat() {
        return this.getWhenVisible('~buttonUploadToChat');
    }

    get buttonExitChat() {
        return this.getWhenVisible('~buttonChatBack');
    }

    get addMembersButton() {
        return this.getWhenVisible('~Add members');
    }

    get invitedContactMore() {
        return this.getElementInContainer('~test_recipient-memberList', '~moreButton');
    }

    get removeInvitedButton() {
        return this.getWhenVisible('~Remove');
    }

    get leaveRoomButton() {
        return this.getWhenVisible('~Leave Room');
    }

    get confirmLeaveRoomButton() {
        return this.getWhenVisible('~popupButton-confirm');
    }

    get invitedContactRemoved() {
        return this.app.waitForVisible('~test_recipient-memberList', 5000, true);
    }

    roomWithTitle(selector) {
        return this.getWhenVisible(`~${selector}`);
    }
}

module.exports = ChatPage;
