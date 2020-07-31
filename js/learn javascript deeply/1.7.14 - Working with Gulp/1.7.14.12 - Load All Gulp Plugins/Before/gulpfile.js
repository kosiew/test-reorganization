var 	gulp = require('gulp'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	sourcemaps = require('gulp-sourcemaps'),
	eslint = require('gulp-eslint'),
	plumber = require('gulp-plumber'),
	sass = require('gulp-sass'),
	paths = {
		html: {
			all: '*.html'
		},
		sass: {
			main: './src/sass/style.scss',
			all: './src/sass/**/*.scss',
			dest: './dist/css/'
		},
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

gulp.task('bundlehtml', function(){
	return gulp.src(paths.html.all)
		.pipe(connect.reload());
});
gulp.task('bundlesass', function(){
	return gulp.src(paths.sass.main)
		.pipe(plumber())
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(paths.sass.dest))
		.pipe(connect.reload());
});

gulp.task('bundlejs', function(){
	return gulp.src(paths.js.all)
		.pipe(plumber())
		// .pipe(eslint())
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
	gulp.watch([paths.html.all], ['bundlehtml'] );
	gulp.watch([paths.js.all], ['bundlejs']);
	gulp.watch([paths.sass.all], ['bundlesass']);
});

gulp.task('default', ['connect', 'watch']);
