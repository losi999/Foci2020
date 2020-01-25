import { SNSHandler } from 'aws-lambda';
import { IUpdateTournamentOfMatchesService } from '@/business-services/update-tournament-of-matches-service';

export default (updateTournamentOfMatches: IUpdateTournamentOfMatchesService): SNSHandler => {
  return async (event) => {
    await Promise.all(event.Records.map(record => updateTournamentOfMatches(JSON.parse(record.Sns.Message))));
  };
};
