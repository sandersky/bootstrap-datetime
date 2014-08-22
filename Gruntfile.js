module.exports = function (grunt) {
    'use strict';

    var toolkit = require('grunt-amd-config');
    var _ = require('underscore');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: toolkit.packages.clean.config,
        csslint: {
            options: {
                csslintrc: '.csslintrc',
            },
        },
        eslint: toolkit.packages.eslint.config,
        jsdoc: toolkit.packages.jsdoc.config,
        karma: toolkit.packages.karma.config,
        less: toolkit.packages.less.config,
        lesslint: toolkit.packages.lesslint.config,
        requirejs: _.defaults({
            options: {
                paths: {
                    'moment': 'empty:',  // Prevent moment.js from being compiled
                },
            },
        }, toolkit.packages.requirejs.config),
    });

    toolkit.registerDefaultTasks(grunt);
};
