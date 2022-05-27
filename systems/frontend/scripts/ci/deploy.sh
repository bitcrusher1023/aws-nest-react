#!/bin/bash

set -ex

s3_bucket=${S3_BUCKET}
REACT_APP_BACKEND_HOST=${API_HOST}

REACT_APP_BACKEND_HOST=$VITE_BACKEND_HOST npm run build
aws s3 cp --recursive dist "s3://$s3_bucket/"