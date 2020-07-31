module.exports = function(grunt) {

	var defaults = {
		sass: {
			main: 'src/sass/main.scss',
			all: 'src/sass/**/*.scss'
		}
	};

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		sass: {
			dist: {
				files: {
					'dist/style.css': defaults.sass.main
				}
			},
		},

		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['src/js/**/*.js'],
				dest: 'dist/bundle.js'
			}
		},

		uglify: {
			dist: {
				files: {
					'dist/bundle.min.js': '<%= concat.dist.dest %>'
				}
			}
		},

		jshint: {
			files: ['gruntfile.js','<%= concat.dist.src %>'],
				options: {
					globals: {
						console: true,
						module: true
					}
				}
		},

		watch: {
			files: ['<%= jshint.files %>',
					'index.html',
					'src/sass/**/*.scss'],
			tasks: ['jshint', 'concat', 'uglify', 'sass' ],
			options: {
				livereload: {
					host: 'localhost',
					post: 9000,
					reload: true
				}
			}
		},

		connect: {
	        server: {
	            options: {
				port: 9000,
				hostname: 'localhost',
				livereload: true,
				keepalive: true
			  }
	        }
	    }

	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('default', ['watch']);

};
