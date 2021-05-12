import { advanceTo, clear } from 'jest-date-mock';
import { ICompareDocumentConverter, compareDocumentConverterFactory } from '@foci2020/shared/converters/compare-document-converter';
import { matchDocument, teamDocument, betDocument, compareResponse } from '@foci2020/shared/common/test-data-factory';
import { addMinutes } from '@foci2020/shared/common/utils';

describe('Compare document converter', () => {
  let converter: ICompareDocumentConverter;

  beforeEach(() => {
    advanceTo(new Date(2020, 3, 31, 23, 22, 0));

    converter = compareDocumentConverterFactory();
  });

  afterEach(() => {
    clear();
  });

  describe('toResponse', () => {
    const homeFlag = 'http://image.com/home.jpg';
    const awayFlag = 'http://image.com/away.jpg';
    const leftUserName = 'leftUser';
    const rightUserName = 'rightUser';

    describe('should show other player bets', () => {
      it('if betting time is expired', () => {
        const match = matchDocument({
          startTime: addMinutes(4).toISOString(),
          homeTeam: teamDocument({
            image: homeFlag, 
          }),
          awayTeam: teamDocument({
            image: awayFlag, 
          }),
        });

        const otherBet = betDocument({
          homeScore: 3,
          awayScore: 4, 
        });

        const expectedResult = compareResponse({
          leftUserName,
          rightUserName,
          matches: [
            {
              homeFlag,
              awayFlag,
              matchId: match.id,
              rightScore: {
                homeScore: otherBet.homeScore,
                awayScore: otherBet.awayScore,
              },
            },
          ],
        });

        const result = converter.toResponse([match], {}, {
          [match.id]: otherBet, 
        }, leftUserName, rightUserName);
        expect(result).toEqual(expectedResult);
      });

      it('if own player has already placed a bet', () => {
        const match = matchDocument({
          startTime: addMinutes(6).toISOString(),
          homeTeam: teamDocument({
            image: homeFlag, 
          }),
          awayTeam: teamDocument({
            image: awayFlag, 
          }),
        });

        const ownBet = betDocument({
          homeScore: 1,
          awayScore: 2, 
        });
        const otherBet = betDocument({
          homeScore: 3,
          awayScore: 4, 
        });

        const expectedResult = compareResponse({
          leftUserName,
          rightUserName,
          matches: [
            {
              homeFlag,
              awayFlag,
              matchId: match.id,
              leftScore: {
                homeScore: ownBet.homeScore,
                awayScore: ownBet.awayScore,
              },
              rightScore: {
                homeScore: otherBet.homeScore,
                awayScore: otherBet.awayScore,
              },
            },
          ],
        });

        const result = converter.toResponse([match], {
          [match.id]: ownBet, 
        }, {
          [match.id]: otherBet, 
        }, leftUserName, rightUserName);
        expect(result).toEqual(expectedResult);
      });
    });

    it('should hide other player bets', () => {
      const match = matchDocument({
        startTime: addMinutes(6).toISOString(),
        homeTeam: teamDocument({
          image: homeFlag, 
        }),
        awayTeam: teamDocument({
          image: awayFlag, 
        }),
      });

      const otherBet = betDocument({
        homeScore: 3,
        awayScore: 4, 
      });

      const expectedResult = compareResponse({
        leftUserName,
        rightUserName,
        matches: [
          {
            homeFlag,
            awayFlag,
            matchId: match.id,
          },
        ],
      });

      const result = converter.toResponse([match], {}, {
        [match.id]: otherBet, 
      }, leftUserName, rightUserName);
      expect(result).toEqual(expectedResult);
    });
  });
});
