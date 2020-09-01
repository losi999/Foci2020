import { DynamoDB } from 'aws-sdk';
import ajv from 'ajv';
import { v4 as uuid } from 'uuid';
import { databaseServiceFactory } from '@foci2020/shared/services/database-service';
import { validatorServiceFactory } from '@foci2020/shared/services/validator-service';
import { teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';
import { betDocumentConverterFactory } from '@foci2020/shared/converters/bet-document-converter';
import { standingDocumentConverterFactory } from '@foci2020/shared/converters/standing-document-converter';

const documentClient = new DynamoDB.DocumentClient({
  region: Cypress.env('AWS_DEFAULT_REGION'),
  accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
  secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
});

const ajvValidator = new ajv({
  allErrors: true,
  format: 'full'
});
export const validatorService = validatorServiceFactory(ajvValidator);
export const databaseService = databaseServiceFactory(Cypress.env('DYNAMO_TABLE'), documentClient);

export const teamConverter = teamDocumentConverterFactory(uuid);
export const tournamentConverter = tournamentDocumentConverterFactory(uuid);
export const matchConverter = matchDocumentConverterFactory(uuid);
export const betConverter = betDocumentConverterFactory();
export const standingConverter = standingDocumentConverterFactory();
