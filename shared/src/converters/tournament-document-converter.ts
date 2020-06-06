import { TournamentDocument } from '@foci2020/shared/types/documents';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { v4String } from 'uuid/interfaces';
import { concatenate, addMinutes } from '@foci2020/shared/common/utils';
import { internalDocumentPropertiesToRemove } from '@foci2020/shared/constants';

export interface ITournamentDocumentConverter {
  toResponse(tournamentDocument: TournamentDocument): TournamentResponse;
  toResponseList(tournamentDocuments: TournamentDocument[]): TournamentResponse[];
  create(tournamentRequest: TournamentRequest, isTestData: boolean): TournamentDocument;
  update(tournamentId: string, tournamentRequest: TournamentRequest, isTestData: boolean): TournamentDocument;
}

export const tournamentDocumentConverterFactory = (uuid: v4String): ITournamentDocumentConverter => {
  const documentType: TournamentDocument['documentType'] = 'tournament';

  const instance: ITournamentDocumentConverter = {
    toResponse: (tournamentDocument): TournamentResponse => {
      return {
        ...tournamentDocument,
        ...internalDocumentPropertiesToRemove,
        tournamentId: tournamentDocument.id
      };
    },
    update: (tournamentId, tournamentRequest, isTestData): TournamentDocument => {
      return {
        ...tournamentRequest,
        documentType,
        id: tournamentId,
        orderingValue: tournamentRequest.tournamentName,
        'documentType-id': concatenate(documentType, tournamentId),
        expiresAt: isTestData ? Math.floor(addMinutes(60).getTime() / 1000) : undefined
      };
    },
    toResponseList: tournamentDocuments => tournamentDocuments.map<TournamentResponse>(d => instance.toResponse(d)),
    create: (tournamentRequest, isTestData) => {
      const id = uuid();
      return instance.update(id, tournamentRequest, isTestData);
    },
  };

  return instance;
};
