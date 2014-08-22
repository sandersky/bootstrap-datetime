module.exports = function (config) {
    config.set({
        autoWatch: false,
        basePath: '../',
        browsers: [
            'PhantomJS',
        ],
        colors: true,
        exclude: [
            'bower_components/**/spec/**/*.js',
            'bower_components/**/test/**/*.js',
        ],
        files: [
            'bower_components/moment/min/moment-with-locales.js',
            {pattern: 'src/js/**/*.js', included: false},
            {pattern: 'spec/*.js', included: false},
            'karma/test-main.js',
        ],
        frameworks: [
            'jasmine',
            'requirejs',
        ],
        logLevel: config.LOG_INFO,
        port: 9876,
        preprocessors: {},
        reporters: [
            'spec',
        ],
        singleRun: true,
    });
}
