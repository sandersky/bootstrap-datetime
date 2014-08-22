(function () {
    'use strict';

    var tests = [];

    for (var file in window.__karma__.files) {
        if (/spec\.js$/.test(file)) {
            tests.push(file);
        }
    }

    requirejs.config({
        // Karma serves files from '/base'
        baseUrl: '/base',
        callback: function () {
            require(tests, function () {
                window.__karma__.start();
            });
        },
        deps: tests,
        paths: {
            'bootstrap-datetime': 'src/js/bootstrap-datetime',
        },
    });
})();
