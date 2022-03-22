#!/bin/sh

set -ex
npm run lint:ci
npx tsc
npm run test:ci