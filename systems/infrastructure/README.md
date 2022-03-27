# Infrastructure as code

Include Setup AWS with
* RDS
* CloudFront
* S3
* Lambda
* API Gateway
* ECR

## Setup

[Install pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
```bash
bash ./scripts/ci/setup.sh
bash ./scripts/ci/deploy.sh
```

## Verify deployment

After execute `deploy.sh`, you will see the following output in console:

```text
API_HOST             https://l1kqpd5nqc.execute-api.eu-west-2.amazonaws.com
CLOUDFRONT_URL       https://d16m8sgb6n5atc.cloudfront.net
DATABASE_HOST        tf-20220326123106742800000006.cluster-cxksjykhpxmn.eu-west-2.rds.amazonaws.com
DATABASE_PASSWORD    [secret]
ECR_IMAGE_NAME       code-test-image-092187c
ECR_REPO             139227058951.dkr.ecr.eu-west-2.amazonaws.com
LAMBDA_FUNCTION_ARN  arn:aws:lambda:eu-west-2:139227058951:function:code-test-lambda-9efb696
S3_BUCKET            code-test-bucket-7afec63
```

In case you missed, execute `pulumi stack output` to see it again.

then you can verify the deployment by running the following steps:

- Open `frontend/index.html` in a browser
- Open `frontend/upload/demo.gif` in a browser

## Manual steps after deployment

You need update environment setting in below files:

[Frontend deploy workflow](/.github/workflows/deploy-frontend.yml)

[Backend deploy workflow](/.github/workflows/deploy-backend.yml)