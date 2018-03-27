const reporter = require('cucumber-html-reporter');

const options = {
    theme: 'hierarchy',
    jsonDir: 'test/reports/result',
    output: 'test/reports/result/result.html',
    reportSuiteAsScenarios: true,
    launchReport: true
};

reporter.generate(options);

