gulp = require('gulp')
$ = require('gulp-load-plugins')();

del = require('del')
runSequence = require('run-sequence')

gulp.task 'scripts', ->
  gulp.src('src/analyzerPlugin.coffee')
  .pipe($.include())
  .pipe($.coffee())
  .pipe($.concat('analyzer-plugin.js'))
  .pipe(gulp.dest('dist'))
  .pipe($.rename('analyzer-plugin.min.js'))
  .pipe($.uglify())
  .pipe(gulp.dest('dist'))

gulp.task 'clean', (done) ->
  del [
      'dist/*.js'
    ]
  ,
    done

gulp.task 'default', (done) ->
  runSequence 'clean', 'scripts', done

gulp.task 'watch', (done) ->
  runSequence 'clean', 'default', ->
    gulp.watch('src/**/*.coffee', ['scripts'])
    done()
