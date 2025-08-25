const path = require('path');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find(rule => Array.isArray(rule.oneOf)).oneOf;

      // find babel-loader
      const babelLoader = oneOfRule.find(
        rule => rule.loader && rule.loader.indexOf('babel-loader') !== -1
      );

      if (babelLoader) {
        // include admin/src so CRA transpiles the package source
        const adminSrc = path.resolve(__dirname, '../admin/src');
        if (!babelLoader.include) babelLoader.include = [];
        babelLoader.include = Array.isArray(babelLoader.include)
          ? babelLoader.include.concat([adminSrc])
          : [babelLoader.include, adminSrc];

        // Ensure jsx is supported for external files by adding preset-react
        try {
            const presetReact = require.resolve('@babel/preset-react');
            if (!babelLoader.options) babelLoader.options = {};
            if (!Array.isArray(babelLoader.options.presets)) babelLoader.options.presets = [];
            // Ensure we add the preset as an array with the automatic runtime option
            const hasPreset = babelLoader.options.presets.some(p => {
              try {
                // p can be a string path or an array [path, opts]
                if (Array.isArray(p)) return require.resolve(p[0]) === presetReact;
                return require.resolve(p) === presetReact;
              } catch {
                return false;
              }
            });
            if (!hasPreset) {
              // push as [presetPath, { runtime: 'automatic' }] which babel-loader accepts
              babelLoader.options.presets.push([presetReact, { runtime: 'automatic' }]);
            }

            // also add a transform plugin as a fallback in case preset application path differs
            try {
              const transformReactJsx = require.resolve('@babel/plugin-transform-react-jsx');
              if (!Array.isArray(babelLoader.options.plugins)) babelLoader.options.plugins = [];
              const hasPlugin = babelLoader.options.plugins.some(pl => {
                try {
                  if (Array.isArray(pl)) return require.resolve(pl[0]) === transformReactJsx;
                  return require.resolve(pl) === transformReactJsx;
                } catch { return false; }
              });
              if (!hasPlugin) {
                babelLoader.options.plugins.push([transformReactJsx, { runtime: 'automatic' }]);
              }
            } catch (e) {
              // noop - plugin not installed; preset should handle JSX
            }
        } catch (e) {
          // if preset not found, let CRA's default pipeline handle it; no-op
        }
      }

      return webpackConfig;
    }
  }
};
