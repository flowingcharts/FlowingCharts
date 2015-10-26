/*
Setting up grunt for flowingcharts

Download and install Node
https://nodejs.org/en/

Grunt
http://gruntjs.com/getting-started

1. Install Node from https://nodejs.org/en/

2. Put the grunt command in your system path, allowing it to be run from any directory
To start a command prompt as an administrator
Click Start
In the Start Search box, type cmd, and then press CTRL+SHIFT+ENTER.
> npm install -g grunt-cli

3. Add the following files to the root directory of your project
package.json
gruntfile.js

4. Install project dependencies with npm install
Open command prompt in the root directory of your project (shift + right click > Open command window here)
eg.
>npm install grunt --save-dev
>npm install grunt-contrib-concat --save-dev
>npm install grunt-jsdoc --save-dev

5. Run the grunt tasks (see bottom of file)

6. http://stackoverflow.com/questions/23125338/how-do-i-use-browserify-with-external-dependencies

add to package.json:

"browserify": {
	"transform": [ "browserify-shim" ]
},
"browserify-shim": {
	"jQuery": "global:jQuery"
},

7. Include '/* jshint browserify: true */ /*at top of each js file to stop commonjs modules causing errors 
*/

module.exports = function (grunt) 
{
	// Project configuration.
	grunt.initConfig(
	{
		pkg: grunt.file.readJSON('package.json'),
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
					'js/src/**/*.js'
				],
				dest: 'js/<%= pkg.name %>.src.js'
			}
		},
		jsonlint: 
		{
			sample: 
			{
				src: ['package.json']
			}
		},
		jshint: 
		{
			all: ['gruntfile.js', 'js/src/**/*.js']
		},
		qunit: 
		{
			files: ['js/test/**/*.html']
		},
		uglify: 
		{
			options: 
			{
				banner: '/*! <%= pkg.name %> v<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */',
				sourceMap: true,
				sourceMapName: "js/<%= pkg.name %>.map"
			},
			build: 
			{
				files: 
				{
					'js/<%= pkg.name %>.js': ['js/<%= pkg.name %>.src.js']
				}
			}
		},
		copy: 
		{
			main: 
			{
				files: 
				[
					{
						expand: true, 
						flatten: true, 
						src: 
						[
							'js/<%= pkg.name %>.js', 
							'js/<%= pkg.name %>.src.js', 
							'js/<%= pkg.name %>.map.js', 
						], 
						dest: 'release/<%= pkg.version %>/'
					},
					{
						expand: true,
						cwd: 'js/demos/',
						src: '**/*',
						dest: 'release/<%= pkg.version %>/demos/'
					},
					{
						expand: true,
						cwd: 'js/src/',
						src: '**/*',
						dest: 'release/<%= pkg.version %>/src/'
					},
					{
						expand: true,
						cwd: 'js/doc/',
						src: '**/*',
						dest: 'release/<%= pkg.version %>/doc/'
					}
				]
			},
		},
		clean: ['./doc'],
		jsdoc: 
		{
			dist: 
			{
				src: ['js/src/**/*.js'],
				options: 
				{
					destination: './doc',
					template : 'node_modules/ink-docstrap/template',
					configure : 'node_modules/ink-docstrap/template/jsdoc.conf.json'
				}
			}
		},
		browserify: 
		{
			browserifyOptions: 
			{
				debug: true
			},
			dist: 
			{
				files: 
				{
					'js/<%= pkg.name %>.src.js': ['js/src/main.js']
				}
			}
		},
		watch: // '>grunt watch' Watches for file changes and runs grunt.
		{
			files: ['js/src/**/*.js'],
			tasks: ['default']
		}
	});

	// Load the plugins that provides the tasks.
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');
	grunt.loadNpmTasks('grunt-jsonlint');

	// To run tasks open command prompt in this directory (shift + right click > Open command window here) and type the task.
	// Default task(s).
	//grunt.registerTask('test', ['qunit', 'jsonlint', 'jshint']); 	// '>grunt test' 		Detect errors and potential problems in code.
	grunt.registerTask('test', ['jsonlint', 'jshint']); 			// '>grunt test' 		Detect errors and potential problems in code.
	//grunt.registerTask('default', ['concat', 'test','uglify']);	// '>grunt' 			Concatenate, check and uglify code.
	grunt.registerTask('default', ['browserify']);			// '>grunt' 			Concatenate, check and uglify code.		
	grunt.registerTask('publish', ['default','copy']); 				// '>grunt publish' 	Publish a release version.
	grunt.registerTask('doc', ['clean','jsdoc']);					// '>grunt doc'  		Generate code documentation
};