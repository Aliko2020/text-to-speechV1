provider "aws" {
  region = "us-east-1"
}

# API Gateway HTTP API with CORS
resource "aws_apigatewayv2_api" "http_api" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["OPTIONS", "POST", "GET"]
    allow_headers = ["Content-Type", "Authorization"]
    expose_headers = []
    max_age       = 600
  }
}

# Lambda Function (make sure your handler is zipped and uploaded)
resource "aws_lambda_function" "convert" {
  function_name = "${var.project_name}-convert"
  role          = aws_iam_role.lambda_exec.arn
  handler       = "handler.lambda_handler"
  runtime       = "python3.9"

  filename         = "../backend/convert/convert.zip"
  source_code_hash = filebase64sha256("../backend/convert/convert.zip")

  environment {
    variables = {
      BUCKET_NAME = aws_s3_bucket.audio.bucket
      TABLE_NAME  = aws_dynamodb_table.history.name
    }
  }
}

# API Gateway Integration for Lambda
resource "aws_apigatewayv2_integration" "convert_integration" {
  api_id           = aws_apigatewayv2_api.http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.convert.invoke_arn
}

# GET Route (optional, if needed for fetching data)
resource "aws_apigatewayv2_route" "convert_get_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /convert"
  target    = "integrations/${aws_apigatewayv2_integration.convert_integration.id}"
}

# POST Route for Text to Speech (choose voice)
resource "aws_apigatewayv2_route" "convert_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /convert"
  target    = "integrations/${aws_apigatewayv2_integration.convert_integration.id}"
}

# Lambda Permission for API Gateway to invoke the Lambda function
resource "aws_lambda_permission" "apigw_invoke" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.convert.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# IAM Role for Lambda Execution (allows Lambda to access S3 and DynamoDB)
resource "aws_iam_role" "lambda_exec" {
  name = "${var.project_name}-lambda-exec"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

# Attach policies for Lambda execution role
resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "polly_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonPollyFullAccess"
}

resource "aws_iam_role_policy_attachment" "s3_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3FullAccess"
}

resource "aws_iam_role_policy_attachment" "dynamodb_access" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

# Random suffix for unique bucket name
resource "random_id" "suffix" {
  byte_length = 4
}

# S3 Bucket for audio files
resource "aws_s3_bucket" "audio" {
  bucket = "${var.project_name}-audio-files-${random_id.suffix.hex}"
  tags   = { Name = "tts-audio-bucket" }
}

# S3 Bucket Policy for public read access (optional)
resource "aws_s3_bucket_policy" "audio_policy" {
  bucket = aws_s3_bucket.audio.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Sid       = "PublicReadGetObject",
        Effect    = "Allow",
        Principal = "*",
        Action    = "s3:GetObject",
        Resource  = "arn:aws:s3:::${aws_s3_bucket.audio.bucket}/*"
      }
    ]
  })
}

# DynamoDB Table for history
resource "aws_dynamodb_table" "history" {
  name         = "${var.project_name}-history"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "user_id"
  range_key    = "timestamp"

  attribute {
    name = "user_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }
}

# Outputs
output "api_endpoint" {
  value = aws_apigatewayv2_api.http_api.api_endpoint
}

output "lambda_function_name" {
  value = aws_lambda_function.convert.function_name
}

output "s3_bucket_name" {
  value = aws_s3_bucket.audio.bucket
}

output "dynamodb_table_name" {
  value = aws_dynamodb_table.history.name
}
