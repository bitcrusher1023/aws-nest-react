import * as aws from '@pulumi/aws';
import type * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import * as random from '@pulumi/random';
import camelcase from 'lodash.camelcase';
import kebabcase from 'lodash.kebabcase';

export async function createRDS(vpc: awsx.ec2.Vpc) {
  const rdsConfig = new pulumi.Config('rds');
  const password = new random.RandomPassword('rds-password', {
    length: 16,
    special: false,
  }).result;
  const dbUser = rdsConfig.require('user');
  const namePrefix = kebabcase(pulumi.getStack());
  const subnetGroup = new aws.rds.SubnetGroup(
    `${namePrefix}-rds-subnet`,
    {
      subnetIds: vpc.privateSubnetIds,
    },
    { dependsOn: vpc },
  );
  const database = new aws.rds.Cluster(
    `${namePrefix}-rds`,
    {
      availabilityZones: ['eu-west-2a', 'eu-west-2b', 'eu-west-2c'],
      databaseName: `${camelcase(namePrefix)}`,
      dbSubnetGroupName: subnetGroup.name,
      enableHttpEndpoint: true,
      engine: 'aurora-postgresql',
      engineMode: 'serverless',
      finalSnapshotIdentifier: undefined,
      masterPassword: password,
      masterUsername: dbUser,
      scalingConfiguration: {
        minCapacity: 2,
        secondsUntilAutoPause: 86400 - 1,
      },
      skipFinalSnapshot: true,
    },
    {
      dependsOn: [vpc, subnetGroup],
    },
  );
  return { database, password };
}
