import { IStandingDocumentConverter } from '@foci2020/shared/converters/standing-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { BetResultCalculatedEvent } from '@foci2020/shared/types/events';

export interface IBetResultCalculatedService {
  (ctx: BetResultCalculatedEvent): Promise<void>;
}

export const betResultCalculatedServiceFactory = (databaseService: IDatabaseService,
  standingDocumentConverter: IStandingDocumentConverter): IBetResultCalculatedService => {
  return async ({ userId, expiresIn, tournamentId }) => {
    const bets = await databaseService.queryBetsByTournamentIdUserId(tournamentId, userId).catch((error) => {
      console.error('Query bets by tournament and user Id', tournamentId, userId, error);
      throw error;
    });

    const standing = standingDocumentConverter.create(bets, expiresIn);

    await databaseService.saveStanding(standing).catch((error) => {
      console.error('Save standing', error);
      throw error;
    });
  };
};
