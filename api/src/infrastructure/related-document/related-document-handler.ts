import { DynamoDBStreamHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Document } from '@/shared/types/types';
import { IRelatedDocumentService } from '@/infrastructure/related-document/related-document-service';

export default (relatedDocument: IRelatedDocumentService): DynamoDBStreamHandler =>
  async (event) => {
    await Promise.all(event.Records.map(async (record) => {
      switch (record.eventName) {
        case 'MODIFY': {
          const document = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) as Document;
          switch (document.documentType) {
            case 'team': {
              await relatedDocument.teamUpdated(document);
            } break;
            case 'tournament': {
              await relatedDocument.tournamentUpdated(document);
            } break;
          }
        } break;
        case 'REMOVE': {
          const document = DynamoDB.Converter.unmarshall(record.dynamodb.OldImage) as Document;
          switch (document.documentType) {
            case 'team': {
              await relatedDocument.teamDeleted(document.id);
            } break;
            case 'tournament': {
              await relatedDocument.tournamentDeleted(document.id);
            } break;
            case 'match': {
              await relatedDocument.matchDeleted(document.id);
            } break;
          }
        } break;
      }
    }));
  };
