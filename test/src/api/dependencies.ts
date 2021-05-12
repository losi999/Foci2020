import { DynamoDB } from 'aws-sdk';
import { databaseServiceFactory } from '@foci2020/shared/services/database-service';

const documentClient = new DynamoDB.DocumentClient({
  region: Cypress.env('AWS_DEFAULT_REGION'),
  accessKeyId: Cypress.env('AWS_ACCESS_KEY_ID'),
  secretAccessKey: Cypress.env('AWS_SECRET_ACCESS_KEY'),
});

export const databaseService = databaseServiceFactory({
  primaryTableName: Cypress.env('DYNAMO_TABLE'),
  archiveTableName: undefined,
}, documentClient);
