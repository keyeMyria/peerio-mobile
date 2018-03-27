const { defineSupportCode } = require('cucumber');
const chai = require('chai');

chai.should();

defineSupportCode(({ When, Then }) => {
    When('I invite someone to join the room', async function () {
        await this.scrollToChat();
        await this.chatListPage.roomWithTitle(this.roomName).click();

        await this.app.pause(1000); // clicks on the same element twice if no pause
        await this.chatPage.roomWithTitle(this.roomName).click();
        await this.chatPage.addMembersButton.click();

        await this.contactSelectorDmPage.textInput.setValue(process.env.CHAT_RECIPIENT_USER);
        await this.contactSelectorDmPage.hideKeyboardHelper();
        await this.contactSelectorDmPage.recipientContact.click();

        await this.chatPage.buttonExitChat.click();
    });

    Then('they log in', async function () {
        await this.loginExistingAccount(process.env.CHAT_RECIPIENT_USER, process.env.CHAT_RECIPIENT_PASS);
    });

    Then('they accept the room invite', async function () {
        await this.scrollToChat();
        await this.chatListPage.roomWithTitle(this.roomName).click();

        await this.roomInvitePage.acceptButton.click();

        await this.chatPage.buttonSendMessage;
    });

    Then('they decline the room invite', async function () {
        await this.scrollToChat();
        await this.chatListPage.roomWithTitle(this.roomName).click();

        await this.roomInvitePage.declineButton.click();
    });

    When('I cancel the invite', async function () {
        await this.scrollToChat();
        await this.chatListPage.roomWithTitle(this.roomName).click();

        await this.app.pause(5000); // android needs a pause
        await this.chatPage.roomWithTitle(this.roomName).click();
        await this.chatPage.invitedContactMore.click();
        await this.chatPage.removeInvitedButton.click();

        const invitedContactRemoved = await this.chatPage.invitedContactRemoved;
        invitedContactRemoved.should.be.true; // eslint-disable-line

        await this.chatPage.buttonExitChat.click();
    });

    Then('they do not have any room invites', async function () {
        await this.scrollToChat();

        const roomExists = await this.chatListPage.roomWithTitleExists(this.roomName);
        roomExists.should.be.false; // eslint-disable-line
    });

    Then('they leave the room', async function () {
        await this.chatPage.roomWithTitle(this.roomName).click();
        await this.app.pause(1000);
        await this.chatPage.leaveRoomButton.click();
        await this.chatPage.confirmLeaveRoomButton.click();
    });

    Then('they sign out', async function () {
        await this.logout();
    });
});
