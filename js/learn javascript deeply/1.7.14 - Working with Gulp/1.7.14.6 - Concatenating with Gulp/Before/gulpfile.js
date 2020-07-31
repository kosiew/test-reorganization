var 	gulp = require('gulp'),
	connect = require('gulp-connect'),
	paths = {
		js: {
			all: ['./src/js/data.js',
				'./src/js/helpers.js',
				'./src/js/model.js',
				'./src/js/router.js',
				'./src/js/view.js',
				'./src/js/editor.js',
				'./src/js/app.js'],
			dest: './dist/js/'
		}
	};


gulp.task('bundlejs', function(){
	return gulp.src(paths.js.all)
		.pipe(connect.reload());
});

gulp.task('connect',function(){
	connect.server({
		root: './',
		livereload: true
	});
});

gulp.task('watch', function(){
	gulp.watch([paths.js.all, 'index.html'], ['bundlejs']);
});

gulp.task('default', ['connect', 'watch']);
