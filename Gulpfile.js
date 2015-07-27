/* global require*/
var gulp = require('gulp'),
    connect = require('gulp-connect'),
    historyApiFallback = require('connect-history-api-fallback'),
    inject = require('gulp-inject'),
    wiredep = require('wiredep').stream;

// Servidor web de desarrollo para cambios en tiempo real
// Toma todo el contenido de la carpeta app y lo muestra en http://0.0.0.0:8080
// con la opción livereload permite ver los cambios en tiempo real
gulp.task('connectDev', function() {
  'use strict';
  connect.server({
    root: ['app'],
    port: 8000,
    livereload: true,
    fallback: function() {
      return [historyApiFallback];
    }
  });
});

// Recargar el navegador cuando existan cambios en los ficheros html
gulp.task('html', function() {
  'use strict';
  gulp.src('./app/*.html')
      .pipe(connect.reload());
});


// Recargar el navegador cuando existan cambios en los ficheros css
gulp.task('css', function() {
  'use strict';
  gulp.src('app/stylesheets/*.css')
      .pipe(connect.reload());
});



// Buscar ficheros javascript y css e injectarlos en el layout
gulp.task('inject', function() {
  'use strict';
  var sources = gulp.src(['app/scripts/*.js', 'app/stylesheets/*.css']);

  return gulp.src('index.html', {cwd: 'app'})
      .pipe(inject(sources, {
        read: false,
        relative: true
      }))
      .pipe(gulp.dest('./app'));
});


gulp.task('wiredep', function() {
  'use strict';
  gulp.src('app/index.html')
      .pipe(wiredep({
        directory: 'app/lib'
      }))
      .pipe(gulp.dest('app'));
});


// Tarea que vigila los cambios que se produzcan en el código y lanza las
// tareas relacionadas
gulp.task('watch', function() {
  'use strict';
  gulp.watch(['./app/*.html'], ['html']);
  gulp.watch(['./app/stylesheets/*.css'], ['css', 'inject']);
  gulp.watch(['./app/scripts/*.js'], ['inject']);
  gulp.watch(['./bower.js'], ['wiredep']);
});

gulp.task('default', ['connectDev', 'watch', 'inject', 'wiredep']);
