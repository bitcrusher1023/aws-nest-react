import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import path from 'path';

const currentDir = path.parse(new URL(import.meta.url).pathname).dir;

export function createECRImage() {
  const prefixConfig = new pulumi.Config('prefix');
  const namePrefix = prefixConfig.require('name');
  const image = awsx.ecr.buildAndPushImage(`${namePrefix}-image`, {
    context: path.join(currentDir),
  });
  return { image };
}
