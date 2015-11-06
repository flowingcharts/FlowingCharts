module.exports = function (grunt) 
{
    // Project configuration.
    grunt.initConfig(
    {
        // Fetch the package file.
        // We can use properties of this file in our code eg <%= pkg.name %> <%= pkg.version %>.
        pkg: grunt.file.readJSON('package.json'),

        // Concatenates and bundles the JavaScript module files in 'src/' into 'gen_dist/<%= pkg.name %>.src.js'.
        // Adds a banner displaying the project name, version and date to 'gen_dist/<%= pkg.name %>.src.js'.
        concat: 
        {
            options: 
            {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            dist: 
            {
                src: 
                [
                    'src/**/*.js'
                ],
                dest: 'gen_dist/<%= pkg.name %>.src.js'
            }
        },
        // Detects errors and potential problems in the JavaScript module and test files.
        // 'gruntfile.js' This file.
        // 'src/**/*.js' The JavaScript module files.
        // 'test/**/*.js' The JavaScript test files.
        jshint: 
        {
            all: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },
        // Minimises the JavaScript source code file 'gen_dist/<%= pkg.name %>.src.js' into 'gen_dist/<%= pkg.name %>.js'.
        // Adds a banner displaying the project name, version and date to the minimised file.
        // Creates a source map file 'gen_dist/<%= pkg.name %>.map' for debugging the minimised code file.
        uglify: 
        {
            options: 
            {
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                /*sourceMap: true,
                sourceMapName: "gen_dist/<%= pkg.name %>.map"*/
            },
            build: 
            {
                files: 
                {
                    'gen_dist/<%= pkg.name %>.js': ['gen_dist/<%= pkg.name %>.src.js']
                }
            }
        },
        // Deletes directories.
        clean: 
        {
            // Deletes JavaScript API documentation.
            doc: {src: ['gen_doc']},
            // Deletes test coverage.
            coverage: {src: ['gen_test_coverage/']},
            // Deletes release.
            release: {src: ['gen_release/<%= pkg.version %>/']},
            // Deletes distribution.
            dist: {src: ['gen_dist/']}
        },
        // Copies files/directories.
        copy: 
        {
            // Copies files to a release directory 'gen_release/<%= pkg.version %>/'.
            release: 
            {
                files: 
                [
                    // Copies the JavaScript source file 'gen_dist/<%= pkg.name %>.js' and 
                    // minimised file 'gen_dist/<%= pkg.name %>.src.js' to 'gen_release/'.
                    {
                        expand: true, 
                        flatten: true, // Flattens results to a single level so directory structure isnt copied.
                        src: 
                        [
                            'gen_dist/<%= pkg.name %>.js', 
                            'gen_dist/<%= pkg.name %>.src.js'
                        ], 
                        dest: 'gen_release/<%= pkg.version %>/'
                    },
                    // Copies the JavaScript module files 'src/', to 'gen_release/<%= pkg.version %>/src/'.
                    {
                        expand: true,
                        cwd: 'src/', // Makes the src relative to cwd so that the full file path is not copied into release.    
                        src: '**/*',
                        dest: 'gen_release/<%= pkg.version %>/src/'
                    },
                    // Copies the JavaScript API documentation 'gen_doc/', to 'gen_release/<%= pkg.version %>/doc/'.
                    {
                        expand: true,
                        cwd: 'gen_doc/',
                        src: '**/*',
                        dest: 'gen_release/<%= pkg.version %>/doc/'
                    }
                ]
            },
            // Copies the JavaScript test files 'test/' to 'gen_test_coverage/test/' for testing coverage.
            coverage: 
            {
                files: 
                [
                    {
                        expand: true,
                        cwd: 'test/',
                        src: '**/*',
                        dest: 'gen_test_coverage/test/'
                    }
                ]
            }
        },
        // Used for test coverage alongside mocha.
        // Copies the JavaScript module files 'src/' to 'gen_test_coverage/src/' for testing coverage.
        blanket: 
        {
            coverage: 
            {
                src: ['src/'],
                dest: 'gen_test_coverage/src/'
            }
        },   
        // Unit testing.
        mochaTest: 
        {
            // Runs unit tests 'gen_test_coverage/test/' on the JavaScript module files in 'gen_test_coverage/src/'.
            test: 
            {
                options: 
                {
                    reporter: 'spec',
                },
                src: ['gen_test_coverage/test/**/*.js']
            },
            // Creates a test coverage file 'gen_test_coverage/coverage.html'.
            // This file helps highlight areas where more testing is required.
            coverage: 
            {
                options: 
                {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'gen_test_coverage/coverage.html'
                },
                src: ['gen_test_coverage/test/**/*.js']
            }
        },
        // Generates documentation for the JavaScript module files 'src/**/*.js' in 'gen_doc'.
        // Uses template and config files from ink-docstrap.
        jsdoc: 
        {
            doc: 
            {
                src: ['src/**/*.js'],
                options: 
                {
                    destination: 'gen_doc',
                    template : 'node_modules/ink-docstrap/template',
                    configure : 'node_modules/ink-docstrap/template/jsdoc.conf.json'
                }
            }
        },
        // Browserify lets you require('modules') in the browser by bundling up all of your dependencies.
        // It will recursively analyze all the require() calls in your app in order 
        // to build a bundle you can serve up to the browser in a single <script> tag.
        browserify: 
        {
            options: 
            {
                // Adds a banner displaying the project name, version and date to 'gen_dist/<%= pkg.name %>.src.js'.
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                browserifyOptions: 
                {
                    // Enable source map that allow you to debug your files separately.
                    // browserify generates inline source maps as a comment at the bottom of 'gen_dist/<%= pkg.name %>.src.js'.
                    debug: true
                }
            },
            dist: 
            {
                files: 
                {
                    // Generates a bundled file 'gen_dist/<%= pkg.name %>.src.js' from the starting point 'src/main.js'.
                    'gen_dist/<%= pkg.name %>.src.js': ['src/main.js']
                }
            }
        },
        // Processes and copies the demo files 'demos/', to 'gen_release/<%= pkg.version %>/demos/'.
        // Adds a banner to each file displaying the project name, version and date to 'gen_dist/<%= pkg.name %>.src.js'.
        // Adds a banner to each file displaying the project name, version and date to 'gen_dist/<%= pkg.name %>.src.js'.
        // Replaces 
        // <script type="text/javascript" src="../../gen_dist/flowingcharts.src.js"></script>
        // with
        // <script type="text/javascript" src="../../flowingcharts.js"></script>
        processhtml: 
        {
            options:
            {
                data: 
                {
                    banner: '<!-- <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> -->'
                }
            },
            dist: 
            {

                files: 
                [
                    {
                        expand: true,   
                        cwd: 'demos/', 
                        src: ['**/*.html'],
                        dest: 'gen_release/<%= pkg.version %>/demos/',
                        ext: '.html'
                    }
                ]
            }
        },
        watch:
        {
            // '>grunt watch' Runs the 'build' task if changes are made to the JavaScript source files 'src/**/*.js'.
            // Enable by typing '>grunt watch' into a command prompt.
            files: ['src/**/*.js'],
            tasks: ['build']
        }
    });

    // Load the plugins that provide the tasks.
    grunt.loadNpmTasks('grunt-blanket');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-processhtml');

    // Tasks that can be run from the command line.
    // Open command prompt in this directory (shift + right click > Open command window here) to run tasks.

    // '>grunt doc' 
    // Generate API documentation in 'gen_doc'. 
    grunt.registerTask('doc', ['clean:doc','jsdoc:doc']);           

    // '>grunt build' 
    // Used for a quick build during development.
    grunt.registerTask('build', ['clean:dist', 'jshint', 'browserify', 'uglify']);      

    // '>grunt test' 
    // Carries out unit testing on the JavaScript module files and generates a test coverage file at 'gen_test_coverage/coverage.html'.
    grunt.registerTask('test', ['clean:coverage', 'copy:coverage', 'blanket:coverage', 'mochaTest']);

    // '>grunt publish' 
    // Publishes a release version to 'gen_release/<%= pkg.version %>/'.
    grunt.registerTask('publish', ['clean:release', 'doc', 'copy:release', 'processhtml']);      

    // '>grunt' 
    // Run this after installation to generate 'gen_dist', 'gen_doc', 'gen_release' and 'gen_test_coverage' directories.              
    grunt.registerTask('default', ['build', 'test', 'publish']);    
};           