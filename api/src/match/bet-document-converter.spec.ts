import { IBetDocumentConverter, betDocumentConverterFactory } from '@/match/bet-document-converter';
import { betRequest, betDocument } from '@/shared/converters/test-data-factory';

describe('Bet document converter', () => {
  let converter: IBetDocumentConverter;
  const userId = 'userId';
  const userName = 'userName';
  const matchId = 'matchId';

  beforeEach(() => {
    converter = betDocumentConverterFactory();
  });

  describe('create', () => {

    it('should create a bet document', () => {
      const input = betRequest();
      const expectedDocument = betDocument(userId, matchId, userName);
      const result = converter.create(input, userId, userName, matchId);
      expect(result).toEqual(expectedDocument);
      expect.assertions(1);
    });
  });
});
