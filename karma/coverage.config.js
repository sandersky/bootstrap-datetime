module.exports = function (config) {
    'use strict';

    var common = require('./common.config');

    common(config);

    config.set({
        coverageReporter: {
            reporters: [{
                type: 'text-summary',
            }, {
                dir: 'coverage',
                type: 'html',
            }],
        },
        preprocessors: {
            'src/**/*.js': ['coverage'],
        },
        reporters: [
            'progress',
            'coverage',
        ],
    });

    return config;
}
