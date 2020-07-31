var 	gulp = require('gulp'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	eslint = require('gulp-eslint'),
	plumber = require('gulp-plumber'),
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
		.pipe(plumber())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(sourcemaps.init())
		.pipe(concat('bundle.js'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.js.dest))
		.pipe(uglify())
		.pipe(rename({suffix: '.min'}))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.js.dest))
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
