const { config } = require("@swc/core/spack");
const {dependencies} = require('./package.json');

module.exports = config({
  entry: {
    index: __dirname + "/src/index.ts",
  },
  output: {
    path: __dirname + "/build",
  },
  externalModules: Object.keys(dependencies).concat([
    'ws'
  ]),
  options: {
    root: '.',
    jsc: {
      baseUrl: './src',
      parser: {
        syntax: "typescript",
        decorators: true,
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
      },
      target: "es2022",
      keepClassNames: true,
      externalHelpers: false
    },
    module: {
      type: "commonjs"
    },
    minify: true,
    sourceMaps: true,

  }
});
