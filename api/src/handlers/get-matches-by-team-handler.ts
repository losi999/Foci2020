import { SNSHandler } from 'aws-lambda';
import { TeamUpdatedNotification } from '@/types/types';
import { IGetMatchesByTeamService } from '@/business-services/get-matches-by-team-service';

export default (getMatchesByTeam: IGetMatchesByTeamService): SNSHandler => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        const message = JSON.parse(record.Sns.Message) as TeamUpdatedNotification;
        await getMatchesByTeam(message);
      })
    );
  };
};
