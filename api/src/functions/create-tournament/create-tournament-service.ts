import { httpError } from '@foci2020/shared/common/utils';
import { ITournamentDocumentConverter } from '@foci2020/shared/converters/tournament-document-converter';
import { IDatabaseService } from '@foci2020/shared/services/database-service';
import { TournamentRequest } from '@foci2020/shared/types/requests';

export interface ICreateTournamentService {
  (ctx: {
    body: TournamentRequest;
    isTestData: boolean;
  }): Promise<string>;
}

export const createTournamentServiceFactory = (
  databaseService: IDatabaseService,
  tournamentDocumentConverter: ITournamentDocumentConverter): ICreateTournamentService => {
  return async ({ body, isTestData }) => {
    const document = tournamentDocumentConverter.create(body, isTestData);

    await databaseService.saveTournament(document).catch((error) => {
      console.error('Save tournament', error);
      throw httpError(500, 'Error while saving tournament');
    });

    return document.id;
  };
};
