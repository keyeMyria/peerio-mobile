const webDriver = require('webdriverio');
const CreateAccountPage = require('./pages/login/createAccountPage');
const ChatListPage = require('./pages/messaging/chatListPage');
const ContactSelectorDmPage = require('./pages/messaging/contactSelectorDmPage');
const ChatPage = require('./pages/messaging/chatPage');
const RoomCreationPage = require('./pages/messaging/roomCreationPage');
const RoomInvitePage = require('./pages/messaging/roomInvitePage');
const FilesListPage = require('./pages/files/filesListPage');
const iOSFactory = require('./helpers/iOSFactory');
const AndroidFactory = require('./helpers/AndroidFactory');
const StartPage = require('./pages/start/startPage');
const LoginPage = require('./pages/login/loginPage');
const HomePage = require('./pages/start/homePage');
const TwoStepVerificationPage = require('./pages/settings/twoStepVerificationPage');
const TwoFactorAuthPrompt = require('./pages/popups/twoFactorAuthPrompt');
const SettingsPage = require('./pages/settings/settingsPage');
const ProfileSettingsPage = require('./pages/settings/profileSettingsPage');
const otplib = require('otplib');
const FileViewPage = require('./pages/files/fileViewPage');
const AlertsPage = require('./pages/popups/alertsPage');

class World {
    constructor({ attach, parameters }) {
        this.attach = attach;
        this.context = parameters.platform === 'ios' ? iOSFactory : AndroidFactory;
    }

    openApp() {
        this.app = webDriver.remote(this.context.platform);
        this.app.options.waitforTimeout = 15000;
        this.app.options.screenshotPath = 'test/screenshots';

        this.createPages();

        return this.app.init();
    }

    createPages() {
        this.startPage = new StartPage(this.app);
        this.loginPage = new LoginPage(this.app);
        this.createAccountPage = new CreateAccountPage(this.app);
        this.homePage = new HomePage(this.app);
        this.alertsPage = new AlertsPage(this.app);

        this.chatListPage = new ChatListPage(this.app);
        this.contactSelectorDmPage = new ContactSelectorDmPage(this.app);
        this.roomCreationPage = new RoomCreationPage(this.app);
        this.roomInvitePage = new RoomInvitePage(this.app);
        this.chatPage = new ChatPage(this.app);
        this.chatActionSheetPage = this.context.chatActionSheetPage(this.app);

        this.filesListPage = new FilesListPage(this.app);
        this.fileViewPage = new FileViewPage(this.app);
        this.fileUploadPage = this.context.fileUploadPage(this.app);

        this.settingsPage = new SettingsPage(this.app);
        this.twoStepVerificationPage = new TwoStepVerificationPage(this.app);
        this.twoFactorAuthPrompt = new TwoFactorAuthPrompt(this.app);
        this.profileSettingsPage = new ProfileSettingsPage(this.app);
    }

    closeApp() {
        return this.app
            .removeApp(this.context.bundleId) // remove app so it doesn't influence next test
            .end(); // end server session and close webdriver
    }

    async takeScreenshot() {
        const image = await this.app.saveScreenshot();
        this.attach(image, 'image/png');
    }

    async goTo2FASetup() {
        await this.homePage.settingsTab.click();

        await this.settingsPage.securityButton.click();
        await this.settingsPage.twoStepVerificationButton.click();

        this.secretKey = await this.twoStepVerificationPage.secretKey.getText();
        console.log('Account secret key', this.secretKey);
    }

    async tryEnterTokenInSettings() {
        const token = otplib.authenticator.generate(this.secretKey);
        await this.twoStepVerificationPage.confirmationCode.setValue(token);
        await this.twoStepVerificationPage.hideKeyboardHelper();
        await this.twoStepVerificationPage.confirmButton.click();
    }

    async enterTokenInSettings() {
        await this.tryEnterTokenInSettings();
        if (!(await this.twoStepVerificationPage.backupCodesVisible)) { // Retry if token was expired
            await this.tryEnterTokenInSettings();
        }
    }

    async tryEnterTokenInPrompt() {
        const token = otplib.authenticator.generate(this.secretKey);
        await this.twoFactorAuthPrompt.tokenInput.setValue(token);
        await this.twoFactorAuthPrompt.hideKeyboardHelper();
        await this.twoFactorAuthPrompt.submitButton.click();
        await this.twoFactorAuthPrompt.submitButton.click(); // TODO tap twice
    }

    async enterTokenInPrompt() {
        await this.tryEnterTokenInPrompt();
        if (await this.twoFactorAuthPrompt.tokenInputPresent) { // Retry if token was expired
            await this.tryEnterTokenInPrompt();
        }
    }

    async selectCreateAccount() {
        await this.alertsPage.dismissNotificationsAlert();
        await this.startPage.createAccountButton.click();
    }

    async typePersonalInfo() {
        this.username = new Date().getTime();
        console.log('Creating account with username', this.username);

        await this.createAccountPage.firstName.setValue('test-first-name');
        await this.createAccountPage.hideKeyboardHelper();
        await this.createAccountPage.lastName.setValue('test-last-name');
        await this.createAccountPage.hideKeyboardHelper();
        await this.createAccountPage.username.setValue(this.username);
        await this.createAccountPage.hideKeyboardHelper();
        await this.createAccountPage.email.setValue(`${this.username}@test.lan`);
        await this.createAccountPage.hideKeyboardHelper();
        await this.createAccountPage.nextButton.click();
    }

    async savePasscode() {
        await this.createAccountPage.passphrase.getText().then(innerText => {
            this.passphrase = innerText;
        });
        console.log('Creating account with passphrase', this.passphrase);
        await this.createAccountPage.nextButton.click();
    }

    async confirmSavingPasscode() {
        await this.createAccountPage.confirmInput.setValue('I have saved my account key');
        await this.createAccountPage.hideKeyboardHelper();
        await this.createAccountPage.finishButton.click();
    }

    async seeWelcomeScreen() {
        await this.homePage.isVisible;
    }

    async dismissEmailConfirmationPopup() {
        if (this.alertsPage.emailConfirmationPopup.isVisible()) {
            this.alertsPage.emailConfirmationPopup.click();
        }
    }

    async loginExistingAccount(username, passphrase) {
        await this.alertsPage.dismissNotificationsAlert();
        await this.startPage.loginButton.click();

        await this.loginPage.username.setValue(username);
        await this.loginPage.hideKeyboardHelper();
        await this.loginPage.passphrase.setValue(passphrase);
        await this.loginPage.hideKeyboardHelper();
        await this.loginPage.submitButton.click();

        await this.seeWelcomeScreen();
        await this.dismissEmailConfirmationPopup();
    }

    async createNewAccount() {
        await this.selectCreateAccount();
        await this.typePersonalInfo();
        await this.savePasscode();
        await this.confirmSavingPasscode();
        await this.seeWelcomeScreen();
        await this.dismissEmailConfirmationPopup();
    }

    async logout() {
        await this.homePage.settingsTab.click();
        await this.homePage.scrollDownHelper();
        await this.settingsPage.logoutButton.click();
        await this.settingsPage.lockButton.click();

        await this.app.closeApp();
        await this.app.launch();
    }

    async scrollToChat() {
        await this.homePage.isVisible;

        // Wait for rooms to load, otherwise position will change
        await this.app.pause(5000);

        while (!(await this.chatListPage.roomWithTitleVisible(this.roomName))) { // eslint-disable-line
            await this.chatListPage.scrollDownHelper();  // eslint-disable-line
        }
    }
}

module.exports = World;
