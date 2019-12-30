import { IUpdateTeamOfMatchService } from '@/business-services/update-team-of-match-service';
import { SQSHandler } from 'aws-lambda';
import { UpdateTeamOfMatchMessage } from '@/types/types';

export default (updateTeamOfMatch: IUpdateTeamOfMatchService): SQSHandler => {
  return async (event) => {
    const message = JSON.parse(event.Records.shift().body) as UpdateTeamOfMatchMessage;
    await updateTeamOfMatch(message);
  };
};
