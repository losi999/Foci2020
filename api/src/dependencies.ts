import ajv from 'ajv';
import { DynamoDB } from 'aws-sdk';
import { ajvValidatorService } from '@/services/validator-service';
import { dynamoDatabaseService } from '@/services/database-service';

const ajvValidator = new ajv({
  allErrors: true,
  format: 'full'
});
const dynamoDbClient = new DynamoDB.DocumentClient();

export const validatorService = ajvValidatorService(ajvValidator);
export const databaseService = dynamoDatabaseService(dynamoDbClient);
