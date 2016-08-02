/*!
 * eams-ui's Gruntfile
 * Copyright 2013-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  RegExp.quote = function (string) {
    return string.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  var fs = require('fs');
  var path = require('path');

  var autoprefixerBrowsers = [
    "Android 2.3",
    "Android >= 4",
    "Chrome >= 20",
    "Firefox >= 24",
    "Explorer >= 8",
    "iOS >= 6",
    "Opera >= 12",
    "Safari >= 6"
  ];

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),

    // Task configuration.
    clean: {
      dist: 'dist',
      docs: 'docs/dist'
    },

    jshint: {
      options: {
        jshintrc: 'js/.jshintrc'
      },
      grunt: {
        options: {
          jshintrc: 'grunt/.jshintrc'
        },
        src: ['Gruntfile.js', 'grunt/*.js']
      },
      core: {
        src: 'js/*.js'
      }
    },

    jscs: {
      options: {
        config: 'js/.jscsrc'
      },
      grunt: {
        src: '<%= jshint.grunt.src %>'
      },
      core: {
        src: '<%= jshint.core.src %>'
      }
    },

    concat: {
      core : {
        src: [
          // es5 shim & sham
          'bower_components/es5-shim/es5-shim.js',
          'bower_components/es5-shim/es5-sham.js',

          // jquery
          'bower_components/jquery/dist/jquery.js',

          // jquery-ui without Tooltip
          'bower_components/jquery-ui/jquery-ui.js',

          // js-cookie
          'bower_components/js-cookie/src/js.cookie.js',

          // ie-detector
          'js/core/ie-detector.js',

          // bootstrap
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'js/core/closable.js',
          'js/core/iframe-auto-height.js',

          // jquery steps
          'bower_components/jquery-steps/build/jquery.steps.js',

          // jquery quicksearch
          'bower_components/quicksearch/dist/jquery.quicksearch.js',

          // bootstrap switch
          'bower_components/bootstrap-switch/dist/js/bootstrap-switch.js',

          // tooltipster
          'bower_components/tooltipster/js/jquery.tooltipster.js',

          // jquery validate
          'bower_components/jquery-validation/dist/jquery.validate.js',
          'bower_components/jquery-validation/dist/additional-methods.js',
          'js/core/conf.jquery.validate.js',
          'js/core/validate/methods.js',

          // jquery maskedinput
          'bower_components/jquery-maskedinput/dist/jquery.maskedinput.js',

          // moment
          'bower_components/moment/moment.js',

          // bootstrap datetimepicker
          'bower_components/eonasdan-bootstrap-datetimepicker/src/js/bootstrap-datetimepicker.js',
          'js/core/conf.bootstrap-datetimepicker.js',

          // bootstrap colorpicker
          'bower_components/mjolnic-bootstrap-colorpicker/dist/js/bootstrap-colorpicker.js',

          // twitter typeahead
          'bower_components/typeahead.js/dist/typeahead.bundle.js',

          // bootstrap select
          'bower_components/bootstrap-select/dist/js/bootstrap-select.js',

          // pnotify
          'bower_components/pnotify/pnotify.core.js',
          'bower_components/pnotify/pnotify.desktop.js',
          'bower_components/pnotify/pnotify.history.js',
          'bower_components/pnotify/pnotify.reference.js',
          'bower_components/pnotify/pnotify.nonblock.js',
          'bower_components/pnotify/pnotify.confirm.js',
          'bower_components/pnotify/pnotify.callbacks.js',
          'bower_components/pnotify/pnotify.buttons.js',
          'js/core/conf.pnotify.js',

          // bootstrap paginator
          'bower_components/bootstrap-paginator/src/bootstrap-paginator.js',
          'js/core/conf.bootstrap-paginator.js',

          // bs_pagination
          'js/bs_pagination/jquery.bs_pagination.js',

          // dataTable
          'bower_components/datatables.net/js/jquery.dataTables.js',

          // dataTables ColReorder
          'bower_components/datatables.net-colreorder/js/dataTables.colReorder.js',

          // bootstrap-semi-auto-table
          'bower_components/bootstrap-semi-auto-table/dist/semi-auto-table.js',

          // colResize
          'bower_components/bootstrap-semi-auto-table/dist/colResize.js',

          // bootstrap tagsinput
          'bower_components/bootstrap-tagsinput/dist/bootstrap-tagsinput.js',

          // selectize
          'bower_components/selectize-eams/dist/js/standalone/selectize.js',

          //Treefy
          'bower_components/bootstrap-treefy/dist/bootstrap-treefy.js',

          //underscore
          'bower_components/underscore/underscore.js',

          //backbone
          'bower_components/backbone/backbone.js',

          // Schedule Table
          'js/core/schedule-table.js',

          // bootstrap hover dropdown
          'js/core/bootstrap-hover-dropdown.js',

          //File Input
          'bower_components/bootstrap-fileinput/js/fileinput.js',

          'js/core/form-util.js',

          'bower_components/Croppie/croppie.js',

          // dataTables的bootstrap样式
          'js/core/dataTables.bootstrap.js'

        ],
        dest: 'dist/js/eams-ui.js'
      },

      i18n_en: {
        src: [
          'js/core/i18n-en.bootstrap-semi-auto-table.js'
        ],
        dest: 'dist/js/eams-ui.en.js'
      },

      i18n_zh: {

        src: [

          // jquery validate
          'bower_components/jquery-validation/src/localization/messages_zh.js',
          'js/core/validate/messages_zh.js',

          // moment
          'bower_components/moment/locale/zh-cn.js',

          // bootstrap datetimepicker
          'js/core/i18n-zh.bootstrap-datetimepicker.js',

          // bootstrap select
          'bower_components/bootstrap-select/dist/js/i18n/defaults-zh_CN.js',

          // From Util
          'js/core/i18n-zh.form-util.js',

          //file input
          'js/core/i18n-zh.fileinput.js',
        ],

        dest: 'dist/js/eams-ui.zh.js'
      },

      home : {
        src: [
          'js/home/other-ui.js',
          'js/home/navigation.js'
        ],
        dest: 'dist/js/eams-ui-home.js'
      },

      extra : {
        src: [
          //echarts
          'bower_components/echarts/build/source/echarts-all.js',
        ],
        dest: 'dist/js/echarts-all.js'
      },

      require : {
        src: [
          'bower_components/requirejs/require.js',
        ],
        dest: 'dist/js/require.js'
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      },
      core: {
        src: '<%= concat.core.dest %>',
        dest: 'dist/js/eams-ui.min.js'
      },
      i18n_en: {
        src: '<%= concat.i18n_en.dest %>',
        dest: 'dist/js/eams-ui.en.min.js'
      },
      i18n_zh: {
        src: '<%= concat.i18n_zh.dest %>',
        dest: 'dist/js/eams-ui.zh.min.js'
      },
      home: {
        src: '<%= concat.home.dest %>',
        dest: 'dist/js/eams-ui-home.min.js'
      },
      extra: {
        src: '<%= concat.extra.dest %>',
        dest: 'dist/js/echarts-all.min.js'
      },
      require: {
        src: '<%= concat.require.dest %>',
        dest: 'dist/js/require.min.js'
      }
    },

    less: {
      compileCore: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'eams-ui.css.map',
          sourceMapFilename: 'dist/css/eams-ui.css.map'
        },
        src: 'less/core/alpha-bundle.less',
        dest: 'dist/css/eams-ui.css'
      },
      compilePlugin: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'eams-ui-plugin.css.map',
          sourceMapFilename: 'dist/css/eams-ui-plugin.css.map'
        },
        src: 'less/plugin/alpha-bundle.less',
        dest: 'dist/css/eams-ui-plugin.css'
      },
      compileHome: {
        options: {
          strictMath: true,
          sourceMap: true,
          outputSourceFiles: true,
          sourceMapURL: 'eams-ui-home.css.map',
          sourceMapFilename: 'dist/css/eams-ui-home.css.map'
        },
        src: 'less/home/alpha-bundle.less',
        dest: 'dist/css/eams-ui-home.css'
      }
    },

    autoprefixer: {
      options: {
        browsers: autoprefixerBrowsers
      },
      core: {
        options: {
          map: true
        },
        src: ['dist/css/eams-ui.css', 'dist/css/eams-ui-plugin.css', 'dist/css/eams-ui-home.css']
      }
    },

    htmllint: {
      options: {
        ignore: [
          'Attribute “placeholder” not allowed on element “select” at this point.'
          //'Attribute "autocomplete" not allowed on element "button" at this point.',
          //'Attribute "autocomplete" not allowed on element "input" at this point.',
          //'Element "img" is missing required attribute "src".',
          //'Consider using the “h1” element as a top-level heading only (all “h1” elements are treated as top-level headings by many screen readers and other tools).',
          //'Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          //'Non-space characters found without seeing a doctype first. Expected “<!DOCTYPE html>”.',
          //'Element “head” is missing a required instance of child element “title”.',
          //'Stray doctype.',
          //'Stray start tag “html”.',
          //'Cannot recover after last error. Any further errors will be ignored.'
        ]
      },
      src: '_gh_pages/**/*.html'
    },

    bootlint: {
      options: {
        stoponerror: false,
        relaxerror: ['W005']
        //relaxerror: ['W001', 'W002', 'W003', 'W005', 'E001']
      },
      files: ['_gh_pages/**/*.html']
    },

    jekyll: {
      options: {
        config: '_config.yml'
      },
      docs: {},
      github: {
        options: {
          raw: 'github: true'
        }
      }
    },

    csslint: {
      options: {
        csslintrc: 'less/.csslintrc'
      },
      dist: [
        'dist/css/eams-ui.css',
        'dist/css/eams-ui-plugin.css',
        'dist/css/eams-ui-home.css'
      ]
    },

    cssmin: {
      options: {
        // TODO: disable `zeroUnits` optimization once clean-css 3.2 is released
        //    and then simplify the fix for https://github.com/twbs/bootstrap/issues/14837 accordingly
        compatibility: 'ie8',
        keepSpecialComments: '*',
        advanced: false
      },
      minifyCore: {
        src: 'dist/css/eams-ui.css',
        dest: 'dist/css/eams-ui.min.css'
      },
      minifyPlugin: {
        src: 'dist/css/eams-ui-plugin.css',
        dest: 'dist/css/eams-ui-plugin.min.css'
      },
      minifyHome: {
        src: 'dist/css/eams-ui-home.css',
        dest: 'dist/css/eams-ui-home.min.css'
      }
    },

    csscomb: {
      options: {
        config: 'less/.csscomb.json'
      },
      dist: {
        expand: true,
        cwd: 'dist/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'dist/css/'
      }
    },

    copy: {
      fonts: {
        files: [
          {
            expand: true,
            flatten: true,
            filter: 'isFile',
            src: ['bower_components/**/fonts/**', 'bower_components/**/font/**'],
            dest: 'dist/fonts/'
          }
        ]
      },
      img: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['assets/img/*'],
            dest: 'dist/img/'
          },
          {
            expand: true,
            cwd: 'bower_components/mjolnic-bootstrap-colorpicker/dist/img',
            src: 'bootstrap-colorpicker/*',
            dest: 'dist/img/'
          }
        ]
      },
      js: {
        files: [
          {
            expand: true,
            flatten: true,
            src: ['bower_components/html5shiv/dist/*', ['bower_components/respond/dest/*']],
            dest: 'dist/js/'
          }
        ]
      },
      docs: {
        expand: true,
        cwd: 'dist/',
        src: [
          '**/*'
        ],
        dest: 'docs/dist/'
      }
    },

    watch: {
      src: {
        files: '<%= jshint.core.src %>',
        tasks: ['jshint:src', 'concat']
      },
      less: {
        files: 'less/**/*.less',
        tasks: 'less'
      }
    },

    exec: {
      npmUpdate: {
        command: 'npm update'
      }
    },

    compress: {
      main: {
        options: {
          archive: 'eams-ui-<%= pkg.version %>-dist.zip',
          mode: 'zip',
          level: 9,
          pretty: true
        },
        files: [
          {
            expand: true,
            src: ['dist/**', '_gh_pages/**'],
            dest: 'eams-ui-<%= pkg.version %>-dist'
          }
        ]
      }
    }

  });


  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });
  require('time-grunt')(grunt);

  grunt.registerTask('less-compile', ['less']);

  grunt.registerTask('package-js', ['concat']);
  grunt.registerTask('package-css', ['less-compile', 'autoprefixer', 'csscomb']);
  grunt.registerTask('package', ['clean:dist', 'package-css', 'package-js', 'copy:fonts', 'copy:img', 'copy:js', 'copy:docs']);

  grunt.registerTask('dist-js', ['package-js', 'uglify']);
  grunt.registerTask('dist-css', ['package-css', 'cssmin']);
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'dist-js', 'copy:fonts', 'copy:img', 'copy:js', 'docs']);

  grunt.registerTask('default', ['package']);

  grunt.registerTask('docs', ['clean:docs', 'copy:docs', 'jekyll:docs', 'htmllint', 'bootlint']);

  grunt.registerTask('prep-release', ['docs', 'compress']);

};

