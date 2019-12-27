import { TournamentDocument, TournamentDocumentUpdatable } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';
import { TournamentRequest } from '@/types/requests';
import { v4String } from 'uuid/interfaces';

export interface ITournamentDocumentConverter {
  toResponse(document: TournamentDocument): TournamentResponse;
  toResponseList(documents: TournamentDocument[]): TournamentResponse[];
  create(body: TournamentRequest): TournamentDocument;
  update(body: TournamentRequest): TournamentDocumentUpdatable;
}

export const tournamentDocumentConverterFactory = (uuid: v4String): ITournamentDocumentConverter => {
  const toResponse = ({ id, tournamentName }: TournamentDocument): TournamentResponse => {
    return {
      tournamentName,
      tournamentId: id
    };
  };

  return {
    toResponse,
    toResponseList: (documents): TournamentResponse[] => {
      return documents.map<TournamentResponse>(d => toResponse(d));
    },
    create: ({ tournamentName }): TournamentDocument => {
      const id = uuid();
      return {
        id,
        tournamentName,
        documentType: 'tournament',
        orderingValue: tournamentName,
        'documentType-id': `tournament-${id}`
      };
    },
    update: ({ tournamentName }): TournamentDocumentUpdatable => {
      return {
        tournamentName
      };
    }
  };
};
