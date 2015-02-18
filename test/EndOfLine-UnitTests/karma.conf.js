module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        browsers : ['PhantomJS'],
        files: [
            'test/**/*.spec.js',
            '../../src/EndOfLine-WebApp/content/scripts/*.js' //TODO: hmmm...
        ]
    });
};