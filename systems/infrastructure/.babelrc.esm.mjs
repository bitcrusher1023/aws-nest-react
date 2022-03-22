const typescript = ["@babel/preset-typescript", {}]

const esModules = ["@babel/preset-env", {
    "targets": {
      "esmodules": true
    },
    "modules": false
  }]



const config = {
  "presets": [
    esModules, typescript],
  "sourceMaps": true,
  "plugins": [    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-class-properties"],
  ]
}

export default config