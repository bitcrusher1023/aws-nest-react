#!/bin/sh

set -ex
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test

npm run lint:css
npm run lint:js:ci
npx tsc
npx start-server-and-test \
'npx lerna exec --scope "backend" -- NODE_ENV=test bash scripts/server.sh' http-get://localhost:5333/healthz \
'npm run test:ci'
