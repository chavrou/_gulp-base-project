var gulp = require('gulp'),
modernizr = require('gulp-modernizr');


gulp.task('modernizr', function() {
  return gulp.src(['./app/assets/styles/**/*.css', './app/assets/scripts/**/*.js'])
    .pipe(modernizr({
      'options': [
        "setClasses" // create custom 'modernizr' file with minimum needed
      ]
    }))
    .pipe(gulp.dest('./app/temp/scripts/'));
});
