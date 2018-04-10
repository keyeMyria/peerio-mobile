const { defineSupportCode } = require('cucumber');

defineSupportCode(({ When, Then }) => {
    When('I start a new DM with someone', async function () {
        await this.openContactsPickerForDM();
        await this.searchForRecipient();
        await this.contactSelectorPage.recipientContact.click();
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

    When('I exit the current chat', async function () {
        await this.chatPage.buttonExitChat.click();
    });

    Then('I can send a message to the current chat', async function () {
        const message = `Test Message ${new Date()}`;
        await this.chatPage.textInput.setValue(message);
        await this.chatPage.hideKeyboardHelper();
        await this.chatPage.buttonSendMessage.click();
    });
});
