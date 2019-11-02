import ajv from 'ajv';
import { captureAWSClient } from 'aws-xray-sdk';
import { DynamoDB, SNS } from 'aws-sdk';
import { ajvValidatorService } from '@/services/validator-service';
import { dynamoDatabaseService } from '@/services/database-service';
import { default as apiRequestValidatorHandler } from '@/handlers/api-request-validator-handler';
import { snsNotificationService } from '@/services/notification-service';
import { matchDocumentConverterFactory } from '@/converters/match-document-converter';

const ajvValidator = new ajv({
  allErrors: true,
  format: 'full'
});
const dynamoDbClient = new DynamoDB.DocumentClient();
const sns = captureAWSClient(new SNS());
captureAWSClient((dynamoDbClient as any).service);

export const matchDocumentConverter = matchDocumentConverterFactory();

export const validatorService = ajvValidatorService(ajvValidator);
export const databaseService = dynamoDatabaseService(dynamoDbClient, matchDocumentConverter);
export const notificationService = snsNotificationService(sns);

export const apiRequestValidator = apiRequestValidatorHandler(validatorService);
