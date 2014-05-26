module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // frameworks to use
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: [
      // Font files
      {
        pattern: 'bower_components/bootstrap/dist/fonts/*.*',
        included: false
      },
      // Map files
      {
        pattern: 'bower_components/jquery/dist/jquery.min.map',
        included: false
      },
      // CSS files
      'bower_components/bootstrap/dist/css/bootstrap.min.css',
      'build/css/bootstrap-datetime.min.css',
      // JavaScript files
      'bower_components/jquery/dist/jquery.min.js',
      'bower_components/bootstrap/dist/js/bootstrap.min.js',
      'bower_components/momentjs/min/moment-with-langs.min.js',
      'src/js/bootstrap-datetime.js',
      // Tests
      'tests/tests.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // test results reporter to use
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // Start these browsers
    browsers: ['Chrome', 'Firefox', 'Opera', 'PhantomJS', 'Safari'],

    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true
  });
};
