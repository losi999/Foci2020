import { SNSHandler } from 'aws-lambda';
import { IUpdateTournamentOfMatchesService } from '@/match/update-tournament-of-matches/update-tournament-of-matches-service';

export default (updateTournamentOfMatches: IUpdateTournamentOfMatchesService): SNSHandler => {
  return async (event) => {
    await Promise.all(event.Records.map(record => updateTournamentOfMatches(JSON.parse(record.Sns.Message))));
  };
};
