import { Handler, SNSEvent } from 'aws-lambda';
import { IUpdateMatchWithTournamentService } from '@/business-services/update-match-with-tournament-service';
import { UpdateTournamentNotification } from '@/types/types';

export default (updateMatchWithTournament: IUpdateMatchWithTournamentService): Handler<SNSEvent> => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        const message = JSON.parse(record.Sns.Message) as UpdateTournamentNotification;
        await updateMatchWithTournament({
          ...message
        });
      })
    );
  };
};
