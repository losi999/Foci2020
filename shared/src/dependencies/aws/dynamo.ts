import { DynamoDB, config } from 'aws-sdk';

config.logger = console;
export const dynamoDbClient = new DynamoDB.DocumentClient();
