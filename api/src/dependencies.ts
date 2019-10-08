import ajv from 'ajv';
import { captureAWSClient } from 'aws-xray-sdk';
import { DynamoDB } from 'aws-sdk';
import { ajvValidatorService } from '@/services/validator-service';
import { dynamoDatabaseService } from '@/services/database-service';

const ajvValidator = new ajv({
  allErrors: true,
  format: 'full'
});
const dynamoDbClient = new DynamoDB.DocumentClient();
captureAWSClient((dynamoDbClient as any).service);

export const validatorService = ajvValidatorService(ajvValidator);
export const databaseService = dynamoDatabaseService(dynamoDbClient);
