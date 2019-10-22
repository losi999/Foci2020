import { Converter } from '@/types/types';
import { MatchDocument, MatchDetailsDocument, MatchTeamDocument, MatchTeamUpdateDocument, MatchTournamentDocument, MatchFinalScoreDocument } from '@/types/documents';
import { MatchResponse } from '@/types/responses';

type MatchCombined = {
  details: MatchDetailsDocument;
  homeTeam: MatchTeamDocument;
  awayTeam: MatchTeamUpdateDocument;
  tournament: MatchTournamentDocument;
  finalScore: MatchFinalScoreDocument;
};

const converter: Converter<MatchDocument[], MatchResponse> = (documents) => {
  const initial = {
    awayTeam: {},
    details: {},
    finalScore: {},
    homeTeam: {},
    tournament: {}
  } as MatchCombined;
  const { details, awayTeam, finalScore, homeTeam, tournament } = documents.reduce<MatchCombined>((accumulator, currentValue) => {
    switch (currentValue.segment) {
      case 'details':
        return {
          ...accumulator,
          details: currentValue
        };
      case 'homeTeam':
        return {
          ...accumulator,
          homeTeam: currentValue
        };
      case 'awayTeam':
        return {
          ...accumulator,
          awayTeam: currentValue
        };
      case 'tournament':
        return {
          ...accumulator,
          tournament: currentValue
        };
      case 'finalScore':
        return {
          ...accumulator,
          finalScore: currentValue
        };
    }
  }, initial);

  return {
    matchId: details.matchId,
    group: details.group,
    startTime: details.startTime,
    homeTeam: {
      teamId: homeTeam.teamId,
      teamName: homeTeam.teamName,
      shortName: homeTeam.shortName,
      image: homeTeam.image,
    },
    awayTeam: {
      teamId: awayTeam.teamId,
      teamName: awayTeam.teamName,
      shortName: awayTeam.shortName,
      image: awayTeam.image,
    },
    tournament: {
      tournamentId: tournament.tournamentId,
      tournamentName: tournament.tournamentName,
    },
    finalScore: {
      homeScore: finalScore.homeScore,
      awayScore: finalScore.awayScore
    }
  };
};
export default converter;
