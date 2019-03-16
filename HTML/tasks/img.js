const gulp = require('gulp');
// with Promise
module.exports = function () {
  gulp.task('img', function() {
    return Promise.all([
      new Promise( function(resolve, reject){
        gulp.src(['src/**/images/*.{png,jpg,gif}'])
          .pipe(gulp.dest('render'))
          .on('end', resolve)
      })
    ]).then( function () {
      console.log('task img ok...');
      // gulp.start('slim');
    });
  })
}