const typescript = ["@babel/preset-typescript", {}]
const typescriptPlugins = [    ["@babel/plugin-proposal-decorators", { "legacy": true }],
  "babel-plugin-transform-typescript-metadata",
  ["@babel/plugin-proposal-class-properties"],
]

const commonJSModules = ["@babel/preset-env", {
  "targets": {
    "node": "current",
  },
  "modules": "auto"
}]


const testConfig= {
  "presets": [
    commonJSModules,
    typescript
  ],
  "plugins": typescriptPlugins
}
module.exports = {
  "env": {
    "test": testConfig
  }
}