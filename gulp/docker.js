var gulp = require('gulp'),
    argv = require('yargs').argv,
    shell = require('gulp-shell'),
    runSequence = require('run-sequence');

gulp.task('docker:start', function (done) {
    runSequence('docker:build', 'docker:run', done);
});

gulp.task('docker:build', function (done) {
    var containerName = argv.n;
    var fn = shell.task([
        'docker build -t ' + containerName + ' .'
    ], { cwd : '../' });
    return fn(done);
});

gulp.task('docker:run', function (done) {
    var dockerEnvs = '';
    var internalPort = 3000;
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
        'sh container/bin/removeDockerContainer.sh ' + containerName,
        'docker run' + dockerEnvs + ' -p ' + port + ':' + internalPort + ' --name ' + containerName + ' -d ' + containerName
    ], { cwd : '../' });
    return fn(done);
});