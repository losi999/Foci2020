import { SQSHandler } from 'aws-lambda';
import { IUpdateTournamentOfMatchService } from '@/business-services/update-tournament-of-match-service';
import { UpdateTournamentOfMatchMessage } from '@/types/types';

export default (updateTournamentOfMatch: IUpdateTournamentOfMatchService): SQSHandler => {
  return async (event) => {
    const message = JSON.parse(event.Records.shift().body) as UpdateTournamentOfMatchMessage;
    await updateTournamentOfMatch(message);

  };
};
