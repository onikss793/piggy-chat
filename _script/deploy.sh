#/usr/bin/env bash
set -e

export AWS_PROFILE=piggy-chat

# Main deployment
echo "[[DEPLOY SYSTEM]] Starting Deployment"

# 임시로 개발계로만 배포
export STAGE=development
sls deploy

echo "[[DEPLOY SYSTEM]] End Deployment"
