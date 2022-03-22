const { imports } = require('./import-map.cjs');
const typescript = ["@babel/preset-typescript", {}]
const typescriptPlugins = [    ["@babel/plugin-proposal-decorators", { "legacy": true }],
  "babel-plugin-transform-typescript-metadata",
  ["@babel/plugin-proposal-class-properties"],
]
const {api, apiTestHelper} = {
  api: imports['/@api/'].babel,
  apiTestHelper: imports['/@api-test-helpers/'].babel
}


const moduleAliasPlugin = [
  "module-resolver",
  {
    "root": ["./src"],
    "cwd": "src",
    "alias": {
      [api.key]: api.value,
      [apiTestHelper.key]: apiTestHelper.value
    },
    "extensions": [".cjs"]
  }
]

const commonJSModules = ["@babel/preset-env", {
  "targets": {
    "node": "current",
  },
  "modules": "auto"
}]


module.exports= {
  "exclude": [".*spec.*"],
  "presets": [
    commonJSModules,
    typescript
  ],
  "plugins": [
    ...typescriptPlugins,
    moduleAliasPlugin,
    ["babel-plugin-add-import-extension", { extension: "cjs" }],
  ]
}