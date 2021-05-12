import { DynamoDBStreamHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Document } from '@foci2020/shared/types/documents';
import { IPrimaryTableTriggerService } from '@foci2020/api/functions/primary-table-trigger/primary-table-trigger-service';

export default (
  primaryTableTrigger: IPrimaryTableTriggerService
): DynamoDBStreamHandler =>
  async (event) => {
    await Promise.all(event.Records.map(async (record) => {
      const newDocument = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) as Document;
      const oldDocument = DynamoDB.Converter.unmarshall(record.dynamodb.OldImage) as Document;

      await primaryTableTrigger({
        oldDocument,
        newDocument,
        eventName: record.eventName,
      });
    }));
  };
