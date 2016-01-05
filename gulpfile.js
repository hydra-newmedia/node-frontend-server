var gulp = require('gulp');
var del = require('del');

gulp.task('default', ['dist']);

gulp.task('dist', function(){
    del('dist/**/*').then(function () {
        gulp.src([
            'bin/**/*',
            'source/**/*',
            'gulp/**/*',
            'node_modules/**/*',
            'config.json',
            'gulpfile.js',
            'package.json'
        ], { base: '.' }).pipe(gulp.dest('dist/container'));
        gulp.src('Dockerfile').pipe(gulp.dest('dist'));
    });
});

require('require-dir')('gulp/');