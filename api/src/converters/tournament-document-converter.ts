import { v4String } from 'uuid/interfaces';
import { TournamentDocument, TournamentResponse, TournamentRequest } from '@/types/types';
import { internalDocumentPropertiesToRemove } from '@/constants';

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

  return {
    toResponse,
    toResponseList: tournamentDocuments => tournamentDocuments.map<TournamentResponse>(d => toResponse(d)),
    create: (tournamentRequest) => {
      const id = uuid();
      return {
        ...tournamentRequest,
        id,
        documentType: 'tournament',
        orderingValue: tournamentRequest.tournamentName,
        'documentType-id': `tournament-${id}`
      };
    },
    update: (tournamentId, tournamentRequest) => {
      return {
        ...tournamentRequest,
        id: tournamentId,
        documentType: 'tournament',
        orderingValue: tournamentRequest.tournamentName,
        'documentType-id': `tournament-${tournamentId}`
      };
    }
  };
};
