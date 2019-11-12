import { SNSHandler } from 'aws-lambda';
import { IUpdateMatchWithTeamService } from '@/business-services/update-match-with-team-service';
import { UpdateTeamNotification } from '@/types/types';

export default (updateMatchWithTeam: IUpdateMatchWithTeamService): SNSHandler => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        const message = JSON.parse(record.Sns.Message) as UpdateTeamNotification;
        await updateMatchWithTeam({
          ...message
        });
      })
    );
  };
};
