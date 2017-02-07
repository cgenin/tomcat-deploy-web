'use strict';

module.exports = (gulp, config) => {
  const tasks = {
    css: {
      fn: cssTask,
      help: 'Create the css'
    }
  };
  return tasks;

  function cssTask() {
    // const sass = require('gulp-sass');
    const less = require('gulp-less');
    const cssGlobbing = require('gulp-css-globbing');
    const concatCss = require('gulp-concat-css');

    return gulp.src(['client/styles.less'])
      .pipe(cssGlobbing({
        extensions: ['.css', '.less'],
        ignoreFolders: ['../styles'],
        autoReplaceBlock: {
          onOff: true,
          globBlockBegin: 'cssGlobbingBegin',
          globBlockEnd: 'cssGlobbingEnd',
          globBlockContents: '../**/*.less'
        },
        scssImportPath: {
          leading_underscore: false,
          filename_extension: false
        }
      }))
      .pipe(less())
      .pipe(concatCss('bundle.css', {
        rebaseUrls: false
      }))
      .pipe(gulp.dest(config.folders.css));
  }
};
