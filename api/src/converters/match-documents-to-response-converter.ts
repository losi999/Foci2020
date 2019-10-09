import { MatchResponse, MatchDocument, Converter } from '@/types';
const converter: Converter<MatchDocument[], MatchResponse> = (documents) => {
  return documents.reduce((accumulator, currentValue) => {
    let temp: MatchResponse;

    switch (currentValue.sortKey) {
      case 'details': {
        const { matchId, group, startTime } = currentValue;
        temp = {
          ...accumulator,
          matchId,
          group,
          startTime: new Date(startTime)
        };
      } break;
      case 'homeTeam': {
        const { teamId, teamName, shortName, image } = currentValue;
        temp = {
          ...accumulator,
          homeTeam: {
            teamId,
            teamName,
            shortName,
            image
          }
        };
      } break;
      case 'awayTeam': {
        const { teamId, teamName, shortName, image } = currentValue;
        temp = {
          ...accumulator,
          awayTeam: {
            teamId,
            teamName,
            shortName,
            image
          }
        };
      } break;
      case 'tournament': {
        const { tournamentId, tournamentName } = currentValue;
        temp = {
          ...accumulator,
          tournament: {
            tournamentId,
            tournamentName
          }
        };
      } break;
      case 'finalScore': {
        const { homeScore, awayScore } = currentValue;
        temp = {
          ...accumulator,
          finalScore: {
            homeScore,
            awayScore
          }
        };
      } break;
    }
    return temp;
  }, {} as MatchResponse);
};
export default converter;
