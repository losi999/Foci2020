import { IStandingDocumentConverter, standingDocumentConverterFactory } from '@foci2020/shared/converters/standing-document-converter';
import { BetDocument } from '@foci2020/shared/types/documents';
import { betDocument, standingDocument, standingResponse } from '@foci2020/shared/common/test-data-factory';
import { advanceTo } from 'jest-date-mock';
import { clear } from 'console';

describe('Standing document converter', () => {
  let converter: IStandingDocumentConverter;
  const userId = 'userId';
  const userName = 'userName';
  const tournamentId = 'tournamentId';
  const now = 1591443246;

  beforeEach(() => {
    converter = standingDocumentConverterFactory();

    advanceTo(new Date(now * 1000));
  });

  afterEach(() => {
    clear();
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

      const expectedDocument = standingDocument({
        userName,
        tournamentId,
        userId,
        total: 7,
        results: {
          nothing: 1,
          outcome: 2,
          goalDifference: 1,
          exactMatch: 1
        }
      });

      const result = converter.create(bets, false);
      expect(result).toEqual(expectedDocument);
    });

    it('should create a standing document with expiration date set if it is a test data', () => {
      const bets: BetDocument[] = [
        betDocument({ userId, tournamentId, userName, result: 'nothing' }),
        betDocument({ userId, tournamentId, userName, result: 'outcome' }),
        betDocument({ userId, tournamentId, userName, result: 'goalDifference' }),
        betDocument({ userId, tournamentId, userName, result: 'exactMatch' }),
        betDocument({ userId, tournamentId, userName, result: 'outcome' }),
      ];

      const expectedDocument = standingDocument({
        userName,
        tournamentId,
        userId,
        total: 7,
        results: {
          nothing: 1,
          outcome: 2,
          goalDifference: 1,
          exactMatch: 1
        },
        expiresAt: now + 3600
      });

      const result = converter.create(bets, true);
      expect(result).toEqual(expectedDocument);
    });
  });

  describe('toResponseList', () => {
    it('should convert list of documents to list of responses', () => {
      const input = standingDocument();
      const expectedResponse = standingResponse();

      const result = converter.toResponseList([input]);
      expect(result).toEqual([expectedResponse]);
    });
  });
});
