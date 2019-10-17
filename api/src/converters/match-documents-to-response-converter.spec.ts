import { default as converter } from '@/converters/match-documents-to-response-converter';
import { MatchDocument } from '@/types/documents';
import { MatchResponse } from '@/types/responses';

describe('Match documents to response converter', () => {
  let input: MatchDocument[];
  const matchId = 'matchId';
  const group = 'group';
  const homeTeamName = 'homeTeam';
  const homeTeamId = 'homeTeamId';
  const homeTeamShortName = 'HMT';
  const homeTeamImage = 'http://image.com/home.png';
  const awayTeamName = 'awayTeam';
  const awayTeamId = 'awayTeamId';
  const awayTeamShortName = 'AWT';
  const awayTeamImage = 'http://image.com/away.png';
  const tournamentName = 'tournamentName';
  const tournamentId = 'tournamentId';
  const homeScore = 1;
  const awayScore = 2;
  const startTime = new Date(2019, 5, 5, 19, 0, 0);
  beforeEach(() => {
    input = [{
      matchId,
      group,
      segment: 'details',
      startTime: startTime.toISOString()
    }, {
      segment: 'homeTeam',
      teamName: homeTeamName,
      teamId: homeTeamId,
      shortName: homeTeamShortName,
      image: homeTeamImage
    }, {
      segment: 'awayTeam',
      teamName: awayTeamName,
      teamId: awayTeamId,
      shortName: awayTeamShortName,
      image: awayTeamImage
    }, {
      tournamentName,
      tournamentId,
      segment: 'tournament',
    }, {
      homeScore,
      awayScore,
      segment: 'finalScore',
    }] as MatchDocument[];
  });

  it('should convert documents to response', () => {
    const expectedResponse: MatchResponse = {
      matchId,
      group,
      startTime,
      tournament: {
        tournamentId,
        tournamentName
      },
      homeTeam: {
        teamName: homeTeamName,
        teamId: homeTeamId,
        shortName: homeTeamShortName,
        image: homeTeamImage
      },
      awayTeam: {
        teamName: awayTeamName,
        teamId: awayTeamId,
        shortName: awayTeamShortName,
        image: awayTeamImage
      },
      finalScore: {
        homeScore,
        awayScore
      }
    };
    const result = converter(input);
    expect(result).toEqual(expectedResponse);
  });
});
