#!/usr/bin/env bash

set -ex

npx markdownlint-cli2 .
npx eslint --ext .json,.yaml,.yml,.ts,.js --ignore-pattern '!.github/' --ignore-pattern systems/ --ignore-pattern package-lock.json .