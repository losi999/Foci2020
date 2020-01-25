import { SNSHandler } from 'aws-lambda';
import { IDeleteMatchesByTournamentService } from '@/business-services/delete-matches-by-tournament-service';

export default (deleteMatchesByTournament: IDeleteMatchesByTournamentService): SNSHandler => {
  return async (event) => {
    await Promise.all(event.Records.map(record => deleteMatchesByTournament({ tournamentId: record.Sns.Message })));
  };
};
