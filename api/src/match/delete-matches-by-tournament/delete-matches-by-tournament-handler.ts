import { SNSHandler } from 'aws-lambda';
import { IDeleteMatchesByTournamentService } from '@/match/delete-matches-by-tournament/delete-matches-by-tournament-service';

export default (deleteMatchesByTournament: IDeleteMatchesByTournamentService): SNSHandler => {
  return async (event) => {
    await Promise.all(event.Records.map(record => deleteMatchesByTournament({ tournamentId: record.Sns.Message })));
  };
};
