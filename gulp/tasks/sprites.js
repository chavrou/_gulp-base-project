var gulp = require('gulp'),
svgSprite = require('gulp-svg-sprite'),
rename = require('gulp-rename'),
del = require('del'),
svg2png = require('gulp-svg2png');

// svgSprite config
var config = {
  shape: {
    spacing: {
      padding: 1
    }
  },
  mode:{
    css: {
      sprite: 'sprite.svg',
      variables: {
        replaceSvgWithPng: function() {
          return function(sprite, render) {
            return render(sprite).split('.svg').join('.png');
          }
        }
      },
      render: {
        css:{
          template: './gulp/templates/sprites.css'
        }
      }
    }
  }
}

// delete old sprites
gulp.task('beginClean', function(){
  return del(['./app/temp/sprite', './app/assets/images/sprites']);
});

// create sprite
gulp.task('createSprite', ['beginClean'], function(){
  return gulp.src('./app/assets/images/icons/**/*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest('./app/temp/sprite/'))
});

// create .png copy
gulp.task('createPngCopy', ['createSprite'], function(){
  return gulp.src('./app/temp/sprite/css/*.svg')
    .pipe(svg2png())
    .pipe(gulp.dest('./app/temp/sprite/css'));
});

// move files to 'app/.../sprites' folder
gulp.task('copySpriteGraphic', ['createPngCopy'], function(){
  return gulp.src('./app/temp/sprite/css/**/*.{svg,png}')
    .pipe(gulp.dest('./app/assets/images/sprites/'))
});

// copy generated .css file to 'app/.../modules' folder
gulp.task('copySpriteCSS', ['createSprite'], function(){
  return gulp.src('./app/temp/sprite/css/*.css')
    .pipe(rename('_sprite.css'))
    .pipe(gulp.dest('./app/assets/styles/modules'));
});

// when every other tasks are completed, delete 'temp/sprite' folder
gulp.task('endClean', ['copySpriteGraphic', 'copySpriteCSS'], function(){
  return del(['./app/temp/sprite']);
});

// Tasks trigger
gulp.task('icons', ['beginClean', 'createSprite', 'createPngCopy', 'copySpriteGraphic', 'copySpriteCSS', 'endClean']);
