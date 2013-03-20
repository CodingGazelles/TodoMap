basePath = '../';

files = [
MOCHA,
MOCHA_ADAPTER,
    './config/mocha.conf.js',

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
    './public/config/routes.js',
    './public/js/app.js',

//Test-Specific Code
    './node_modules/chai/chai.js',
    './test/lib/chai-should.js',
    './test/lib/chai-expect.js',
    './vendor/ngMidwayTester/Source/ngMidwayTester.js',

//Test-Specs
    './test/midway/**/*.js'];


port = 9202;
runnerPort = 9302;
captureTimeout = 5000;


shared = require(__dirname + "/testacular.shared.conf.js").shared
growl = shared.colors;
colors = shared.colors;
singleRun = shared.singleRun;
autoWatch = shared.autoWatch;
browsers = shared.defaultBrowsers;
reporters = shared.defaultReporters;
proxies = shared.defaultProxies;