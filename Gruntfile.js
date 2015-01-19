module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ["dist", '.tmp'],

    copy: {
      main: {
        expand: true,
        cwd: 'app/',
        src: ['**', '!js/**', '!bower_components/**', '!components/**', '!**/*.css', '!game/*.js', '!app.js'],
        dest: 'dist/'
      },
      tmp: {
        expand: true,
        cwd: 'app/',
        src: ['**', '!js/**', '!bower_components/**', '!components/**', '!**/*.css', '!game/*.js', '!app.js'],
        dest: 'tmp/'
      }
    },

    ngAnnotate: {
      options: {
        singleQuotes: false,
      },
      app: {
        files: [{
          expand: true,
          cwd: 'app/game',
          src: '*.js',
          dest: 'tmp/js', // Destination path prefix
          ext: '.js',     // Dest filepaths will have this extension.
          extDot: 'last', // Extensions in filenames begin after the last dot
        }],
      }
    },

    useminPrepare: {
      html: 'tmp/index.html'
    },

    uglify: {
      options: {
        report: 'min',
        // TODO: find out why angular won't mangle
        mangle: false
      }
    },

    rev: {
      files: {
        src: ['dist/**/*.{js,css}', '!dist/js/shims/**']
      }
    },

    usemin: {
      html: ['dist/index.html']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-rev');
  grunt.loadNpmTasks('grunt-usemin');

  // Tell Grunt what to do when we type "grunt" into the terminal
  grunt.registerTask(
    'default',
    [
      'clean',
      'copy',
      'ngAnnotate',
      'useminPrepare',
      'concat',
      'uglify',
      'cssmin',
      'rev',
      'usemin'
    ]
  );

};
