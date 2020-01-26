import {
  MatchDocument,
  TeamDocument,
  TournamentDocument,
  MatchDocumentUpdatable,
} from '@/types/documents';
import { MatchResponse } from '@/types/responses';
import { MatchRequest } from '@/types/requests';
import { v4String } from 'uuid/interfaces';

export interface IMatchDocumentConverter {
  toResponse(documents: MatchDocument): MatchResponse;
  toResponseList(documents: MatchDocument[]): MatchResponse[];
  create(body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): MatchDocument;
  update(body: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): MatchDocumentUpdatable;
}

export const matchDocumentConverterFactory = (uuid: v4String): IMatchDocumentConverter => {
  const toResponse = ({ startTime, group, id, homeTeam, awayTeam, tournament, homeScore, awayScore }: MatchDocument): MatchResponse => {
    return {
      group,
      startTime,
      matchId: id,
      homeTeam: {
        teamId: homeTeam.id,
        teamName: homeTeam.teamName,
        shortName: homeTeam.shortName,
        image: homeTeam.image,
      },
      awayTeam: {
        teamId: awayTeam.id,
        teamName: awayTeam.teamName,
        shortName: awayTeam.shortName,
        image: awayTeam.image,
      },
      tournament: {
        tournamentId: tournament.id,
        tournamentName: tournament.tournamentName,
      },
      finalScore: {
        homeScore,
        awayScore
      }
    };
  };

  return {
    toResponse,
    toResponseList: (documents): MatchResponse[] => {
      return documents.map<MatchResponse>(d => toResponse(d));
    },
    create: ({ startTime, group, awayTeamId, homeTeamId, tournamentId }, homeTeam, awayTeam, tournament): MatchDocument => {
      const id = uuid();
      return {
        startTime,
        group,
        awayTeamId,
        homeTeamId,
        tournamentId,
        homeTeam,
        awayTeam,
        tournament,
        id,
        documentType: 'match',
        orderingValue: `${tournamentId}-${startTime}`,
        'documentType-id': `match-${id}`
      };
    },
    update: ({ startTime, group, awayTeamId, homeTeamId, tournamentId }, homeTeam, awayTeam, tournament): MatchDocumentUpdatable => {
      return {
        startTime,
        group,
        awayTeamId,
        homeTeamId,
        tournamentId,
        homeTeam,
        awayTeam,
        tournament,
      };
    }
  };
};
