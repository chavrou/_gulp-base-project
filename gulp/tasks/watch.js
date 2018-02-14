var gulp = require('gulp'),
watch = require('gulp-watch'),
browserSync = require('browser-sync').create();

// watch
gulp.task('watch', function (){
  browserSync.init({
    notify: false, //remove top-right black notification
    server: {
      baseDir: "app"
    }
  });
  watch('./app/**/*.html', function(){
    browserSync.reload();
  });
  watch('./app/assets/styles/**/*.css', function(){
    gulp.start('cssInject');
  });
  watch('./app/assets/scripts/**/*.js', function(){
    gulp.start('scriptsRefresh');
  });
});

// refresh browser when .css files is save
// 'styles' task as dependencie (wait till task is complete)
gulp.task('cssInject', ['styles'] , function(){
  return gulp.src('./app/temp/styles/styles.css')
  .pipe(browserSync.stream());
});

// refresh browser when .js files is save
// 'script' task as dependencie (wait till task is complete)
gulp.task('scriptsRefresh', ['scripts'], function(){
  browserSync.reload();
});
