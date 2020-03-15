import { StandingDocument } from '@/types/types';
import { DynamoDB } from 'aws-sdk';

export interface IStandingDocumentService {
  saveStanding(document: StandingDocument): Promise<unknown>;
}

export const standingDocumentServiceFactory = (
  standingTableName: string,
  dynamoClient: DynamoDB.DocumentClient
): IStandingDocumentService => {

  return {
    saveStanding: (document) => {
      return dynamoClient.put({
        ReturnConsumedCapacity: 'INDEXES',
        TableName: standingTableName,
        Item: document
      }).promise();
    }
  };
};
