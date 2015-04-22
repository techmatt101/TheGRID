var gulp = require('gulp');
var replace = require('gulp-replace');
var shell = require('gulp-shell');
var dts = require('dts-bundle');

var local = process.argv.indexOf('--local') !== -1;

var path = local ? '../' : '../../../';

gulp.task('default', ['compile']);

gulp.task('compile', ['build'],  function() {
    dts.bundle({
        name: 'services',
        main: 'build/index.d.ts',
        prefix: '',
        externals: true
    });

    gulp.src('build/services.d.ts')
        .pipe(replace('/index//', '/'))
        .pipe(gulp.dest('build/'));
});

gulp.task('build', ['update-typings'],  shell.task('tsc index.ts --outDir build/ --target ES5 --module commonjs --declaration'));

gulp.task('update-typings', ['master-control']);

buildAppTypings('master-control', path + 'MasterControl-App/');

function buildAppTypings(appName, appPath) {
    gulp.task(appName + '-shell', shell.task(('(cd ' + appPath + ' && npm install)')));

    gulp.task(appName, [appName + '-shell'], function() {
        dts.bundle({
            name: appName,
            main: appPath + 'build/app.d.ts',
            out: process.cwd() + '/typings/' + appName + '.d.ts',
            prefix: '',
            externals: true
        });
    });
}