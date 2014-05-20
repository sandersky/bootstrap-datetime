module.exports = function (grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: ['build/'],
    copy: {
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
          'build/css/<%= pkg.name %>.css': 'src/less/<%= pkg.name %>.less'
        }
      }
    },
    lesslint: {
      options: {
        csslint: {
          'adjoining-classes': false
        }
      },
      src: ['src/less/**/*.less']
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

  // Task for compiling and minifying JavaScript
  grunt.registerTask('build-js', [
    'copy:js',
    'uglify'
  ]);

  // Tasks for building all files
  grunt.registerTask('build', [
    'clean',
    'build-css',
    'build-js'
  ]);

  // Default task(s).
  grunt.registerTask('default', [
    'analyze',
    'build'
  ]);
};
