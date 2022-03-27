import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import kebabcase from 'lodash.kebabcase';

export function createVPC() {
  const namePrefix = kebabcase(pulumi.getStack());
  // Allocate a new VPC with the default settings:
  const vpc = new awsx.ec2.Vpc(`${namePrefix}-vpc`, {
    numberOfAvailabilityZones: 3,
    subnets: [{ type: 'private' }],
  });

  return { vpc };
}
