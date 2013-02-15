var CONFIG;

(function () {

    var appPrefix = 'public/';
    var appVersion = 1;

    CONFIG = {

        version: appVersion,

        baseDirectory: appPrefix,
        templateFileQuerystring: "?v=" + appVersion,

        routing: {

            prefix: '!',
            html5Mode: false

        },

        viewUrlPrefix: 'views/',
        partialUrlPrefix: 'partials/',

        prepareViewTemplateUrl: function (url) {
            return this.viewUrlPrefix + url;
        }

    };

})();