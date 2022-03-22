import * as aws from '@pulumi/aws';
import type * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

export async function createLambda(
  image: awsx.ecr.RepositoryImage,
  {
    rds,
    vpc,
  }: {
    rds: aws.rds.Cluster;
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

  const lambdaFunction = new aws.lambda.Function(`${namePrefix}-lambda`, {
    environment: {
      variables: {
        DATABASE_CONNECTION_URL: pulumi.interpolate`postgres://${
          rds.masterUsername
        }:${rds.masterPassword.apply(pw => encodeURIComponent(pw!))}@${
          rds.endpoint
        }:${rds.port}/${rds.databaseName}`,
      },
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
