#!/bin/sh

set -ex
npm run lint
npx tsc
npm run build:test
npm run test:ci