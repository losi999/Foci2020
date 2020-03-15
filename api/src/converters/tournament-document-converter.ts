import { v4String } from 'uuid/interfaces';
import { TournamentDocument, TournamentResponse, TournamentRequest } from '@/types/types';
import { internalDocumentPropertiesToRemove } from '@/constants';
import { concatenate } from '@/common';

export interface ITournamentDocumentConverter {
  toResponse(tournamentDocument: TournamentDocument): TournamentResponse;
  toResponseList(tournamentDocuments: TournamentDocument[]): TournamentResponse[];
  create(tournamentRequest: TournamentRequest): TournamentDocument;
  update(tournamentId: string, tournamentRequest: TournamentRequest): TournamentDocument;
}

export const tournamentDocumentConverterFactory = (uuid: v4String): ITournamentDocumentConverter => {
  const toResponse = (tournamentDocument: TournamentDocument): TournamentResponse => {
    return {
      ...tournamentDocument,
      ...internalDocumentPropertiesToRemove,
      tournamentId: tournamentDocument.id
    };
  };

  const update = (tournamentId: string, tournamentRequest: TournamentRequest): TournamentDocument => {
    return {
      ...tournamentRequest,
      id: tournamentId,
      documentType: 'tournament',
      orderingValue: tournamentRequest.tournamentName,
      'documentType-id': concatenate('tournament', tournamentId)
    };
  };
  return {
    toResponse,
    update,
    toResponseList: tournamentDocuments => tournamentDocuments.map<TournamentResponse>(d => toResponse(d)),
    create: (tournamentRequest) => {
      const id = uuid();
      return update(id, tournamentRequest);
    },
  };
};
