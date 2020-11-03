var gulp = require('gulp'),
	ts = require('gulp-typescript'),
	merge = require('merge2'),
	source = './src/vignette.ts',
	destination = './dist';

gulp.task('compile', function () {
	var tsResult = gulp.src(source)
		.pipe(ts({
			declaration: true
		}));

	return merge([
		tsResult.dts.pipe(gulp.dest(destination)),
		tsResult.js.pipe(gulp.dest(destination))
	]);
});

gulp.task('default', ['compile']);
