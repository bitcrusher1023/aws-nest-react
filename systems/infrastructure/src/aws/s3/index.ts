import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import { promises as fs } from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

const currentDir = path.parse(new URL(import.meta.url).pathname).dir;

function publicReadPolicyForBucket(bucketName: string) {
  return JSON.stringify({
    Statement: [
      {
        Action: ['s3:GetObject'],
        Effect: 'Allow',
        Principal: '*',
        Resource: [
          `arn:aws:s3:::${bucketName}/*`, // policy refers to bucket name explicitly
        ],
      },
    ],
    Version: '2012-10-17',
  });
}

export function createS3Bucket() {
  const prefixConfig = new pulumi.Config('prefix');
  const namePrefix = prefixConfig.require('name');
  // Create an AWS resource (S3 Bucket)
  const bucket = new aws.s3.Bucket(`${namePrefix}-bucket`, {
    corsRules: [
      {
        allowedHeaders: ['*'],
        allowedMethods: ['PUT'],
        allowedOrigins: ['*'],
        exposeHeaders: ['ETag'],
        maxAgeSeconds: 3000,
      },
    ],
    website: {
      indexDocument: 'index.html',
    },
  });

  new aws.s3.BucketPolicy('bucketPolicy', {
    bucket: bucket.bucket,
    policy: bucket.bucket.apply(publicReadPolicyForBucket),
  });

  new aws.s3.BucketObject('demo-upload-image', {
    bucket: bucket,
    contentType: 'image/gif',
    key: 'upload/demo.gif',
    source: new pulumi.asset.FileAsset(path.join(currentDir, 'demo.gif')),
  });

  return {
    bucket,
  };
}

export async function uploadTestIndexFile(
  bucket: aws.s3.Bucket,
  api: aws.apigatewayv2.Api,
) {
  const template = Handlebars.compile(
    await fs.readFile(path.join(currentDir, 'index.hbs'), 'utf-8'),
  );

  new aws.s3.BucketObject('demo-index-html', {
    bucket: bucket,
    content: api.apiEndpoint.apply(apiEndpoint =>
      template({ endpoint: apiEndpoint }),
    ),
    contentType: 'text/html',
    key: 'index.html',
  });
}
