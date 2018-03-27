const Page = require('../page');

class RoomInvitePage extends Page {
    get acceptButton() {
        return this.getWhenVisible('~accept');
    }

    get declineButton() {
        return this.getWhenVisible('~popupButton-decline');
    }
}

module.exports = RoomInvitePage;
