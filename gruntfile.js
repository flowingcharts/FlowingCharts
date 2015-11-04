module.exports = function (grunt) 
{
    // Project configuration.
    grunt.initConfig(
    {
        // Fetch the package file.
        // We can reference from this file eg. <%= pkg.name %> <%= pkg.version %>.
        pkg: grunt.file.readJSON('package.json'),

        // Concatenates files.
        concat: 
        {
            options: 
            {
                // Adds a banner displaying the project name, version and date to 'flowingcharts.src.js'.
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
            },
            // Concatenates the javascript source files in 'src/' into a single file called 'dist/flowingcharts.src.js' ('dist/<%= pkg.name %>.src.js').
            dist: 
            {
                src: 
                [
                    'src/**/*.js'
                ],
                dest: 'dist/<%= pkg.name %>.src.js'
            }
        },
        // Detects errors and potential problems in the code.
        jshint: 
        {
            // 'gruntfile.js' This file.
            // 'src/**/*.js' All javascript source files.
            // 'test/**/*.js' All javascript test files.
            all: ['gruntfile.js', 'src/**/*.js', 'test/**/*.js']
        },
        // Minimises code.
        uglify: 
        {
            options: 
            {
                // Adds a banner displaying the project name, version and date to 'flowingcharts.js'.
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */',
                // Creates a source map file for debugging the minimised code 'dist/flowingcharts.map' ('dist/<%= pkg.name %>.map').
                sourceMap: true,
                sourceMapName: "dist/<%= pkg.name %>.map"
            },
            // Minimises the code in 'dist/flowingcharts.src.js' ('dist/<%= pkg.name %>.src.js')
            // and places it in a new file called 'dist/flowingcharts.js' ('dist/<%= pkg.name %>.js').
            build: 
            {
                files: 
                {
                    'dist/<%= pkg.name %>.js': ['dist/<%= pkg.name %>.src.js']
                }
            }
        },
        // Deletes directories.
        clean: 
        {
            // These directories are deleted so that they can be rebuilt when the relevant task is run.
            // Javascript documentation.
            doc: 
            {
                src: ['doc']
            },
            // Test coverage.
            coverage: 
            {
                src: ['test_coverage/']
            },
            // Release.
            release: 
            {
                src: ['release/<%= pkg.version %>/']
            }
        },
        // Copies files/directories.
        copy: 
        {
            // Copies files to a release version directory 'release/<%= pkg.version %>/' (eg 'release/0.1.0/').
            release: 
            {
                files: 
                [
                    // Copies the concatenated javascript source code 'flowingcharts.src.js' and 'flowingcharts.js' to 'release/'.
                    {
                        expand: true, 
                        // Flattens results to a single level so directory structure isnt copied.
                        flatten: true,
                        src: 
                        [
                            'dist/<%= pkg.name %>.js', 
                            'dist/<%= pkg.name %>.src.js'
                        ], 
                        dest: 'release/<%= pkg.version %>/'
                    },
                    // Copies the demos 'demos/', to 'release/<%= pkg.version %>/demos/' (eg 'release/0.1.0/demos/').
                    {
                        expand: true,
                        // Makes the src relative to cwd.
                        cwd: 'demos/',    
                        // Subsequently only includes files within path 'demos/' and its sub-directories.                       
                        src: '**/*',     
                        // This is done so that the dest directory is 'release/0.1.0/demos/' rather than 'release/0.1.0/demos/'                            
                        dest: 'release/<%= pkg.version %>/demos/'
                    },
                    // Copies the javascript source code 'src/', to 'release/<%= pkg.version %>/src/' (eg 'release/0.1.0/src/').
                    {
                        expand: true,
                        cwd: 'src/',
                        src: '**/*',
                        dest: 'release/<%= pkg.version %>/src/'
                    },
                    // Copies the javascript documentation 'doc/', to 'release/<%= pkg.version %>/doc/' (eg 'release/0.1.0/doc/').
                    {
                        expand: true,
                        cwd: 'doc/',
                        src: '**/*',
                        dest: 'release/<%= pkg.version %>/doc/'
                    }
                ]
            },
            // Copies the javascript test files 'test/' to a temporary directory 'test_coverage/test/' for testing coverage.
            coverage: 
            {
                files: 
                [
                    {
                        expand: true,
                        cwd: 'test/',
                        src: '**/*',
                        dest: 'test_coverage/test/'
                    }
                ]
            },
            // Copies distribution files to demo.
            demos: 
            {
                files: 
                [
                    {
                        expand: true, 
                        // Flattens results to a single level so directory structure isnt copied.
                        flatten: true,
                        src: 
                        [
                            'dist/<%= pkg.name %>.js', 
                            'dist/<%= pkg.name %>.src.js'
                        ], 
                        dest: 'demos/'
                    }
                ]
            }
        },
        // Used for test coverage alongside mocha.
        blanket: 
        {
            // In most cases it may be more useful to instrument files before running tests. 
            // This has the added advantage of creating intermediate files that will match the line numbers reported in exception reports. 
            coverage: 
            {
                // Copies the javascript source files 'src/'
                src: ['src/'],
                // to a temporary directory 'test_coverage/src/' for testing coverage.
                dest: 'test_coverage/src/'
            }
        },   
        // Unit testing.
        mochaTest: 
        {
            // Runs unit tests 'test_coverage/test/' on the intermediate javascript source code 'test_coverage/src/'.
            test: 
            {
                options: 
                {
                    reporter: 'spec',
                },
                src: ['test_coverage/test/**/*.js']
            },
            // Creates a test coverage file 'test_coverage/coverage.html'.
            // This file helps highlight areas where more testing is required.
            coverage: 
            {
                options: 
                {
                    reporter: 'html-cov',
                    quiet: true,
                    captureFile: 'test_coverage/coverage.html'
                },
                src: ['test_coverage/test/**/*.js']
            }
        },
        // Creates jsdoc style documentation for javascript files.
        jsdoc: 
        {
            doc: 
            {
                // Generates documentation for the javascript source code 'src/**/*.js'.
                src: ['src/**/*.js'],
                options: 
                {
                    // The generated documentation is placed in 'doc'
                    destination: 'doc',
                    // Specifies a template for the documentation.
                    template : 'node_modules/ink-docstrap/template',
                    // Specifies a configuration for the documentation.
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
                // Adds a banner displaying the project name, version and date to 'flowingcharts.src.js'.
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            browserifyOptions: 
            {
                // Enable source maps that allow you to debug your files separately.
                debug: true
            },
            dist: 
            {
                files: 
                {
                    // Produces a bundled file 'dist/flowingcharts.src.js' ('dist/<%= pkg.name %>.src.js') from the starting point 'src/main.js'.
                    'dist/<%= pkg.name %>.src.js': ['src/main.js']
                }
            }
        },
        watch:
        {
             // '>grunt watch' Runs the default task if changes are made to the javascript source files 'src/**/*.js'.
            files: ['src/**/*.js'],
            tasks: ['default']
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

    // '>grunt lint' Detect errors and potential problems in code.
    grunt.registerTask('lint', ['jshint']); 

    // '>grunt test' Unit testing and test coverage.
    // Test coverage results are copied to 'test_coverage/coverage.html'.
    grunt.registerTask('test', ['clean:coverage', 'copy:coverage', 'blanket:coverage', 'mochaTest']);

    // '>grunt' Check, browserify (concatenate node modules into single file for use in browser) and uglify code.  
    // Also copies bundled source files to demos directory.              
    grunt.registerTask('default', ['lint', 'browserify', 'uglify', 'copy:demos']);    

    // '>grunt doc' Generate jsdoc style code documentation in 'doc'.
    grunt.registerTask('doc', ['clean:doc','jsdoc:doc']);           

    // '>grunt publish' Publish a release version.
    // Runs through all tasks before generating the release files in 'release'
    grunt.registerTask('publish', ['clean:release', 'test', 'default', 'doc', 'copy:release']);      
};           