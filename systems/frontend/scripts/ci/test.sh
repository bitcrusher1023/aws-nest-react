#!/bin/sh

set -ex
npm run lint:css
npm run lint:js:ci
npx tsc
npx start-server-and-test \
'npx lerna exec --scope "backend" -- NODE_ENV=test bash scripts/server.sh' http-get://localhost:5333/healthz \
'npm run test:ci'
