module.exports = function( grunt ) {

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

	});

	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['concat']);

};
