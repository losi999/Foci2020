import { IBetDocumentConverter, betDocumentConverterFactory } from '@/converters/bet-document-converter';
import { betRequest, betDocument, betResponse } from '@/converters/test-data-factory';
import { Score, BetDocument } from '@/types/types';

describe('Bet document converter', () => {
  let converter: IBetDocumentConverter;
  const userId = 'userId';
  const userName = 'userName';
  const matchId = 'matchId';
  const tournamentId = 'tournamentId';
  const homeScore = 1;
  const awayScore = 2;

  beforeEach(() => {
    converter = betDocumentConverterFactory();
  });

  describe('create', () => {
    it('should create a bet document', () => {
      const input = betRequest(homeScore, awayScore);
      const expectedDocument = betDocument(userId, matchId, tournamentId, userName, homeScore, awayScore);

      const res = converter.create(input, userId, userName, matchId, tournamentId);
      expect(res).toEqual(expectedDocument);
      expect.assertions(1);
    });
  });

  describe('toResponseList', () => {
    it('should convert list of documents to response list', () => {
      const input = betDocument(userId, matchId, tournamentId, userName, homeScore, awayScore, 'outcome');
      const expectedResponse = betResponse(userId, userName, homeScore, awayScore, 1);

      const [res] = converter.toResponseList([input]);
      expect(res).toEqual(expectedResponse);
      expect.assertions(1);
    });

    it('should convert list of documents to response list and hide other players bets scores', () => {
      const userId2 = 'userId2';
      const inputs = [
        betDocument(userId, matchId, tournamentId, userName, homeScore, awayScore, 'exactMatch'),
        betDocument(userId2, matchId, tournamentId, userName, homeScore, awayScore, 'goalDifference')
      ];
      const expectedResponse = [
        betResponse(userId, userName, homeScore, awayScore, 3),
        betResponse(userId2, userName, undefined, undefined, undefined)
      ];

      const results = converter.toResponseList(inputs, userId);
      expect(results).toEqual(expectedResponse);
      expect.assertions(1);
    });
  });

  describe('calculateResult', () => {
    describe('should set result to "outcome" if', () => {
      it('home victory is guessed', () => {
        const bet = betDocument(userId, matchId, tournamentId, userName, 1, 0);
        const finalScore: Score = {
          homeScore: 2,
          awayScore: 0
        };
        const expectedBet: BetDocument = {
          ...bet,
          result: 'outcome'
        };

        const result = converter.calculateResult(bet, finalScore);
        expect(result).toEqual(expectedBet);
      });

      it('away victory is guessed', () => {
        const bet = betDocument(userId, matchId, tournamentId, userName, 1, 3);
        const finalScore: Score = {
          homeScore: 0,
          awayScore: 1
        };
        const expectedBet: BetDocument = {
          ...bet,
          result: 'outcome'
        };

        const result = converter.calculateResult(bet, finalScore);
        expect(result).toEqual(expectedBet);
      });

      it('draw victory is guessed', () => {
        const bet = betDocument(userId, matchId, tournamentId, userName, 1, 1);
        const finalScore: Score = {
          homeScore: 2,
          awayScore: 2
        };
        const expectedBet: BetDocument = {
          ...bet,
          result: 'outcome'
        };

        const result = converter.calculateResult(bet, finalScore);
        expect(result).toEqual(expectedBet);
      });
    });

    describe('should set result to "goalDifference" if', () => {
      it('home victory is guessed with correct margin', () => {
        const bet = betDocument(userId, matchId, tournamentId, userName, 3, 1);
        const finalScore: Score = {
          homeScore: 2,
          awayScore: 0
        };
        const expectedBet: BetDocument = {
          ...bet,
          result: 'goalDifference'
        };

        const result = converter.calculateResult(bet, finalScore);
        expect(result).toEqual(expectedBet);
      });

      it('away victory is guessed with correct margin', () => {
        const bet = betDocument(userId, matchId, tournamentId, userName, 1, 2);
        const finalScore: Score = {
          homeScore: 0,
          awayScore: 1
        };
        const expectedBet: BetDocument = {
          ...bet,
          result: 'goalDifference'
        };

        const result = converter.calculateResult(bet, finalScore);
        expect(result).toEqual(expectedBet);
      });
    });

    describe('should set result to "exactMatch" if', () => {
      it('home victory is guessed correctly', () => {
        const bet = betDocument(userId, matchId, tournamentId, userName, 3, 1);
        const finalScore: Score = {
          homeScore: 3,
          awayScore: 1
        };
        const expectedBet: BetDocument = {
          ...bet,
          result: 'exactMatch'
        };

        const result = converter.calculateResult(bet, finalScore);
        expect(result).toEqual(expectedBet);
      });

      it('away victory is guessed correctly', () => {
        const bet = betDocument(userId, matchId, tournamentId, userName, 1, 2);
        const finalScore: Score = {
          homeScore: 1,
          awayScore: 2
        };
        const expectedBet: BetDocument = {
          ...bet,
          result: 'exactMatch'
        };

        const result = converter.calculateResult(bet, finalScore);
        expect(result).toEqual(expectedBet);
      });
    });

    it('should set result to "nothing" otherwise', () => {
      const bet = betDocument(userId, matchId, tournamentId, userName, 3, 1);
      const finalScore: Score = {
        homeScore: 0,
        awayScore: 1
      };
      const expectedBet: BetDocument = {
        ...bet,
        result: 'nothing'
      };

      const result = converter.calculateResult(bet, finalScore);
      expect(result).toEqual(expectedBet);
    });
  });
});
