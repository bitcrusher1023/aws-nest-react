#!/use/bin bash

set -ex
tag=${GITHUB_SHA:-testing}
ecr_repo=${ECR_REPO}
ecr_image_name=${ECR_IMAGE_NAME}
lambda_function_arn=${LAMBDA_FUNCTION_ARN}
lambda_function_latest_version_alias_name=${LAMBDA_FUNCTION_LATEST_VERSION_ALIAS_NAME}

aws_region=${AWS_DEFAULT_REGION}
aws ecr get-login-password --region "$aws_region" | docker login --username AWS --password-stdin "$ecr_repo"
docker build -t backend:latest -t "backend:$tag" -f ./Dockerfile.lambda .
docker tag  backend:latest "$ecr_repo/$ecr_image_name:latest"
docker tag  "backend:$tag" "$ecr_repo/$ecr_image_name:$tag"
docker push "$ecr_repo/$ecr_image_name:latest"
docker push "$ecr_repo/$ecr_image_name:$tag"
latest_version=$(aws lambda update-function-code \
    --function-name "$lambda_function_arn" \
    --image-uri "$ecr_repo/$ecr_image_name:$tag" \
    --publish | jq -r '.Version')
aws lambda update-alias \
    --function-name "$lambda_function_arn" \
    --function-version "$latest_version" \
    --name "$lambda_function_latest_version_alias_name"
