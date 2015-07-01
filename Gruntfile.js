/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    eslint: {
      target: ['src/*.es6', 'test/*.js'],
      options: {
        config: '.eslintrc'
      }
    },
    jscs: {
        src: ['src/*.es6', 'test/*.js'],
        options: {
            config: '.jscsrc'
        }
    },
    concat: {
      jsdoc2md: {
        src: ['src/Solver.es6', 'src/Errors.es6', 'src/Expression.es6'],
        dest: 'tmp/concat.js'
      }
    },
    jsdoc2md: {
      output: {
        options: {
          'global-index-format': 'none',
          'module-index-format': 'none'
        },
        src: 'tmp/concat.js',
        dest: 'docs/Mooruk.md'
      }
    },
    exec: {
      test: 'mocha --compilers js:mocha-traceur'
    },
    browserify: {
      dist: {
        options: {
          browserifyOptions: {
            standalone: 'Mooruk'
          }
        },
        files: {
          './dist/mooruk.js': ['./src/Solver.es6']
        }
      }
    },
    uglify: {
      dist: {
        src: './dist/mooruk.js',
        dest: './dist/mooruk.min.js'
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'top',
          banner:
            '/**\n' +
            '* This Source Code is licensed under the MIT license. If a copy of the\n' +
            '* MIT-license was not distributed with this file, You can obtain one at:\n' +
            '* http://opensource.org/licenses/mit-license.html.\n' +
            '*\n' +
            '* @author: Hein Rutjes (IjzerenHein)\n' +
            '* @license MIT\n' +
            '* @copyright Gloey Apps, 2015\n' +
            '*\n' +
            '* @library mooruk\n' +
            '* @version ' + grunt.file.readJSON('package.json').version + '\n' +
            '* @generated <%= grunt.template.today("dd-mm-yyyy") %>\n' +
            '*/'
        },
        files: {
          src: ['dist/*.js']
        }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-jsdoc-to-markdown');
  grunt.loadNpmTasks('grunt-banner');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-exec');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');

  // Tasks
  grunt.registerTask('lint', ['eslint', 'jscs']);
  grunt.registerTask('doc', ['concat', 'jsdoc2md']);
  grunt.registerTask('test', ['exec:test']);
  grunt.registerTask('dist', ['browserify', 'uglify', 'usebanner']);
  grunt.registerTask('default', ['lint', 'doc', 'dist', 'test']);
};
