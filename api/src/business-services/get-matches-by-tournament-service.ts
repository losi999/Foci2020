import { TournamentDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';
import { IQueueService } from '@/services/queue-service';

export interface IGetMatchesByTournamentService {
  (ctx: {
    tournamentId: string,
    tournament: TournamentDocument,
  }): Promise<void>;
}

export const getMatchesByTournamentServiceFactory = (matchDocumentService: IMatchDocumentService, queueService: IQueueService): IGetMatchesByTournamentService => {
  return async ({ tournament, tournamentId }) => {
    console.log('Querying matches by tournamentId', tournamentId);
    const matches = (await matchDocumentService.queryMatchKeysByTournamentId(tournamentId).then((resp) => {
      console.log('Matches queried by home tournament', tournamentId);
      return resp;
    })).map(m => m.id);

    console.log('Sending items into queue');
    await Promise.all(matches.map(matchId => queueService.updateTournamentOfMatch({
      matchId,
      tournament
    }).then((resp) => {
      console.log('Queue message sent', matchId);
      return resp;
    })
    ));
    console.log('All items sent to queue');
  };
};
