var gulp = require('gulp'),
    argv = require('yargs').argv,
    shell = require('gulp-shell'),
    runSequence = require('run-sequence');

var imageName = 'http-spa';

gulp.task('docker:start', function (done) {
    runSequence('docker:build', 'docker:run', done);
});

gulp.task('docker:build', function (done) {
    var fn = shell.task([
        'docker build -t ' + imageName + ' .'
    ], { cwd : '../' });
    return fn(done);
});

gulp.task('docker:run', function (done) {
    var dockerEnvs = '';
    var port = argv.p;
    var containerName = argv.n;
    delete argv.p;
    delete argv._;
    delete argv.$0;
    delete argv.n;
    for (var envIdx in argv) {
        dockerEnvs += ' -e ' + envIdx + '="' + argv[envIdx] + '"';
    }
    var fn = shell.task([
        'docker ps | grep ' + containerName + ' | cut -d " " -f1 | xargs docker rm -f',
        'docker run' + dockerEnvs + ' --name ' + containerName
            + ' -p ' + port + ':3000 -d ' + imageName
    ], { cwd : '../' });
    return fn(done);
});