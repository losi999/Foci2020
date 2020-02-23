import { DynamoDBStreamHandler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { Document } from '@/shared/types/types';
import { IMatchRelatedDocumentService } from '@/match/match-related-document/match-related-document-service';

export default (matchRelatedDocument: IMatchRelatedDocumentService): DynamoDBStreamHandler =>
  async (event) => {
    await Promise.all(event.Records.map(async (record) => {
      switch (record.eventName) {
        case 'MODIFY': {
          const document = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) as Document;
          switch (document.documentType) {
            case 'team': {
              await matchRelatedDocument.updateTeamOfMatch(document);
            } break;
            case 'tournament': {
              await matchRelatedDocument.updateTournamentOfMatch(document);
            } break;
          }
        } break;
        case 'REMOVE': {
          const document = DynamoDB.Converter.unmarshall(record.dynamodb.OldImage) as Document;
          switch (document.documentType) {
            case 'team': {
              await matchRelatedDocument.deleteMatchByTeam(document.id);
            } break;
            case 'tournament': {
              await matchRelatedDocument.deleteMatchByTournament(document.id);
            } break;
            case 'bet': {

            } break;
          }
        } break;
      }
    }));
  };
