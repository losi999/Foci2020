import { TournamentDocument } from '@foci2020/shared/types/documents';
import { TournamentResponse } from '@foci2020/shared/types/responses';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { v4String } from 'uuid/interfaces';
import { concatenate, addSeconds } from '@foci2020/shared/common/utils';
import { internalDocumentPropertiesToRemove } from '@foci2020/shared/constants';
import { TournamentIdType } from '@foci2020/shared/types/common';

export interface ITournamentDocumentConverter {
  toResponse(tournamentDocument: TournamentDocument): TournamentResponse;
  toResponseList(tournamentDocuments: TournamentDocument[]): TournamentResponse[];
  create(tournamentRequest: TournamentRequest, expiresIn: number): TournamentDocument;
  update(tournamentId: TournamentIdType, tournamentRequest: TournamentRequest, expiresIn: number): TournamentDocument;
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
    update: (tournamentId, tournamentRequest, expiresIn): TournamentDocument => {
      return {
        ...tournamentRequest,
        documentType,
        id: tournamentId,
        orderingValue: tournamentRequest.tournamentName,
        'documentType-id': concatenate(documentType, tournamentId),
        expiresAt: expiresIn ? Math.floor(addSeconds(expiresIn).getTime() / 1000) : undefined
      };
    },
    toResponseList: tournamentDocuments => tournamentDocuments.map<TournamentResponse>(d => instance.toResponse(d)),
    create: (tournamentRequest, expiresIn) => {
      const id = uuid() as TournamentIdType;
      return instance.update(id, tournamentRequest, expiresIn);
    },
  };

  return instance;
};
