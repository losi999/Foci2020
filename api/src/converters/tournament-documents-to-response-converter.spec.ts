import { default as converter } from '@/converters/tournament-documents-to-response-converter';
import { TournamentDocument } from '@/types/documents';
import { TournamentResponse } from '@/types/responses';

describe('Tournament documents to response converter', () => {
  let input: TournamentDocument;
  const tournamentId = 'tournamentId';
  const tournamentName = 'Tournament';
  beforeEach(() => {
    input = {
      tournamentId,
      tournamentName,
    } as TournamentDocument;
  });

  it('should convert document to response', () => {
    const expectedResponse: TournamentResponse = {
      tournamentId,
      tournamentName,
    };
    const result = converter(input);
    expect(result).toEqual(expectedResponse);
  });
});
