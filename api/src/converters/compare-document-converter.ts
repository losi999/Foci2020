import { CompareResponse, BetDocument, MatchDocument } from '@/types/types';
import { addMinutes } from '@/common';

type MatchBetMap = {
  [matchId: string]: BetDocument;
};

export interface ICompareDocumentConverter {
  toResponse(matches: MatchDocument[], leftUserBets: MatchBetMap, rightUserBets: MatchBetMap, leftUserName: string, rightUserName: string): CompareResponse;
}

export const compareDocumentConverterFactory = (): ICompareDocumentConverter => {
  const instance: ICompareDocumentConverter = {
    toResponse: (matches, leftUserBets, rightUserBets, leftUserName, rightUserName) => {

      const compareMatches: CompareResponse['matches'] = matches.map<CompareResponse['matches'][0]>((m) => {
        const leftBet = leftUserBets[m.id];
        const rightBet = rightUserBets[m.id];
        const showScore = leftBet || addMinutes(5) > new Date(m.startTime);

        return {
          homeFlag: m.homeTeam.image,
          awayFlag: m.awayTeam.image,
          matchScore: m.finalScore,
          leftScore: leftBet ? {
            homeScore: leftBet.homeScore,
            awayScore: leftBet.awayScore,
            result: leftBet.result
          } : undefined,
          rightScore: rightBet && showScore ? {
            homeScore: rightBet.homeScore,
            awayScore: rightBet.awayScore,
            result: rightBet.result
          } : undefined,
        };
      });

      return {
        leftUserName,
        rightUserName,
        matches: compareMatches
      };
    },
  };

  return instance;
};
