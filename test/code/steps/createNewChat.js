const { defineSupportCode } = require('cucumber');

defineSupportCode(({ When, Then }) => {
    When('I start a new DM with a User', async function () {
        await this.chatListPage.buttonCreateNewChat.click();
        await this.chatActionSheetPage.newDmOption.click();
        await this.contactSelectorDmPage.textInput.setValue(process.env.CHAT_RECIPIENT_USER);
        await this.contactSelectorDmPage.hideKeyboardHelper();
        await this.contactSelectorDmPage.recipientContact.click();
        await this.contactSelectorDmPage.recipientContact.click(); // TODO tap twice
    });

    When('I create a new room', async function () {
        this.roomName = new Date().getTime();
        await this.chatListPage.buttonCreateNewChat.click();
        await this.chatActionSheetPage.newRoomOption.click();
        await this.roomCreationPage.textInputRoomName.setValue(this.roomName);
        await this.roomCreationPage.hideKeyboardHelper();
        await this.roomCreationPage.nextButton.click();
        await this.roomCreationPage.goButton.click();
        await this.chatPage.buttonExitChat.click();
    });

    When('I exit the current Chat', async function () {
        await this.chatPage.buttonExitChat.click();
    });

    Then('I can send a message to the current Chat', async function () {
        const message = `Test Message ${new Date()}`;
        await this.chatPage.textInput.setValue(message);
        await this.chatPage.hideKeyboardHelper();
        await this.chatPage.buttonSendMessage.click();
    });
});
