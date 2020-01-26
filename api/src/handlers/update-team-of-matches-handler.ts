import { SNSHandler } from 'aws-lambda';
import { IUpdateTeamOfMatchesService } from '@/business-services/update-team-of-matches-service';

export default (updateTeamOfMatches: IUpdateTeamOfMatchesService): SNSHandler => {
  return async (event) => {
    await Promise.all(event.Records.map(record => updateTeamOfMatches(JSON.parse(record.Sns.Message))));
  };
};
