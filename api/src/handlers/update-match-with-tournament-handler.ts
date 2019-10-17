import { DynamoDBStreamEvent, Handler } from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { TournamentDocument } from '@/types/documents';
import { IUpdateMatchWithTournamentService } from '@/business-services/update-match-with-tournament-service';

export default (updateMatchWithTournament: IUpdateMatchWithTournamentService): Handler<DynamoDBStreamEvent> => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        if (record.eventName === 'MODIFY') {
          const tournament = DynamoDB.Converter.unmarshall(record.dynamodb.NewImage) as TournamentDocument;
          if (tournament.documentType === 'tournament') {
            try {
              await updateMatchWithTournament({ tournament });
            } catch (error) {
              console.log('ERROR updateMatchWithTournament', error);
            }
          }
        }
      })
    );
  };
};
