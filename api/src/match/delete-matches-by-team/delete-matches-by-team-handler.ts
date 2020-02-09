import { SNSHandler } from 'aws-lambda';
import { IDeleteMatchesByTeamService } from '@/match/delete-matches-by-team/delete-matches-by-team-service';

export default (deleteMatchesByTeam: IDeleteMatchesByTeamService): SNSHandler => {
  return async (event) => {
    await Promise.all(event.Records.map(record => deleteMatchesByTeam({ teamId: record.Sns.Message })));
  };
};
