import { v4String } from 'uuid/interfaces';
import { MatchDocument, MatchResponse, MatchRequest, TeamDocument, TournamentDocument, DocumentType } from '@/types/types';
import { internalDocumentPropertiesToRemove } from '@/constants';
import { concatenate } from '@/common';

export interface IMatchDocumentConverter {
  toResponse(matchDocument: MatchDocument): MatchResponse;
  toResponseList(matchDocuments: MatchDocument[]): MatchResponse[];
  create(matchRequest: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): MatchDocument;
  update(matchId: string, matchRequest: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument): MatchDocument;
}

export const matchDocumentConverterFactory = (uuid: v4String): IMatchDocumentConverter => {
  const documentType: DocumentType = 'match';

  const instance: IMatchDocumentConverter = {
    toResponse: (matchDocument) => {
      return {
        ...matchDocument,
        ...internalDocumentPropertiesToRemove,
        matchId: matchDocument.id,
        homeScore: undefined,
        awayScore: undefined,
        homeTeamId: undefined,
        awayTeamId: undefined,
        tournamentId: undefined,
        'awayTeamId-documentType': undefined,
        'homeTeamId-documentType': undefined,
        'tournamentId-documentType': undefined,
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
        finalScore: matchDocument.finalScore
      };
    },
    update: (matchId, matchRequest, homeTeam, awayTeam, tournament) => {
      return {
        ...matchRequest,
        homeTeam,
        awayTeam,
        tournament,
        documentType,
        id: matchId,
        orderingValue: matchRequest.startTime,
        'documentType-id': concatenate(documentType, matchId),
        'homeTeamId-documentType': concatenate(matchRequest.homeTeamId, documentType),
        'awayTeamId-documentType': concatenate(matchRequest.awayTeamId, documentType),
        'tournamentId-documentType': concatenate(matchRequest.tournamentId, documentType)
      };
    },
    toResponseList: matchDocuments => matchDocuments.map(d => instance.toResponse(d)),
    create: (matchRequest, homeTeam, awayTeam, tournament) => instance.update(uuid(), matchRequest, homeTeam, awayTeam, tournament),
  };

  return instance;
};
