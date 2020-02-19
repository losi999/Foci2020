import { v4String } from 'uuid/interfaces';
import { MatchDocument, MatchResponse, MatchRequest, TeamDocument, TournamentDocument } from '@/shared/types/types';
import { internalDocumentPropertiesToRemove } from '@/shared/constants';

export interface IMatchDocumentConverter {
  toResponse(matchDocument: MatchDocument): MatchResponse;
  toResponseList(matchDocuments: MatchDocument[]): MatchResponse[];
  create(matchRequest: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): MatchDocument;
  update(matchId: string, matchRequest: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): MatchDocument;
}

export const matchDocumentConverterFactory = (uuid: v4String): IMatchDocumentConverter => {
  const toResponse = (matchDocument: MatchDocument): MatchResponse => {
    return {
      ...matchDocument,
      ...internalDocumentPropertiesToRemove,
      matchId: matchDocument.id,
      homeScore: undefined,
      awayScore: undefined,
      homeTeamId: undefined,
      awayTeamId: undefined,
      tournamentId: undefined,
      homeTeam: {
        ...matchDocument.homeTeam,
        ...internalDocumentPropertiesToRemove,
        teamId: matchDocument.homeTeam.id
      },
      awayTeam: {
        ...matchDocument.awayTeam,
        ...internalDocumentPropertiesToRemove,
        teamId: matchDocument.awayTeam.id
      },
      tournament: {
        ...matchDocument.tournament,
        ...internalDocumentPropertiesToRemove,
        tournamentId: matchDocument.tournament.id
      },
      finalScore: {
        homeScore: matchDocument.homeScore,
        awayScore: matchDocument.awayScore,
      }
    };
  };

  const update = (matchId: string, matchRequest: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): MatchDocument => {
    return {
      ...matchRequest,
      homeTeam,
      awayTeam,
      tournament,
      id: matchId,
      documentType: 'match',
      orderingValue: `${matchRequest.tournamentId}-${matchRequest.startTime}`,
      'documentType-id': `match-${matchId}`
    };
  };

  return {
    toResponse,
    update,
    toResponseList: matchDocuments => matchDocuments.map<MatchResponse>(d => toResponse(d)),
    create: (matchRequest, homeTeam, awayTeam, tournament) => {
      const id = uuid();
      return update(id, matchRequest, homeTeam, awayTeam, tournament);
    },
  };
};
