import { SNSHandler } from 'aws-lambda';
import { IDeleteMatchWithTournamentService } from '@/business-services/delete-match-with-tournament-service';

export default (deleteMatchWithTournament: IDeleteMatchWithTournamentService): SNSHandler => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        await deleteMatchWithTournament({ tournamentId: record.Sns.Message });
      })
    );
  };
};
