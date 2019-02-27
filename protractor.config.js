//var language = 'en-US';
var language = 'zh-CN';

exports.config = {
    params: {
        screenshotPath: './screenshots/',
        lang: language
    },

    framework: 'jasmine',
    specs: ['builtspecs/specs/**/*.spec.js'],

    onPrepare: function () {
        //browser.driver.manage().window().maximize();
    },

    jasmineNodeOpts: {
        showColors: true,
        displayStacktrace: true,
        displaySpecDuration: true,
		defaultTimeoutInterval: 500000,
		isVerbose: true,
		includeStackTrace: true,
    }
}