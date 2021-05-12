import { IStandingDocumentConverter, standingDocumentConverterFactory } from '@foci2020/shared/converters/standing-document-converter';
import { BetDocument } from '@foci2020/shared/types/documents';
import { betDocument, standingDocument, standingResponse } from '@foci2020/shared/common/test-data-factory';
import { advanceTo } from 'jest-date-mock';
import { clear } from 'console';
import { TournamentIdType, UserIdType } from '@foci2020/shared/types/common';

describe('Standing document converter', () => {
  let converter: IStandingDocumentConverter;
  const userId = 'userId' as UserIdType;
  const userName = 'userName';
  const tournamentId = 'tournamentId' as TournamentIdType;
  const now = 1591443246;
  const nowDate = new Date(now * 1000);

  beforeEach(() => {
    converter = standingDocumentConverterFactory();

    advanceTo(nowDate);
  });

  afterEach(() => {
    clear();
  });

  describe('create', () => {
    it('should create a standing document', () => {
      const bets: BetDocument[] = [
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'nothing',
        }),
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'outcome',
        }),
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'goalDifference',
        }),
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'exactMatch',
        }),
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'outcome',
        }),
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
          exactMatch: 1,
        },
        modifiedAt: nowDate.toISOString(),
      });

      const result = converter.create(bets, NaN);
      expect(result).toEqual(expectedDocument);
    });

    it('should create a standing document with expiration date set if it is a test data', () => {
      const bets: BetDocument[] = [
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'nothing',
        }),
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'outcome',
        }),
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'goalDifference',
        }),
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'exactMatch',
        }),
        betDocument({
          userId,
          tournamentId,
          userName,
          result: 'outcome',
        }),
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
          exactMatch: 1,
        },
        expiresAt: now + 3600,
        modifiedAt: nowDate.toISOString(),
      });

      const result = converter.create(bets, 3600);
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
