import * as pulumi from '@pulumi/pulumi';

import { createAPIGateWay } from './aws/api-gateway.js';
import { createCloudFront } from './aws/cloudfront.js';
import { createECRImage } from './aws/ecr/index.js';
import { createLambda } from './aws/lambda.js';
import { createRDS } from './aws/rds.js';
import { createS3Bucket, uploadTestIndexFile } from './aws/s3/index.js';
import { createVPC } from './aws/vpc.js';

const { vpc } = createVPC();
const { bucket } = createS3Bucket();
const { cloudFrontDistribution } = createCloudFront(bucket);
const { database, password } = await createRDS(vpc);
const { image } = createECRImage();
const { lambdaFunction, lambdaLatestVersionAlias } = await createLambda(image, {
  cloudFrontDistribution,
  rds: database,
  s3Bucket: bucket,
  vpc,
});
const { apigw } = createAPIGateWay(lambdaFunction, cloudFrontDistribution);
await uploadTestIndexFile(bucket, apigw);
export const ECR_REPO = image.repository.repository.repositoryUrl.apply(
  url => url.split('/')[0],
);
export const ECR_IMAGE_NAME = image.repository.repository.name;
export const DATABASE_HOST = database.endpoint;
export const DATABASE_PASSWORD = password;

export const CLOUDFRONT_URL = pulumi.interpolate`https://${cloudFrontDistribution.domainName}`;
export const API_HOST = apigw.apiEndpoint;
export const LAMBDA_FUNCTION_ARN = lambdaFunction.arn;
export const S3_BUCKET = bucket.bucket;
export const LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_ARN =
  lambdaLatestVersionAlias.name;
