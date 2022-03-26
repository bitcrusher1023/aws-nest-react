import * as aws from '@pulumi/aws';
import type * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

export async function createLambda(
  image: awsx.ecr.RepositoryImage,
  {
    cloudFrontDistribution,
    rds,
    s3Bucket,
    vpc,
  }: {
    cloudFrontDistribution: aws.cloudfront.Distribution;
    rds: aws.rds.Cluster;
    s3Bucket: aws.s3.Bucket;
    vpc: awsx.ec2.Vpc;
  },
) {
  const prefixConfig = new pulumi.Config('prefix');
  const namePrefix = prefixConfig.require('name');

  const role = new aws.iam.Role(`${namePrefix}-lambda-vpc-role`, {
    assumeRolePolicy: aws.iam.assumeRolePolicyForPrincipal({
      Service: 'lambda.amazonaws.com',
    }),
  });
  new aws.iam.RolePolicyAttachment(
    `${namePrefix}-lambda-vpc-role-policy-lambda-vpc-access`,
    {
      policyArn: aws.iam.ManagedPolicy.AWSLambdaVPCAccessExecutionRole,
      role: role,
    },
  );
  new aws.iam.RolePolicyAttachment(
    `${namePrefix}-lambda-vpc-role-policy-lambda-full-access`,
    {
      policyArn: aws.iam.ManagedPolicy.LambdaFullAccess,
      role: role,
    },
  );
  new aws.iam.RolePolicyAttachment(
    `${namePrefix}-lambda-vpc-role-policy-lambda-rds-full-access`,
    {
      policyArn: aws.iam.ManagedPolicy.AmazonRDSFullAccess,
      role: role,
    },
  );
  new aws.iam.RolePolicyAttachment(
    `${namePrefix}-lambda-vpc-role-policy-lambda-s3-full-access`,
    {
      policyArn: aws.iam.ManagedPolicy.AmazonS3FullAccess,
      role: role,
    },
  );

  const lambdaFunction = new aws.lambda.Function(`${namePrefix}-lambda`, {
    environment: {
      variables: {
        APP_ENV: 'production',
        APP_MODE: 'lambda',
        CLOUDFRONT_URL: pulumi.interpolate`https://${cloudFrontDistribution.domainName}`,
        // Insecurity, but this is a demo.
        DATABASE_CONNECTION_URL: pulumi.interpolate`postgres://${
          rds.masterUsername
        }:${rds.masterPassword.apply(pw => encodeURIComponent(pw!))}@${
          rds.endpoint
        }:${rds.port}/${rds.databaseName}`,
        NODE_ENV: 'production',
        S3_ASSET_BUCKET: s3Bucket.bucket,
        S3_REGION: 'eu-west-2',
      },
    },
    imageConfig: {
      commands: ['main-lambda.handler'],
    },
    imageUri: image.imageValue,
    packageType: 'Image',
    role: role.arn,
    timeout: 60,
    vpcConfig: {
      securityGroupIds: rds.vpcSecurityGroupIds,
      subnetIds: vpc.privateSubnetIds,
    },
  });

  return { lambdaFunction };
}
