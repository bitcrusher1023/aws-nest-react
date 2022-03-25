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
const { lambdaFunction } = await createLambda(image, {
  rds: database,
  s3Bucket: bucket,
  vpc,
});
const { apigw } = createAPIGateWay(lambdaFunction, cloudFrontDistribution);
await uploadTestIndexFile(bucket, apigw);
export const imageUrl = image.imageValue;
export const ecrRepository = image.repository.urn;
export const databaseHost = database.endpoint;
export const databasePassword = pulumi.unsecret(password);

export const assetEndpoint = pulumi.interpolate`https://${cloudFrontDistribution.domainName}`;
export const appEndpoint = apigw.apiEndpoint;
