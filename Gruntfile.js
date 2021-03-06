'use strict';

var spawn = require('child_process').spawn;

module.exports = function(grunt) {

  grunt.initConfig({
    eslint: {
      src: {
        options: {
          configFile: '.eslintrc-es2015.yaml',
        },
        src: 'src/**/*.js',
      },
      root: {
        options: {
          configFile: '.eslintrc-node.yaml',
        },
        src: '*.js',
      },
      test: {
        options: {
          configFile: '.eslintrc-mocha.yaml',
        },
        src: 'test/**/*.js',
      },
    },
    mochaTest: {
      unit: {
        options: {
          reporter: 'spec',
          quiet: false,
          clearRequireCache: true,
          require: [
            'babel-register',
            'test/globals',
          ],
        },
        src: 'test/lib/*.js',
      },
    },
    watch: {
      options: {
        spawn: false,
      },
      config: {
        files: ['.env', 'config.js'],
        tasks: ['kill', 'start'],
      },
      src: {
        files: ['<%= eslint.src.src %>'],
        tasks: ['eslint:src', 'mochaTest', 'kill', 'start'],
      },
      root: {
        files: ['<%= eslint.root.src %>'],
        tasks: ['eslint:root'],
      },
      test: {
        files: ['<%= eslint.test.src %>'],
        tasks: ['eslint:test', 'mochaTest'],
      },
      lint: {
        options: {
          reload: true,
        },
        files: ['.eslintrc*', 'eslint/*'],
        tasks: ['eslint'],
      },
      // Reload the bot if chatter files change. This makes dev MUCH easier!
      chatter: {
        files: ['node_modules/chatter/dist/**/*'],
        tasks: ['kill', 'start'],
      },
    },
  });

  grunt.registerTask('start', function() {
    global._BOT = spawn('node', ['--require', 'babel-register', 'src/index'], {stdio: 'inherit'});
  });

  grunt.registerTask('kill', function() {
    global._BOT.kill('SIGKILL');
  });

  grunt.registerTask('test', ['eslint', 'mochaTest']);
  grunt.registerTask('default', ['start', 'watch']);

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-eslint');
};
