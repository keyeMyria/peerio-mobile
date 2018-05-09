function selectorWithText(query) {
    return `android=new UiSelector().text("${query}")`;
}

function selectorWithPartialResourceId(query) {
    return `android=new UiSelector().resourceIdMatches("${query}")`;
}

module.exports = {
    selectorWithText,
    selectorWithPartialResourceId
};
