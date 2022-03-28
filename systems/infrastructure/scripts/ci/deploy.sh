#!/bin/bash

set -ex

npm run build
pulumi up
PULUMI_CONFIG_PASSPHRASE= pulumi stack output --json > tmp.json
node ./bin/github-actions.js
rm tmp.json