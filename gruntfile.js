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
					'js/src/*.js'
				],
				dest: 'js/<%= pkg.name %>.src.js'
			}
		},
		jshint: 
		{
			beforeconcat:
			[
				'js/src/*.js'
			],
			afterconcat: ['js/<%= pkg.name %>.src.js']
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
					'js/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
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
		jsdoc: 
		{
			dist: 
			{
				src: ['js/src/**/*.js'],
				options: 
				{
					destination: '../doc',
					template : "node_modules/ink-docstrap/template",
					configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
				}
			}
		},
		watch: 
		{
			files: ['js/src/*.js'],
			tasks: ['default']
		}
	});

	// Load the plugins that provides the tasks.
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-jsdoc');

	// Default task(s).
	grunt.registerTask('default', ['concat', 'jshint','uglify']);
	grunt.registerTask('publish', ['default','copy']);
	grunt.registerTask('doc', ['jsdoc']);
};