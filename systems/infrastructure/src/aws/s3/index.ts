import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
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
    website: {
      indexDocument: 'index.html',
    },
  });
  new aws.s3.BucketObject('index.html', {
    bucket: bucket,
    contentType: 'text/html',
    source: new pulumi.asset.FileAsset(path.join(currentDir, 'index.html')),
  });

  new aws.s3.BucketPolicy('bucketPolicy', {
    bucket: bucket.bucket,
    policy: bucket.bucket.apply(publicReadPolicyForBucket),
  });

  return {
    bucket,
  };
}
