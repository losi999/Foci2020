import { IStandingDocumentConverter, standingDocumentConverterFactory } from '@/converters/standing-document-converter';
import { BetDocument, StandingDocument } from '@/types/types';
import { betDocument } from './test-data-factory';

describe('Standing document converter', () => {
  let converter: IStandingDocumentConverter;
  const userId = 'userId';
  const userName = 'userName';
  const tournamentId = 'tournamentId';

  beforeEach(() => {
    converter = standingDocumentConverterFactory();
  });

  describe('create', () => {
    it('should create a standing document', () => {
      const bets: BetDocument[] = [
        betDocument({ userId, tournamentId, userName, result: 'nothing' }),
        betDocument({ userId, tournamentId, userName, result: 'outcome' }),
        betDocument({ userId, tournamentId, userName, result: 'goalDifference' }),
        betDocument({ userId, tournamentId, userName, result: 'exactMatch' }),
        betDocument({ userId, tournamentId, userName, result: 'outcome' }),
      ];

      const expectedDocument: StandingDocument = {
        userName,
        tournamentId,
        userId,
        'tournamentId-documentType': `${tournamentId}#standing`,
        id: `${tournamentId}#${userId}`,
        'documentType-id': `standing#${tournamentId}#${userId}`,
        documentType: 'standing',
        orderingValue: '0007#0001#0001#0002',
        total: 7,
        results: {
          nothing: 1,
          outcome: 2,
          goalDifference: 1,
          exactMatch: 1
        }
      };

      const result = converter.create(bets);
      expect(result).toEqual(expectedDocument);
    });
  });
});
