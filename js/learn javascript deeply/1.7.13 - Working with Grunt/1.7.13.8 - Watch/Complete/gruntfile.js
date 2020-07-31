module.exports = function(grunt) {

	var defaults = {
		html: 'index.html',
		sass: {
			all: 'src/sass/**/*.scss',
			main: 'src/sass/style.scss'
		},
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

		sass: {
			dist: {
				files: {
					'dist/css/style.css' : defaults.sass.main
				}
			}
		},

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

		watch: {
			files: [ defaults.html, defaults.sass.all, defaults.js ],
			tasks: ['jshint', 'concat', 'uglify', 'sass']
		}

	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['watch']);

};
