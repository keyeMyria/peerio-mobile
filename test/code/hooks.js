const { defineSupportCode, Status } = require('cucumber');
const World = require('./world');
const chai = require('chai');

chai.should();
const defaultTimeout = 120000;

defineSupportCode(({ setDefaultTimeout, setWorldConstructor, Before, After }) => {
    setDefaultTimeout(defaultTimeout);

    setWorldConstructor(World);

    Before('@noCacheReset', function () {
        this.context.platform.desiredCapabilities.noReset = true;
    });

    Before(async function () {
        this.attach(`Platform: ${this.context.platform.desiredCapabilities.platformName}`);
        this.attach(`Version: ${this.context.platform.desiredCapabilities.platformVersion}`);
        await this.openApp();
    });

    After(async function (scenario) {
        if (scenario.result.status === Status.FAILED) {
            await this.takeScreenshot();
        }
        await this.closeApp();
    });
});
