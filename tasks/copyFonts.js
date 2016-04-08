'use strict';

module.exports = (gulp, config) => {
  const tasks = {
    'copy-fonts': {
      fn: copyFontsTask,
      help: 'Copy the fonts files'
    }
  };
  return tasks;

  function copyFontsTask() {
    config.folders.fontsSrc.forEach((d) => gulp.src(d + '/**/*')
      .pipe(gulp.dest(config.folders.fontsBuild)));
  }
};
