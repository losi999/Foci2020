import { DynamoDBStreamEvent, Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { TournamentDocument } from '@/types/documents';
import { IDeleteMatchWithTournamentService } from '@/business-services/delete-match-with-tournament-service';

export default (deleteMatchWithTournament: IDeleteMatchWithTournamentService): Handler<DynamoDBStreamEvent> => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        if (record.eventName === 'REMOVE') {
          const tournament = DynamoDB.Converter.unmarshall(record.dynamodb.OldImage) as TournamentDocument;
          if (tournament.documentType === 'tournament') {
            try {
              await deleteMatchWithTournament({ tournament });
            } catch (error) {
              console.log('ERROR deleteMatchWithTournament', error);
            }
          }
        }
      })
    );
  };
};
