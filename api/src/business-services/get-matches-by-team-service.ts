import { TeamDocument } from '@/types/documents';
import { IMatchDocumentService } from '@/services/match-document-service';
import { IQueueService } from '@/services/queue-service';

export interface IGetMatchesByTeamService {
  (ctx: {
    teamId: string,
    team: TeamDocument,
  }): Promise<void>;
}

export const getMatchesByTeamServiceFactory = (matchDocumentService: IMatchDocumentService, queueService: IQueueService) => {
  const sendMatchIdsToQueue = async (matches: string[], team: TeamDocument, type: 'home' | 'away') => {
    console.log('Sending items into queue');
    await Promise.all(matches.map(matchId => queueService.updateTeamOfMatch({
      matchId,
      team,
      type
    }).then((resp) => {
      console.log('Queue message sent', matchId);
      return resp;
    })
    ));
    console.log('All items sent to queue');
  };

  return {
    home: (): IGetMatchesByTeamService =>
      async ({ teamId, team }) => {
        console.log('Querying matches by teamId', teamId);
        const matches = (await matchDocumentService.queryMatchKeysByHomeTeamId(teamId).then((resp) => {
          console.log('Matches queried by home team', teamId);
          return resp;
        })).map(m => m.id);

        await sendMatchIdsToQueue(matches, team, 'home');
      },
    away: (): IGetMatchesByTeamService =>
      async ({ teamId, team }) => {
        console.log('Querying matches by teamId', teamId);
        const matches = (await matchDocumentService.queryMatchKeysByAwayTeamId(teamId).then((resp) => {
          console.log('Matches queried by away team', teamId);
          return resp;
        })).map(m => m.id);

        await sendMatchIdsToQueue(matches, team, 'away');
      },
  };
};
