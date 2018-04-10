class Page {
    constructor(app) {
        this.app = app;
    }

    get snackbar() {
        return this.app
            .waitForExist('~snackbar')
            .waitForVisible('~snackbar')
            .element('~snackbar');
    }

    // Taps the test-helper hideKeyboard touchable to hide the keyboard
    // it seems to be more reliable than any appium function
    async hideKeyboardHelper() {
        this.app.element('~hideKeyboard').click();
        await this.app.pause(2000);
    }

    // Taps the test-helper downScroll element
    // it seems to be more reliable than any appium function
    scrollDownHelper() {
        return this.app
            .waitForExist('~downScroll')
            .click('~downScroll');
    }

    // Taps the test-helper upScroll element
    // it seems to be more reliable than any appium function
    scrollUpHelper() {
        return this.app
            .waitForExist('~upScroll')
            .click('~upScroll');
    }

    scrollToEndHelper() {
        return this.app
            .waitForExist('~endScroll')
            .waitForVisible('~endScroll')
            .click('~endScroll');
    }

    // Check if element exists, not necessarily visible
    checkIfPresent(selector, timeout) {
        return this.app.isExisting(selector, timeout);
    }

    // Check if element exists and is visible
    checkIfVisible(selector) {
        return this.app
            .isExisting(selector)
            .isVisible(selector);
    }

    // Element exists on page, not necessarily visible
    getWhenPresent(selector) {
        return this.app
            .waitForExist(selector)
            .element(selector);
    }

    // Element is visible on page
    getWhenVisible(selector) {
        return this.app
            .waitForExist(selector)
            .waitForVisible(selector)
            .element(selector);
    }

    // Element is visible and can be pressed
    getWhenEnabled(selector) {
        return this.app
            .waitForExist(selector)
            .waitForEnabled(selector)
            .element(selector);
    }

    // Get a ref to an element and search inside it
    getElementInContainer(container, element) {
        return this.app
            .waitForExist(container)
            .waitForVisible(container)
            .element(container)
            .element(element);
    }

    // Get a ref to an element and check if element is present inside it
    checkElementInContainer(container, element) {
        return this.app
            .waitForExist(container)
            .waitForVisible(container)
            .element(container)
            .isExisting(element);
    }
}

module.exports = Page;
