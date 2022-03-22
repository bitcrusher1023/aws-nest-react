import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';

export function createVPC() {
  const prefixConfig = new pulumi.Config('prefix');
  const namePrefix = prefixConfig.require('name');
  // Allocate a new VPC with the default settings:
  const vpc = new awsx.ec2.Vpc(`${namePrefix}-vpc`, {
    numberOfAvailabilityZones: 3,
  });

  return { vpc };
}
