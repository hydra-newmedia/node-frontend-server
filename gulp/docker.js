var gulp = require('gulp'),
    argv = require('yargs').argv,
    shell = require('gulp-shell'),
    runSequence = require('run-sequence');

var containerName = 'vlm-backend';

gulp.task('docker:start', function (done) {
    runSequence('docker:build', 'docker:run', done);
});

gulp.task('docker:build', function (done) {
    var fn = shell.task([
        'docker build -t ' + containerName + ' .'
    ], { cwd : '../' });
    return fn(done);
});

gulp.task('docker:run', function (done) {
    var dockerEnvs = '';
    var port = argv.p;
    delete argv.p;
    delete argv._;
    delete argv.$0;
    for (var envIdx in argv) {
        dockerEnvs += ' -e ' + envIdx + '="' + argv[envIdx] + '"';
    }
    var fn = shell.task([
        'docker run' + dockerEnvs + ' -p ' + port + ':3000 -d ' + containerName
    ], { cwd : '../' });
    return fn(done);
});