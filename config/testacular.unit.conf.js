basePath = '../';

files = [
    // MOCHA,
    // MOCHA_ADAPTER,
    // './config/mocha.conf.js',

    JASMINE,
    JASMINE_ADAPTER,
    

    //3rd Party Code
    './public/lib/angular/angular.min.js',
    './public/lib/angular/angular-resource.min.js',
    './public/lib/underscore-min.js',
    './public/lib/tinycolor.js',

    //App-specific Code
    './public/js/controllers/*.js',
    './public/js/directives/*.js',
    './public/js/services/*.js',
    './public/js/filters/*.js',
    './public/js/routes.js',
    './public/js/app.js',

    //Test-Specific Code
    // './node_modules/chai/chai.js',
    // './test/lib/chai-should.js',
    // './test/lib/chai-expect.js',

    './test/lib/jasmine-1.3.1/jasmine-html.js',
    './test/lib/angular/angular-mocks.js',

    //Test-Specs
    './test/unit/**/*.js'
];

port = 9201;
runnerPort = 9301;
captureTimeout = 5000;

shared = require(__dirname + "/testacular.shared.conf.js").shared
growl = shared.colors;
colors = shared.colors;
singleRun = shared.singleRun;
autoWatch = shared.autoWatch;
browsers = shared.defaultBrowsers;
reporters = shared.defaultReporters;