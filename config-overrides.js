const {injectBabelPlugin} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

/*
@info-color             : @blue-6;
@success-color          : @green-6;
@processing-color       : @primary-color;
@error-color            : @red-6;
@highlight-color        : @red-6;
@warning-color          : @gold-6;
@normal-color           : #E6E6E6;
*/

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', {libraryName: 'antd', style: true}], config);  // change importing css to less

  config = rewireLess.withLoaderOptions({
    modifyVars: {
      "@primary-color": "#248888",
      '@layout-header-background': '#061a5f'
      /*  "@normal-color": "#E6E6E6" ,
        "@error-color": "#E7475E" ,
        "@highlight-color": "#E7475E" ,
        "@body-background": "#E6E6E6" ,
        "@info-color": "#F0D879"*/
    },
  })(config, env);

  return config;
};
