# Text-to-Speech Converter(Serverless)

This project is a serverless application designed to convert text into speech using AWS Polly. The system is built with a React frontend, deployed to Amazon S3, and uses AWS API Gateway to handle HTTP requests. Terraform is used for infrastructure management, making it easy to deploy and manage resources in a repeatable, declarative way.
🔗 https://d19y4om6csly31.cloudfront.net/

<img width="1027" height="738" alt="image" src="https://github.com/user-attachments/assets/9bfc7bf3-a70f-4136-93a5-bf4446f3b4f8" />


## Key Components

React Frontend:
A user-friendly interface that allows users to input text, select voice options, and listen to the generated speech.
Hosted on S3 and served globally through CloudFront for optimized performance.

CloudFront:
A global Content Delivery Network (CDN) used to cache and deliver the static React app from S3 to users worldwide, ensuring low-latency and fast content delivery.

AWS API Gateway:
A serverless API to handle incoming requests and route them to the appropriate AWS services (e.g., Lambda for processing).

AWS Lambda:
A serverless compute service that processes text-to-speech requests, interacts with Polly to generate speech, and stores metadata in DynamoDB.
Also uploads the generated speech to S3 and returns the audio URL to the frontend.

AWS Polly:
Amazon’s Text-to-Speech service, which converts text into lifelike speech.
Invoked by Lambda to generate speech from the user’s input.

S3 (Simple Storage Service):
A scalable cloud storage service to host the static React app and store the generated speech audio files.
The React app is served via CloudFront.

DynamoDB:
A NoSQL database to store metadata for each text-to-speech request, such as user input, selected voice, timestamp, and audio file URLs.

Terraform:
Infrastructure as code tool used to define, provision, and manage AWS resources like API Gateway, S3, Lambda, CloudFront, and DynamoDB.





## Architecture 


![ttsdiagram](https://github.com/user-attachments/assets/a898d146-d855-4645-a27a-26dc2810f449)


## User Flow


## Security Implementation

#### S3 Bucket Security

Private S3 Bucket: Store audio files in a private S3 bucket to ensure they are not publicly accessible by default.

Pre-signed URLs: Use pre-signed URLs to grant temporary access to the generated audio files. This ensures that only users with the URL can access the files, and the URL expires after a set period to reduce the risk of unauthorized access.

IAM Policies for Lambda: Ensure the Lambda function only has permission to upload audio to the S3 bucket and not read other files or perform unnecessary actions.
Rate Limiting & Throttling

#### API Gateway Throttling: 
Set rate-limiting and throttling on API Gateway to prevent abuse or excessive requests. This helps mitigate denial-of-service (DoS) attacks or accidental overuse of resources.

#### Lambda Permissions

Minimal Lambda Permissions: Assign the Lambda function the minimum permissions needed to interact with AWS services. For example:

Invoke Polly: Permissions to call the Polly API (polly:SynthesizeSpeech).

Write to DynamoDB: Permissions to insert metadata into the DynamoDB table (dynamodb:PutItem).

Upload to S3: Permissions to upload audio to the S3 bucket (s3:PutObject).

IAM Roles for Lambda: Use a dedicated IAM role for Lambda with strict, specific policies to ensure the function has no more access than needed.

Lambda Concurrency Limits: Set concurrency limits for Lambda to ensure that excessive requests do not overwhelm the service and to avoid a potential service outage.

## Estimated Costs (for moderate usage)

Lambda:

1M requests, 500ms execution time (1GB memory)
→ Approx. $1.25/month

Polly:

1M characters processed using standard voices
→ Approx. $4.00/month

S3:

100GB storage + 1M PUT/GET requests
→ Approx. $15.50/month

API Gateway:

500,000 requests/month
→ Approx. $1.75/month

CloudFront:

100GB of data transfer + 500,000 requests
→ Approx. $13.50/month

DynamoDB:

10,000 writes/month, 1,000 reads
→ Approx. $2.50/month

#### Total Estimated Monthly Cost:

$38.50 for moderate usage.

## Project Structure

<img width="406" height="242" alt="image" src="https://github.com/user-attachments/assets/ea0f188c-6453-4c73-b43e-3032ac41d604" />

## How to Run the Project

Clone the Repository:
git clone https://your-repository-url.git](https://github.com/Aliko2020/text-to-speechV1.git)

Navigate to the project directory:
cd text-to-speechV1

Set Up Environment Variables: <br>
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com
AWS_REGION=us-east-1
POLLY_API_KEY=your-polly-api-key
DYNAMODB_TABLE=your-dynamodb-table-name
S3_BUCKET_NAME=your-s3-bucket-name

Navigate to the infrastructure directory: <br>
cd ../infrastructure

terraform init
terraform apply



Frontend (React App): <br>
cd frontend
npm install

## Testing the Application
To test the Text-to-Speech functionality, you can send a POST request to the API using curl. Here's how you can test it: <br>

curl -X POST "https://35smzwnuoc.execute-api.us-east-1.amazonaws.com/dev/convert" \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world, this is a test of the text-to-speech system", "voice": "Joanna"}'




