import imports from './import-map.cjs';
const typescript = ["@babel/preset-typescript", {}]
const typescriptPlugins = [    ["@babel/plugin-proposal-decorators", { "legacy": true }],
  "babel-plugin-transform-typescript-metadata",
  ["@babel/plugin-proposal-class-properties"],
]
const {api, apiTestHelper} = {
  api: imports.imports['/@api/'].babel,
  apiTestHelper: imports.imports['/@api-test-helpers/'].babel
}
const moduleAliasPlugin =   [
  "module-resolver",
  {
    "root": ["./src"],
    "cwd": "src",
    "alias": {
      [api.key]: api.value,
      [apiTestHelper.key]: apiTestHelper.value
    },
    "extensions": [".js"]
  }
]

const esModules = ["@babel/preset-env", {
    "targets": {
      "esmodules": true
    },
    "modules": false
  }]

const config = {
  "presets": [
    esModules, typescript],
  "plugins": [
    ...typescriptPlugins,
    ["babel-plugin-add-import-extension", {extensions: ".js"}],
    moduleAliasPlugin,
  ]
}

export default config