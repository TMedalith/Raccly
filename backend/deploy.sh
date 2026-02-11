
echo " Iniciando deploy..."

# 1. Login a ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  234642166633.dkr.ecr.us-east-1.amazonaws.com

# 2. Build imagen
docker build --platform linux/amd64 \
  -t nasa-rag:latest .

# 3. Tag imagen
docker tag nasa-rag:latest \
  234642166633.dkr.ecr.us-east-1.amazonaws.com/nasa-rag:latest

# 4. Push a ECR
docker push 234642166633.dkr.ecr.us-east-1.amazonaws.com/nasa-rag:latest

# 5. Update Lambda
aws lambda update-function-code \
  --function-name query \
  --image-uri 234642166633.dkr.ecr.us-east-1.amazonaws.com/nasa-rag:latest \
  --region us-east-1

# 6. Esperar
aws lambda wait function-updated \
  --function-name query \
  --region us-east-1

echo "Listo"
echo "🔗 URL: https://jn3779aza9.execute-api.us-east-1.amazonaws.com"