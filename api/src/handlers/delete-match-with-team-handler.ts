import { SNSHandler } from 'aws-lambda';
import { IDeleteMatchWithTeamService } from '@/business-services/delete-match-with-team-service';

export default (deleteMatchWithTeam: IDeleteMatchWithTeamService): SNSHandler => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        await deleteMatchWithTeam({ teamId: record.Sns.Message });
      })
    );
  };
};
