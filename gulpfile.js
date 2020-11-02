var gulp = require('gulp'),
	rename = require('gulp-rename'),
	ts = require('gulp-typescript'),
	wrap = require('gulp-wrap'),
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

gulp.task('compileAMD', function () {
	return gulp.src(source)
		.pipe(wrap('<%= contents %> export = Vignette;'))
		.pipe(ts({module: 'amd'})).js
		.pipe(rename(function (path) {
			path.basename += '.amd';
		}))
		.pipe(gulp.dest(destination));
});

gulp.task('compileCommonJS', function () {
	return gulp.src(source)
		.pipe(wrap('<%= contents %> export = Vignette;'))
		.pipe(ts({module: 'commonjs'})).js
		.pipe(rename(function (path) {
			path.basename += '.cjs';
		}))
		.pipe(gulp.dest(destination));
});

gulp.task('default', ['compile', 'compileAMD', 'compileCommonJS']);
