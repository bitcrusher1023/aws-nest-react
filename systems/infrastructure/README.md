# Infrastructure as code

Include Setup AWS with
* RDS
* CloudFront
* S3
* Lambda
* API Gateway
* ECR

Setup

[Install pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
```bash
pulumi config set aws:region eu-west-2
pulumi config set prefix:name project-bootstrap
pulumi config set rds:user dbuser
bash ./scripts/ci/deploy.sh
```