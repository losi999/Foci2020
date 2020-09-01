import ajv from 'ajv';
import { v4 as uuid } from 'uuid';
import { captureAWSClient } from 'aws-xray-sdk';
import { DynamoDB, CognitoIdentityServiceProvider, config, Lambda, CloudFormation } from 'aws-sdk';
import { validatorServiceFactory } from '@foci2020/shared/services/validator-service';
import { matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';
import { teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { identityServiceFactory } from '@foci2020/shared/services/identity-service';
import { betDocumentConverterFactory } from '@foci2020/shared/converters/bet-document-converter';
import { databaseServiceFactory } from '@foci2020/shared/services/database-service';
import { compareDocumentConverterFactory } from '@foci2020/shared/converters/compare-document-converter';
import { standingDocumentConverterFactory } from '@foci2020/shared/converters/standing-document-converter';
import { infrastructureServiceFactory } from '@foci2020/shared/services/infrastructure-service';
import { default as apiRequestValidatorHandler } from '@foci2020/api/handlers/api-request-validator-handler';
import { default as authorizerHandler } from '@foci2020/api/handlers/authorizer-handler';

const ajvValidator = new ajv({
  allErrors: true,
  format: 'full'
});
config.logger = console;
const dynamoDbClient = new DynamoDB.DocumentClient();
const cognito = captureAWSClient(new CognitoIdentityServiceProvider());
captureAWSClient((dynamoDbClient as any).service);

const lambda = captureAWSClient(new Lambda());
const cloudFormation = captureAWSClient(new CloudFormation());

export const matchDocumentConverter = matchDocumentConverterFactory(uuid);
export const teamDocumentConverter = teamDocumentConverterFactory(uuid);
export const tournamentDocumentConverter = tournamentDocumentConverterFactory(uuid);
export const betDocumentConverter = betDocumentConverterFactory();
export const standingDocumentConverter = standingDocumentConverterFactory();
export const compareDocumentConverter = compareDocumentConverterFactory();

export const databaseService = databaseServiceFactory(process.env.DYNAMO_TABLE, dynamoDbClient);

export const validatorService = validatorServiceFactory(ajvValidator);
export const identityService = identityServiceFactory(process.env.USER_POOL_ID, process.env.CLIENT_ID, cognito);
export const infrastructureService = infrastructureServiceFactory(cloudFormation, lambda);

export const apiRequestValidator = apiRequestValidatorHandler(validatorService);
export const authorizer = authorizerHandler();
