var gulp = require('gulp'),
imagemin = require('gulp-imagemin'),
del = require('del'),
usemin = require('gulp-usemin'),
rev = require('gulp-rev'),
cssnano = require('gulp-cssnano'),
uglify = require('gulp-uglify'),
browserSync = require('browser-sync').create();

// open project in browser
gulp.task('previewDist', function() {
  browserSync.init({
    notify: false, //remove top-right black notification
    server: {
      baseDir: "dist"
    }
  });
});

// delete dist folder to clean folder
// trigger a fresh 'icons' automation before executing this task
gulp.task('deleteDistFolder', ['icons'], function() {
  return del('./dist');
});

// move other files to dist
gulp.task('copyGeneralFiles', ['deleteDistFolder'], function() {
  var pathsToCopy = [
    './app/**/*',
    '!./app/*.html',
    '!./app/assets/images/**',
    '!./app/assets/styles/**',
    '!./app/assets/scripts/**',
    '!./app/temp',
    '!./app/temp/**'
  ]
  return gulp.src(pathsToCopy)
    .pipe(gulp.dest('./dist'))
});

// image optimization
gulp.task('optimizeImages', ['deleteDistFolder'], function() {
  return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
    .pipe(imagemin({
      progressive: true,
      interlaced: true,
      multipass: true
    }))
    .pipe(gulp.dest('./dist/assets/images'))
});

// usemin trigger
gulp.task('useminTrigger', ['deleteDistFolder'], function() {
  gulp.start("usemin");
});

// files optimization
// trigger a fresh 'styles' & 'scripts' automation before executing this task
gulp.task('usemin', ['styles', 'scripts'], function() {
  return gulp.src('./app/index.html')
    .pipe(usemin({
      css: [function() {
        return rev(); //revision file
      }, function() {
        return cssnano(); //minify file
      }],
      js: [function() {
        return rev(); //revision file
      }, function() {
        return uglify(); //minify file
      }]
    }))
    .pipe(gulp.dest('./dist'));
});

// Tasks trigger
gulp.task('build', ['deleteDistFolder', 'copyGeneralFiles', 'optimizeImages', 'useminTrigger']);
