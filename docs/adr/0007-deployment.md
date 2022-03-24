# Deployment

- Status: accept

## Context and Problem Statement

I want to find a place can host system in that repo.

Which need include

- CDN for frontend static asset
- RDS for Database access
- HTTP Server fo backend

## Decision Drivers <!-- optional -->

- Pricing model, as it is side project ,
  the pricing modal by traffic usage would be best
- Setup complexity

## Considered Options

- AWS RDS Aurora + Lambda + CloudFront + S3
- GCP Cloud SQL + Cloud Function + Cloud Storage

## Decision Outcome

- AWS because all option is serverless pricing modal.
