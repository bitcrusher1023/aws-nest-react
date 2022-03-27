import * as awsx from '@pulumi/awsx';
import * as pulumi from '@pulumi/pulumi';
import kebabcase from 'lodash.kebabcase';
import path from 'path';

const currentDir = path.parse(new URL(import.meta.url).pathname).dir;

export function createECRImage() {
  const namePrefix = kebabcase(pulumi.getStack());
  const image = awsx.ecr.buildAndPushImage(`${namePrefix}-image`, {
    context: path.join(currentDir),
    extraOptions: ['--quiet'],
  });
  return { image };
}
