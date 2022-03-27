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
pulumi config set aws:region eu-west-2
pulumi config set prefix:name code-test
pulumi config set rds:user dbuser
bash ./scripts/ci/deploy.sh
```

## Verify deployment

After execute `deploy.sh`, you will see the following output in console:

```text
api               https://l1kqpd5nqc.execute-api.eu-west-2.amazonaws.com
databaseHost      tf-20220326123106742800000006.cluster-cxksjykhpxmn.eu-west-2.rds.amazonaws.com
databasePassword  *************
dockerImageUrl    139227058951.dkr.ecr.eu-west-2.amazonaws.com/code-test-image-092187c
frontend          https://d16m8sgb6n5atc.cloudfront.net
lambdaArn         arn:aws:lambda:eu-west-2:139227058951:function:code-test-lambda-9efb696
```

In case you missed, execute `pulumi stack output` to see it again.

then you can verify the deployment by running the following steps:

- Open `frontend/index.html` in a browser
- Open `frontend/upload/demo.gif` in a browser

## Manual steps after deployment

You need update environment setting in below files:

[Frontend deploy workflow](/.github/workflows/deploy-frontend.yml)

[Backend deploy workflow](/.github/workflows/deploy-backend.yml)