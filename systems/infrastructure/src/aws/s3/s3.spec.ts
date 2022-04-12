import * as pulumi from '@pulumi/pulumi';
import { expect } from 'chai';

import { createS3Bucket, uploadTestIndexFile } from './index.js';

pulumi.runtime.setMocks({
  call: function (args: pulumi.runtime.MockCallArgs) {
    return args.inputs;
  },
  newResource: function (args: pulumi.runtime.MockResourceArgs): {
    id: string;
    state: any;
  } {
    return {
      id: `${args.inputs.name}_id`,
      state: args.inputs,
    };
  },
});

describe('S3', () => {
  describe('createS3Bucket', () => {
    it('should create a bucket with cors rule and website served', done => {
      const { bucket } = createS3Bucket();
      pulumi
        .all([bucket.corsRules, bucket.website])
        .apply(([cors, website]) => {
          expect(cors).to.have.length(1);
          expect(cors?.[0].allowedMethods).to.deep.equal(['PUT']);
          expect(cors?.[0].allowedOrigins).to.deep.equal(['*']);
          expect(website?.indexDocument).to.equal('index.html');
          done();
        });
    });
  });

  describe('uploadTestIndexFile', () => {
    it('should upload test index file for prove deployment working', async () => {
      const indexFile = await uploadTestIndexFile(
        {} as any,
        {
          apiEndpoint: pulumi.Output.create('https://s3.amazonaws.com'),
        } as any,
      );
      return new Promise(resolve =>
        pulumi.all([indexFile.content]).apply(([fileContent]) => {
          expect(fileContent).to.be.contain('https://s3.amazonaws.com');
          resolve();
        }),
      );
    });
  });
});
