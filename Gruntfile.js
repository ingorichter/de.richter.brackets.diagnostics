/*jshint camelcase: false, globalstrict: true*/

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
    'use strict';
    // load all grunt tasks
    require('load-grunt-tasks')(grunt, {pattern: ['grunt-contrib-*']});
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-zip');

    // configurable paths
    var extensionConfig = {
        app: 'app',
        dist: 'dist'
    };

    // Load optional requirejs config, see http://requirejs.org/docs/api.html#config
    var rjsconfig = grunt.file.readJSON('requirejs-config.json');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        extensionConfig: extensionConfig,
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= extensionConfig.dist %>/*',
                        '!<%= extensionConfig.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },
        jsdoc : {
            docstrap : {
                src : ['main.js'],
                options : {
                    destination: 'docs',
                    template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
                    configure : 'jsdoc.conf.json'
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= extensionConfig.app %>/main.js',
                'test/spec/{,*/}*.js',
                'unittests.js',
                'strings.js',
                'nls/**/*.js'
            ]
        },
        requirejs: {
            dist: {
                // Options: https://github.com/jrburke/r.js/blob/master/build/example.build.js
                options: {
                    name: 'main',
                    paths: rjsconfig.paths,
                    shim: rjsconfig.shim,
                    optimize: 'uglify2',
                    out: 'min/main.js',
                    generateSourceMaps: true,
                    useSourceUrl: true,
                    preserveLicenseComments: false,
                    useStrict: true,
                    wrap: false,
                    uglify2: {}
                }
            }
        },
        compress: {
            dist: {
                options: {
                    archive: '<%= extensionConfig.dist %>/<%= pkg.name %>-<%= pkg.version %>.zip',
                    mode: 'zip'
                },
                files: [{
                    expand: true,
                    src: ['main.js', 'SystemInfo.js', 'strings.js', 'nls/**', 'package.json', 'README.md', 'LICENSE', 'thirdparty/**', 'node_modules/ua-parser-js/src/**']
                }]
            }
        },
        zip: {
            multi: {
                src: ['main.js', 'SystemInfo.js', 'strings.js', 'nls/**', 'package.json', 'README.md', 'LICENSE', 'thirdparty/**', 'node_modules/ua-parser-js/src/**'],
                dest: '<%= extensionConfig.dist %>/<%= pkg.name %>-<%= pkg.version %>.zip'
            },
        }
    });

    grunt.registerTask('test', [
        'mocha'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'zip'
//        'requirejs',
//        'compress'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'jsdoc',
//        'test',
        'build'
    ]);
};


