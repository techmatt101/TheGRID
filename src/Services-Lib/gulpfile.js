var gulp = require('gulp');
var replace = require('gulp-replace');
var shell = require('gulp-shell');
var dts = require('dts-bundle');

gulp.task('default', ['services']);

gulp.task('build', shell.task('tsc index.ts --outDir build/ --target ES5 --module commonjs --declaration'));

gulp.task('services', ['build'], function() {
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

gulp.task('update-typings', ['master-control']);

buildAppTypings('master-control', '../MasterControl-App/');

function buildAppTypings(appName, appPath) {
    gulp.task(appName + '-shell', shell.task(('(cd ' + appPath + ' && npm install)')));

    gulp.task(appName, [appName + '-shell'], function() {
        dts.bundle({
            name: appName,
            main: appPath + 'build/app.d.ts',
            out: '../Services-Lib/typings/' + appName + '.d.ts',
            prefix: '',
            externals: true
        });
    });
}