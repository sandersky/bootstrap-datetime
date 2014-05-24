module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build/'],
    copy: {
      docs: {
        files: [{
          // CSS files
          'docs/css/bootstrap.min.css': 'bower_components/bootstrap/dist/css/bootstrap.min.css',
          'docs/css/bootstrap-datetime.min.css': 'build/css/bootstrap-datetime.min.css',
          // JavaScript files
          'docs/js/jquery.min.js': 'bower_components/jquery/dist/jquery.min.js',
          'docs/js/bootstrap.min.js': 'bower_components/bootstrap/dist/js/bootstrap.min.js',
          'docs/js/moment.min.js': 'bower_components/momentjs/min/moment-with-langs.min.js',
          'docs/js/bootstrap-datetime.min.js': 'build/js/bootstrap-datetime.min.js'
        }, {
            expand: true,
            flatten: true,
            src: ['bower_components/bootstrap/dist/fonts/**'],
            dest: 'docs/fonts/',
            filter: 'isFile'
        }]
      },
      js: {
        files: {
          'build/js/<%= pkg.name %>.js': 'src/js/<%= pkg.name %>.js'
        }
      }
    },
    cssmin: {
      build: {
        files: {
          'build/css/<%= pkg.name %>.min.css': 'build/css/<%= pkg.name %>.css'
        }
      }
    },
    jshint: {
      files: [
        'Gruntfile.js',
        'src/js/**/*.js'
      ]
    },
    less: {
      build: {
        files: {
          'build/css/<%= pkg.name %>.css': 'src/less/build.less'
        }
      }
    },
    lesslint: {
      options: {
        csslint: {
          'adjoining-classes': false
        },
        imports: ['src/less/**/*.less']
      },
      src: ['src/less/build.less']
    },
    uglify: {
      build: {
        files: [{
          'build/js/<%= pkg.name %>.min.js': 'build/js/<%= pkg.name %>.js'
        }]
      }
    }
  });

  // Load tasks
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });

  // Include runtime metrics for tasks
  require('time-grunt')(grunt);

  grunt.registerTask('analyze', [
    'lesslint',
    'jshint'
  ]);

  // Task for compiling and minifying Less to CSS
  grunt.registerTask('build-css', [
    'less',
    'cssmin'
  ]);

  grunt.registerTask('build-docs', [
    'copy:docs'
  ]);

  // Task for compiling and minifying JavaScript
  grunt.registerTask('build-js', [
    'copy:js',
    'uglify'
  ]);

  // Tasks for building all files
  grunt.registerTask('build', [
    'clean',
    'build-css',
    'build-js',
    'build-docs'
  ]);

  // Default task(s).
  grunt.registerTask('default', [
    'analyze',
    'build'
  ]);
};
