#!/bin/bash

set -ex

npm run build
pulumi stack select code-test/dev
pulumi up
PULUMI_CONFIG_PASSPHRASE= pulumi stack output --json > tmp.json
node ./bin/github-actions.js
rm tmp.json