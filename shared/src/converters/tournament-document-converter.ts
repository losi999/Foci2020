import { TournamentDocument } from '@foci2020/shared/types/documents';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { v4String } from 'uuid/interfaces';
import { concatenate } from '@foci2020/shared/common/utils';
import { internalDocumentPropertiesToRemove } from '@foci2020/shared/constants';

export interface ITournamentDocumentConverter {
  toResponse(tournamentDocument: TournamentDocument): TournamentResponse;
  toResponseList(tournamentDocuments: TournamentDocument[]): TournamentResponse[];
  create(tournamentRequest: TournamentRequest): TournamentDocument;
  update(tournamentId: string, tournamentRequest: TournamentRequest): TournamentDocument;
}

export const tournamentDocumentConverterFactory = (uuid: v4String): ITournamentDocumentConverter => {
  const documentType: TournamentDocument['documentType'] = 'tournament';

  const instance: ITournamentDocumentConverter = {
    toResponse: (tournamentDocument: TournamentDocument): TournamentResponse => {
      return {
        ...tournamentDocument,
        ...internalDocumentPropertiesToRemove,
        tournamentId: tournamentDocument.id
      };
    },
    update: (tournamentId: string, tournamentRequest: TournamentRequest): TournamentDocument => {
      return {
        ...tournamentRequest,
        id: tournamentId,
        documentType,
        orderingValue: tournamentRequest.tournamentName,
        'documentType-id': concatenate(documentType, tournamentId)
      };
    },
    toResponseList: tournamentDocuments => tournamentDocuments.map<TournamentResponse>(d => instance.toResponse(d)),
    create: (tournamentRequest) => {
      const id = uuid();
      return instance.update(id, tournamentRequest);
    },
  };

  return instance;
};
