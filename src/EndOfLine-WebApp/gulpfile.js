var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var chalk = require('chalk');

var isProduction = ($.util.env.dev || $.util.env.debug ? false : true);
var isDebug = !isProduction;

$.util.log('Environment: ' + chalk.inverse.bold(isProduction ? 'PRODUCTION' : 'DEBUG'));

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

gulp.task('clean', del.bind(null, ['content/**/*', 'build/**/*']));

gulp.task('build', ['server', 'styles', 'scripts', 'bowerScripts', 'images', 'fonts', 'other'], function() {
    if (isProduction) {
        gulp.start('size');
    }
});

gulp.task('size', function() {
    return gulp.src('content/**/*')
        .pipe($.size({ title: 'Build size total for', showFiles: true, gzip: true }));
});

gulp.task('watch', ['build'], function() {
    gulp.watch('styles/**/*.less', ['styles']);
    gulp.watch('scripts/**/*.ts', ['scripts']);
});

//===================================================//

gulp.task('server', function() {
    return gulp.src(['**/*.ts', '!node_modules/**', '!scripts/**'])
        .pipe($.typescript({
            target: 'ES5'
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('styles', function() {
    var bowerResolve = require('less-plugin-bower-resolve');
    return gulp.src('styles/*.less')
        .pipe($.if(isDebug, $.sourcemaps.init()))
        .pipe($.less({ plugins: [bowerResolve], lint: isDebug }))
        .pipe($.autoprefixer())
        .pipe($.if(isDebug, $.sourcemaps.write()))
        .pipe($.if(isProduction, $.groupCssMediaQueries())) //no support for source maps
        .pipe($.if(isProduction, $.cleancss({ advanced: true })))
        .pipe(gulp.dest('content/styles'));
});

gulp.task('scripts', function() {
    return gulp.src('scripts/**/*.ts')
        .pipe($.if(isDebug, $.sourcemaps.init()))
        .pipe($.typescript({
            sortOutput: true,
            target: 'ES5'
        }))
        .pipe($.concat('app.js'))
        .pipe($.if(isProduction, $.uglify()))
        .pipe($.if(isDebug, $.sourcemaps.write()))
        .pipe(gulp.dest('content/scripts'));
});

gulp.task('images', function() {
    return gulp.src('images/**/*.{png,jpg,svg}')
        .pipe(gulp.dest('content/images'));
});

gulp.task('fonts', function() {
    return gulp.src('fonts/*/*.{woff,woff2}')
        .pipe(gulp.dest('content/fonts'));
});

gulp.task('other', function() {
    return gulp.src('favicon.ico')
        .pipe(gulp.dest('content'));
});

gulp.task('bowerScripts', function() {
    return gulp.src('bower_components/qwest/qwest.min.js')
        .pipe(gulp.dest('content/scripts'));
});
