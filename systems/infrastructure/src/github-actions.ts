import type * as pulumi from '@pulumi/pulumi';
import * as crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import YAML from 'yaml';

const currentDir = path.parse(new URL(import.meta.url).pathname).dir;

interface GithubActionWorkflowDeploymentEnvironmentVariablesInput {
  API_HOST: string;
  ECR_IMAGE_NAME: string;
  ECR_REPO: string;
  LAMBDA_FUNCTION_ARN: string;
  LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_ARN: string;
  S3_BUCKET: string;
}

function getFilePathOnGithubWorkflowFolder(fileName: string) {
  return path.join(
    currentDir,
    '..',
    '..',
    '..',
    '.github',
    'workflows',
    fileName,
  );
}

async function readFrontendDeploymentYaml() {
  return YAML.parse(
    await fs.readFile(
      getFilePathOnGithubWorkflowFolder('deploy-frontend.yml'),
      'utf-8',
    ),
  );
}

async function readBackendDeploymentYaml() {
  return YAML.parse(
    await fs.readFile(
      getFilePathOnGithubWorkflowFolder('deploy-backend.yml'),
      'utf-8',
    ),
  );
}

async function updateFrontendDeploymentYaml({
  API_HOST,
  S3_BUCKET,
}: {
  API_HOST: string;
  S3_BUCKET: string;
}) {
  const frontendDeploymentConfig = await readFrontendDeploymentYaml();
  await fs.writeFile(
    getFilePathOnGithubWorkflowFolder('deploy-frontend.yml'),
    YAML.stringify({
      ...frontendDeploymentConfig,
      env: {
        ...frontendDeploymentConfig.env,
        API_HOST,
        S3_BUCKET,
      },
    }),
  );
}

async function updateBackendDeploymentYaml({
  ECR_IMAGE_NAME,
  ECR_REPO,
  LAMBDA_FUNCTION_ARN,
  LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_NAME,
}: {
  ECR_IMAGE_NAME: string;
  ECR_REPO: string;
  LAMBDA_FUNCTION_ARN: string;
  LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_NAME: string;
}) {
  const backendDeploymentConfig = await readBackendDeploymentYaml();
  await fs.writeFile(
    getFilePathOnGithubWorkflowFolder('deploy-backend.yml'),
    YAML.stringify({
      ...backendDeploymentConfig,
      env: {
        ...backendDeploymentConfig.env,
        ECR_IMAGE_NAME,
        ECR_REPO,
        LAMBDA_FUNCTION_ARN,
        LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_NAME,
      },
    }),
  );
}

const githubActionWorkFlowEnvironmentProvider: pulumi.dynamic.ResourceProvider =
  {
    async create(
      inputs: GithubActionWorkflowDeploymentEnvironmentVariablesInput,
    ) {
      await updateFrontendDeploymentYaml({
        API_HOST: inputs.API_HOST,
        S3_BUCKET: inputs.S3_BUCKET,
      });
      await updateBackendDeploymentYaml({
        ECR_IMAGE_NAME: inputs.ECR_IMAGE_NAME,
        ECR_REPO: inputs.ECR_REPO,
        LAMBDA_FUNCTION_ARN: inputs.LAMBDA_FUNCTION_ARN,
        LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_NAME:
          inputs.LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_ARN,
      });
      return { id: crypto.randomBytes(16).toString('hex'), outs: {} };
    },

    async update(
      _: unknown,
      __: unknown,
      inputs: GithubActionWorkflowDeploymentEnvironmentVariablesInput,
    ) {
      await this.create(inputs);
      return { outs: {} };
    },
  };

async function main() {
  const pulumiOutputs = JSON.parse(await fs.readFile('tmp.json', 'utf-8'));
  await githubActionWorkFlowEnvironmentProvider.create(pulumiOutputs);
}

main();

// interface GithubActionWorkflowDeploymentEnvironmentVariablesResourceInput {
//   API_HOST: pulumi.Input<string>;
//   ECR_IMAGE_NAME: pulumi.Input<string>;
//   ECR_REPO: pulumi.Input<string>;
//   LAMBDA_FUNCTION_ARN: pulumi.Input<string>;
//   LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_ARN: pulumi.Input<string>;
//   S3_BUCKET: pulumi.Input<string>;
// }

// export class GithubActionWorkflowDeploymentEnvironmentVariablesResource extends pulumi
//   .dynamic.Resource {
//   constructor(
//     name: string,
//     args: GithubActionWorkflowDeploymentEnvironmentVariablesResourceInput,
//     opts?: pulumi.CustomResourceOptions,
//   ) {
//     super(githubActionWorkFlowEnvironmentProvider, name, args, opts);
//   }
// }
//
// export function updateGithubActionWorkflowEnv(
//   args: GithubActionWorkflowDeploymentEnvironmentVariablesResourceInput,
// ) {
//   const namePrefix = kebabcase(pulumi.getStack());
//
//   const resp = new GithubActionWorkflowDeploymentEnvironmentVariablesResource(
//     `${namePrefix}-deployment-environment-variables`,
//     args,
//   );
//   return resp;
// }
