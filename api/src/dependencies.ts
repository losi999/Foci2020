import ajv from 'ajv';
import uuid from 'uuid';
import { captureAWSClient } from 'aws-xray-sdk';
import { DynamoDB, CognitoIdentityServiceProvider, config, Lambda, CloudFormation } from 'aws-sdk';
import { ajvValidatorService } from '@/services/validator-service';
import { default as apiRequestValidatorHandler } from '@/handlers/api-request-validator-handler';
import { default as authorizerHandler } from '@/handlers/authorizer-handler';
import { matchDocumentConverterFactory } from '@/converters/match-document-converter';
import { teamDocumentConverterFactory } from '@/converters/team-document-converter';
import { tournamentDocumentConverterFactory } from '@/converters/tournament-document-converter';
import { teamDocumentServiceFactory } from '@/services/team-document-service';
import { tournamentDocumentServiceFactory } from '@/services/tournament-document-service';
import { matchDocumentServiceFactory } from '@/services/match-document-service';
import { cognitoIdentityService } from '@/services/identity-service';
import { betDocumentServiceFactory } from '@/services/bet-document-service';
import { betDocumentConverterFactory } from '@/converters/bet-document-converter';

const ajvValidator = new ajv({
  allErrors: true,
  format: 'full'
});
config.logger = console;
const dynamoDbClient = new DynamoDB.DocumentClient();
const cognito = captureAWSClient(new CognitoIdentityServiceProvider());
captureAWSClient((dynamoDbClient as any).service);

export const lambda = captureAWSClient(new Lambda());
export const cloudFormation = captureAWSClient(new CloudFormation());

export const matchDocumentConverter = matchDocumentConverterFactory(uuid);
export const teamDocumentConverter = teamDocumentConverterFactory(uuid);
export const tournamentDocumentConverter = tournamentDocumentConverterFactory(uuid);
export const betDocumentConverter = betDocumentConverterFactory();

export const teamDocumentService = teamDocumentServiceFactory(process.env.DYNAMO_TABLE, dynamoDbClient);
export const tournamentDocumentService = tournamentDocumentServiceFactory(process.env.DYNAMO_TABLE, dynamoDbClient);
export const matchDocumentService = matchDocumentServiceFactory(process.env.DYNAMO_TABLE, dynamoDbClient);
export const betDocumentService = betDocumentServiceFactory(process.env.DYNAMO_TABLE, dynamoDbClient);

export const validatorService = ajvValidatorService(ajvValidator);
export const identityService = cognitoIdentityService(process.env.USER_POOL_ID, process.env.CLIENT_ID, cognito);

export const apiRequestValidator = apiRequestValidatorHandler(validatorService);
export const authorizer = authorizerHandler();
