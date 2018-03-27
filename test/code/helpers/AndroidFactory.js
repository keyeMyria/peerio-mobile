const { android } = require('../platforms');
const ChatActionSheetPage = require('../pages/popups/actionSheetPage/AndroidChatActionSheetPage');
const FileUploadPage = require('../pages/files/fileUploadPage/AndroidFileUploadPage');

class AndroidFactory {
    get bundleId() { return 'com.peerio.app'; }
    get platform() { return android; }
    chatActionSheetPage(app) { return new ChatActionSheetPage(app); }
    fileUploadPage(app) { return new FileUploadPage(app); }
}

module.exports = new AndroidFactory();
