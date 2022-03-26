# File upload

- Status: accept

## Context and Problem Statement

I want to upload file to S3 bucket by API.

## Decision Drivers <!-- optional -->

- Support AWS lambda
- Easily to set up

## Considered Options

- pre-signed URL for upload s3
- Adjust graphql-upload to support upload file in lambda
- REST endpoint for upload file

## Decision Outcome

- pre-signed URL for upload s3

Ref:

[Open issue on graphql-upload](https://github.com/jaydenseric/graphql-upload/issues/155)

[Open issue on express multer](https://github.com/expressjs/multer/issues/770)

[AWS serverless upload file](https://www.youtube.com/watch?v=mw_-0iCVpUc)
