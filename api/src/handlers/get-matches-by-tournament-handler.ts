import { SNSHandler } from 'aws-lambda';
import { TournamentUpdatedNotification } from '@/types/types';
import { IGetMatchesByTournamentService } from '@/business-services/get-matches-by-tournament-service';

export default (getMatchesByTournament: IGetMatchesByTournamentService): SNSHandler => {
  return async (event) => {
    await Promise.all(
      event.Records.map(async (record) => {
        const message = JSON.parse(record.Sns.Message) as TournamentUpdatedNotification;
        await getMatchesByTournament(message);
      })
    );
  };
};
