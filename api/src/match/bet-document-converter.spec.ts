import { IBetDocumentConverter, betDocumentConverterFactory } from '@/match/bet-document-converter';
import { betRequest, betDocument, betResponse } from '@/shared/converters/test-data-factory';

describe('Bet document converter', () => {
  let converter: IBetDocumentConverter;
  const userId = 'userId';
  const userName = 'userName';
  const matchId = 'matchId';
  const homeScore = 1;
  const awayScore = 2;
  const result = 2;

  beforeEach(() => {
    converter = betDocumentConverterFactory();
  });

  describe('create', () => {
    it('should create a bet document', () => {
      const input = betRequest(homeScore, awayScore);
      const expectedDocument = betDocument(userId, matchId, userName, homeScore, awayScore);

      const res = converter.create(input, userId, userName, matchId);
      expect(res).toEqual(expectedDocument);
      expect.assertions(1);
    });
  });

  describe('toResponseList', () => {
    it('should convert list of documents to response list', () => {
      const input = betDocument(userId, matchId, userName, homeScore, awayScore, result);
      const expectedResponse = betResponse(userId, userName, homeScore, awayScore, result);

      const [res] = converter.toResponseList([input]);
      expect(res).toEqual(expectedResponse);
      expect.assertions(1);
    });

    it('should convert list of documents to response list and hide other players bets scores', () => {
      const userId2 = 'userId2';
      const inputs = [
        betDocument(userId, matchId, userName, homeScore, awayScore, result),
        betDocument(userId2, matchId, userName, homeScore, awayScore, result)
      ];
      const expectedResponse = [
        betResponse(userId, userName, homeScore, awayScore, result),
        betResponse(userId2, userName, undefined, undefined, result)
      ];

      const results = converter.toResponseList(inputs, userId);
      expect(results).toEqual(expectedResponse);
      expect.assertions(1);
    });
  });
});
