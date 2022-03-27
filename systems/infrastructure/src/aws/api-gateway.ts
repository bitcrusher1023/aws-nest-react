import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';
import kebabcase from 'lodash.kebabcase';

export function createAPIGateWay(
  lambda: aws.lambda.Function,
  cloudFrontDistribution: aws.cloudfront.Distribution,
) {
  const namePrefix = kebabcase(pulumi.getStack());
  new aws.lambda.Permission(`${namePrefix}-lambda-api-gateway-permission`, {
    action: 'lambda:InvokeFunction',
    function: lambda,
    principal: 'apigateway.amazonaws.com',
  });

  // Set up the API Gateway
  const apigw = new aws.apigatewayv2.Api('httpApiGateway', {
    corsConfiguration: {
      allowCredentials: true,
      allowHeaders: ['Content-Type'],
      allowMethods: ['*'],
      allowOrigins: [
        pulumi.interpolate`https://${cloudFrontDistribution.domainName}`,
      ],
    },
    protocolType: 'HTTP',
    routeKey: '$default',
    target: lambda.invokeArn,
  });
  return { apigw };
}
