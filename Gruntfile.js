// module.exports = function(grunt) {
//     grunt.initConfig({
//         cssmin: {
//             options: {
//                 // compress: false,
//                 // yuicompress: false,
//                 // optimization: 2,
//                 // strictImports: true,
//                 sourceMap: true,
//                 mergeIntoShorthands: false,
//                 roundingPrecision: -1
//             },
//             target: {
//                 files: {
//                     "pub/css/responsive-styles.min.css": ["assets/dist/css/responsive-styles-processed.css"]
//                 }
//             }
//         },
//         postcss: {
//             options: {
//                 processors: [
//                     require('autoprefixer')({
//                         overrideBrowserslist: ['last 2 versions',  'ie 11']
//                     }),
//                 ]
//             },
//             dist: {
//                 src: 'assets/dist/css/responsive-styles.css',
//                 dest: 'assets/dist/css/responsive-styles-processed.css'
//             }
//         },
//
//         // imagemin: {
//         //     dynamic: {
//         //         files: [{
//         //             expand: true,
//         //             cwd: 'assets/dist/images/',
//         //             src: ['**/*.{png,jpg,gif}'],
//         //             dest: 'pub/images/'
//         //         }]
//         //     }
//         // },
//
//         // watch: {
//         //     less: {
//         //         files: ['assets/dist/less/**/*.less'],
//         //         tasks: ['less:dev', 'postcss:dev']
//         //     },
//         //     css: {
//         //         files: ['pub/css/*.min.css'],
//         //         options: {
//         //             livereload: true,
//         //         }
//         //     },
//         //     imagemin: {
//         //         files: 'assets/dist/images/**/*.{png,jpg,gif}',
//         //         tasks: ['imagemin']
//         //     }
//         // }
//     });
//
//     grunt.loadNpmTasks('grunt-contrib-cssmin');
//     grunt.loadNpmTasks('grunt-postcss');
//     // grunt.loadNpmTasks('grunt-contrib-imagemin');
//     // grunt.loadNpmTasks('grunt-contrib-watch');
//
//
//     grunt.registerTask('default', ['postcss', 'cssmin']);
// };
module.exports = function(grunt) {
    grunt.initConfig({
        less: {
            dev: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2,
                    strictImports: true,
                    sourceMap: true,
                    sourceMapFilename: 'pub/css/responsive-styles.css.map', // where file is generated and located
                    sourceMapURL: 'responsive-styles.css.map', // the complete url and filename put in the compiled css file
                    sourceMapBasepath: 'pub', // Sets sourcemap base path, defaults to current working directory.
                    sourceMapRootpath: '/', // adds this path onto the sourcemap filename and less file paths
                },
                files: {
                    "pub/css/responsive-styles.css": "assets/dist/less/responsive-styles.less"
                }
            },
            prod: {
                options: {
                    compress: false,
                    yuicompress: false,
                    optimization: 2,
                    strictImports: true
                },
                files: {
                    "assets/dist/css/responsive-styles.css": "assets/dist/less/responsive-styles.less"
                }
            }
        },

        postcss: {
            dev: {
                options: {
                    map: true,
                    processors: [
                        require('autoprefixer')({
                            overrideBrowserslist: ['last 2 versions',  'ie 11']
                        })
                    ]
                },
                src: 'pub/css/responsive-styles.css',
                dest: 'pub/css/responsive-styles.min.css'
            },

            prod: {
                options: {
                    processors: [
                        require('autoprefixer')({
                            overrideBrowserslist: ['last 2 versions',  'ie 11']
                        }),
                        require('cssnano')()
                    ]
                },
                src: 'assets/dist/css/responsive-styles.css',
                dest: 'pub/css/responsive-styles.min.css'
            }
        },

        imagemin: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'assets/dist/images/',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'pub/images/'
                }]
            }
        },

        watch: {
            less: {
                files: ['assets/dist/less/**/*.less'],
                tasks: ['less:dev', 'postcss:dev']
            },
            html: {
                files: ['pub/*.html'],
                tasks: ['less:dev', 'postcss:dev']
            },
            css: {
                files: ['pub/css/*.min.css'],
                options: {
                    livereload: true,
                }
            },
            imagemin: {
                files: 'assets/dist/images/**/*.{png,jpg,gif}',
                tasks: ['imagemin']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['less:prod', 'postcss:prod', 'imagemin']);
    grunt.registerTask('dev', ['less:dev', 'postcss:dev', 'imagemin', 'watch']);
};