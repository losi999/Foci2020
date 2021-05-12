import { IBetDocumentConverter, betDocumentConverterFactory } from '@foci2020/shared/converters/bet-document-converter';
import { betRequest, betDocument, betResponse } from '@foci2020/shared/common/test-data-factory';
import { BetDocument } from '@foci2020/shared/types/documents';
import { advanceTo, clear } from 'jest-date-mock';
import { TournamentIdType, MatchIdType, UserIdType } from '@foci2020/shared/types/common';

describe('Bet document converter', () => {
  let converter: IBetDocumentConverter;
  const userId = 'userId' as UserIdType;
  const userName = 'userName';
  const matchId = 'matchId' as MatchIdType;
  const tournamentId = 'tournamentId' as TournamentIdType;
  const homeScore = 1;
  const awayScore = 2;
  const now = 1591443246;
  const nowDate = new Date(now * 1000);

  beforeEach(() => {
    converter = betDocumentConverterFactory();

    advanceTo(nowDate);
  });

  afterEach(() => {
    clear();
  });

  describe('create', () => {
    it('should create a bet document', () => {
      const input = betRequest({
        homeScore,
        awayScore,
      });
      const expectedDocument = betDocument({
        userId,
        matchId,
        tournamentId,
        userName,
        homeScore,
        awayScore,
        modifiedAt: nowDate.toISOString(),
      });

      const res = converter.create(input,
        userId,
        userName,
        matchId,
        tournamentId,
        NaN);
      expect(res).toEqual(expectedDocument);
      expect.assertions(1);
    });

    it('should create a bet document with expiration date set if it is a test data', () => {
      const input = betRequest({
        homeScore,
        awayScore,
      });
      const expectedDocument = betDocument({
        userId,
        matchId,
        tournamentId,
        userName,
        homeScore,
        awayScore,
        expiresAt: now + 3600,
        modifiedAt: nowDate.toISOString(),
      });

      const res = converter.create(input,
        userId,
        userName,
        matchId,
        tournamentId,
        3600);
      expect(res).toEqual(expectedDocument);
      expect.assertions(1);
    });
  });

  describe('toResponseList', () => {
    it('should convert list of documents to response list', () => {
      const input = betDocument({
        result: 'outcome', 
      });
      const expectedResponse = betResponse({
        point: 1, 
        result: 'outcome',
      });

      const [res] = converter.toResponseList([input]);
      expect(res).toEqual(expectedResponse);
      expect.assertions(1);
    });

    it('should convert list of documents to response list and hide other players bets scores', () => {
      const userId2 = 'userId2' as UserIdType;
      const inputs = [
        betDocument({
          userId,
          homeScore,
          awayScore,
          result: 'exactMatch',
        }),

        betDocument({
          homeScore,
          awayScore,
          userId: userId2,
          result: 'goalDifference',
        }),
      ];
      const expectedResponse = [
        betResponse({
          userId,
          homeScore,
          awayScore,
          point: 3,
          result: 'exactMatch',
        }),

        betResponse({
          userId: userId2,
          homeScore: undefined,
          awayScore: undefined,
          point: 2,
          result: 'goalDifference',
        }),
      ];

      const results = converter.toResponseList(inputs, userId);
      expect(results).toEqual(expectedResponse);
      expect.assertions(1);
    });
  });

  describe('calculateResult', () => {
    describe('should set result to "outcome" if', () => {
      it('home victory is guessed', () => {
        const bet = betDocument({
          homeScore: 1,
          awayScore: 0,
        });

        const expectedBet: BetDocument = {
          ...bet,
          result: 'outcome',
        };

        const result = converter.calculateResult(bet, {
          homeScore: 2,
          awayScore: 0,
        });
        expect(result).toEqual(expectedBet);
      });

      it('away victory is guessed', () => {
        const bet = betDocument({
          homeScore: 1,
          awayScore: 3,
        });

        const expectedBet: BetDocument = {
          ...bet,
          result: 'outcome',
        };

        const result = converter.calculateResult(bet, {
          homeScore: 0,
          awayScore: 1,
        });
        expect(result).toEqual(expectedBet);
      });

      it('draw is guessed', () => {
        const bet = betDocument({
          homeScore: 1,
          awayScore: 1,
        });

        const expectedBet: BetDocument = {
          ...bet,
          result: 'outcome',
        };

        const result = converter.calculateResult(bet, {
          homeScore: 2,
          awayScore: 2,
        });
        expect(result).toEqual(expectedBet);
      });
    });

    describe('should set result to "goalDifference" if', () => {
      it('home victory is guessed with correct margin', () => {
        const bet = betDocument({
          homeScore: 3,
          awayScore: 1,
        });

        const expectedBet: BetDocument = {
          ...bet,
          result: 'goalDifference',
        };

        const result = converter.calculateResult(bet, {
          homeScore: 2,
          awayScore: 0,
        });
        expect(result).toEqual(expectedBet);
      });

      it('away victory is guessed with correct margin', () => {
        const bet = betDocument({
          homeScore: 1,
          awayScore: 2,
        });

        const expectedBet: BetDocument = {
          ...bet,
          result: 'goalDifference',
        };

        const result = converter.calculateResult(bet, {
          homeScore: 0,
          awayScore: 1,
        });
        expect(result).toEqual(expectedBet);
      });
    });

    describe('should set result to "exactMatch" if', () => {
      it('home victory is guessed correctly', () => {
        const bet = betDocument({
          homeScore: 3,
          awayScore: 1,
        });

        const expectedBet: BetDocument = {
          ...bet,
          result: 'exactMatch',
        };

        const result = converter.calculateResult(bet, {
          homeScore: 3,
          awayScore: 1,
        });
        expect(result).toEqual(expectedBet);
      });

      it('away victory is guessed correctly', () => {
        const bet = betDocument({
          homeScore: 1,
          awayScore: 2,
        });

        const expectedBet: BetDocument = {
          ...bet,
          result: 'exactMatch',
        };

        const result = converter.calculateResult(bet, {
          homeScore: 1,
          awayScore: 2,
        });
        expect(result).toEqual(expectedBet);
      });

      it('draw is guessed correctly', () => {
        const bet = betDocument({
          homeScore: 2,
          awayScore: 2,
        });

        const expectedBet: BetDocument = {
          ...bet,
          result: 'exactMatch',
        };

        const result = converter.calculateResult(bet, {
          homeScore: 2,
          awayScore: 2,
        });
        expect(result).toEqual(expectedBet);
      });
    });

    it('should set result to "nothing" otherwise', () => {
      const bet = betDocument({
        homeScore: 3,
        awayScore: 1,
      });

      const expectedBet: BetDocument = {
        ...bet,
        result: 'nothing',
      };

      const result = converter.calculateResult(bet, {
        homeScore: 0,
        awayScore: 1,
      });
      expect(result).toEqual(expectedBet);
    });
  });
});
