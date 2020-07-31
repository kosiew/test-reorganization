module.exports = function(grunt) {

	var defaults = {
		js: ['src/js/data.js',
			'src/js/helpers.js',
			'src/js/model.js',
			'src/js/router.js',
			'src/js/view.js',
			'src/js/editor.js',
			'src/js/app.js']
	};

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: [defaults.js],
				dest: 'dist/js/bundle.js'
			}
		},

		uglify: {
			dist: {
				files: {
					'dist/js/bundle.min.js': '<%= concat.dist.dest %>'
				}
			}
		},

		jshint: {
			files: ['gruntfile.js', '<%= concat.dist.src %>'],
				options: {
					globals: {
						console: true,
						module: true
					}
				}
		},

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
