import gulp from 'gulp';
import gutil from 'gulp-util';
import sourcemaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import istanbul from 'gulp-istanbul';
import mocha from 'gulp-mocha';

gulp.task('babel', () =>
  gulp.src('./src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('lib'))
);

gulp.task('test', ['babel'], () =>
  gulp.src(['lib/**/*.js'])
    .pipe(istanbul()) // Covering files
    .on('finish', () =>
      gulp.src(['test/**/*.spec.coffee'])
        .pipe(mocha({reporter: 'spec', compilers: 'coffee:coffee-script', timeout: 5000}))
        // Creating the reports after tests run
        .pipe(istanbul.writeReports())
  )
);

gulp.task('default', ['coffee']);
