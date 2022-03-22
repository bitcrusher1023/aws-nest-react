#!/bin/sh

set -e
npm run build
docker-compose up -d
