// TODO: This file was created by bulk-decaffeinate.
// Sanity-check the conversion and remove this comment.
// Load all required libraries.
import gulp from 'gulp';
import gutil from 'gulp-util';
import coffee from 'gulp-coffee';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';

gulp.task('coffee', () =>
  gulp.src('./src/**/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./lib/'))
);

gulp.task('test', ['coffee'], () =>
  gulp.src(['lib/**/*.js'])
    .pipe(istanbul()) // Covering files
    .on('finish', () =>
      gulp.src(['test/**/*.spec.coffee'])
        .pipe(mocha({reporter: 'spec', compilers: 'coffee:coffee-script', timeout: 5000}))
        .pipe(istanbul.writeReports())
  )
); // Creating the reports after tests run

gulp.task('default', ['coffee']);
