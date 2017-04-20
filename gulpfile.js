var gulp = require('gulp');
var sass = require('gulp-sass');
 
gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});
 
gulp.task('watch', ['sass'], function () {
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass']);