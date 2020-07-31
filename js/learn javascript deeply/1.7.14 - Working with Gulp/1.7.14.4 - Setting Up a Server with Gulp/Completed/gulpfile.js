var 	gulp = require('gulp'),
	connect = require('gulp-connect');


gulp.task('demo', function(){
	console.log( 'Demo working' );
});

gulp.task('connect', function(){
	connect.server();
});

gulp.task('default', ['connect','demo']);
