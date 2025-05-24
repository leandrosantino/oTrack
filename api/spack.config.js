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
    'node:events',
    'ws'
  ]),
  options: {
    root: '.',
    jsc: {
      baseUrl: __dirname + '/src',
      parser: {
        syntax: "typescript",
        decorators: true,
        tsx: false,
      },
      transform: {
        legacyDecorator: true,
        decoratorMetadata: true,
      },
      // target: "es2022",
      keepClassNames: true,
      externalHelpers: false
    },
    module: {
      type: "es6",
      noInterop: false, // 🔥 Garante que CommonJS seja convertido corretamente
    },
    sourceMaps: true,
    minify: true,
  }
});
