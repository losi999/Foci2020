import { IUpdateMatchWithTeamService } from '@/business-services/update-match-with-team-service';
import { SQSHandler } from 'aws-lambda';
import { UpdateMatchWithTeamMessage } from '@/types/types';

export default (updateMatchWithTeam: IUpdateMatchWithTeamService): SQSHandler => {
  return async (event) => {
    const message = JSON.parse(event.Records.shift().body) as UpdateMatchWithTeamMessage;
    await updateMatchWithTeam(message);
  };
};
