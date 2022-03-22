import * as aws from '@pulumi/aws';
import * as pulumi from '@pulumi/pulumi';

export function createCloudFront(bucket: aws.s3.Bucket) {
  const prefixConfig = new pulumi.Config('prefix');
  const namePrefix = prefixConfig.require('name');
  const originId = pulumi.interpolate`s3-origin-id-${bucket.id}`;
  const cloudFrontDistribution = new aws.cloudfront.Distribution(
    `${namePrefix}-cloud-front-distribution`,
    {
      defaultCacheBehavior: {
        allowedMethods: [
          'DELETE',
          'GET',
          'HEAD',
          'OPTIONS',
          'PATCH',
          'POST',
          'PUT',
        ],
        cachedMethods: ['GET', 'HEAD'],
        defaultTtl: 3600,
        forwardedValues: {
          cookies: {
            forward: 'all',
          },
          queryString: true,
        },
        maxTtl: 86400,
        minTtl: 0,
        targetOriginId: originId,
        viewerProtocolPolicy: 'allow-all',
      },
      defaultRootObject: 'index.html',
      enabled: true,
      isIpv6Enabled: true,

      origins: [
        {
          domainName: bucket.bucketRegionalDomainName,
          originId: originId,
          // s3OriginConfig: {
          //   originAccessIdentity: pulumi.interpolate`origin-access-identity/cloudfront/${originId}`,
          // },
        },
      ],
      priceClass: 'PriceClass_100',
      restrictions: {
        geoRestriction: {
          restrictionType: 'none',
        },
      },
      viewerCertificate: {
        cloudfrontDefaultCertificate: true,
      },
    },
  );
  return { cloudFrontDistribution };
}
