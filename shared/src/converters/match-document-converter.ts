import { MatchDocument, TeamDocument, TournamentDocument } from '@foci2020/shared/types/documents';
import { MatchResponse } from '@foci2020/shared/types/responses';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { v4String } from 'uuid/interfaces';
import { concatenate, addSeconds } from '@foci2020/shared/common/utils';
import { internalDocumentPropertiesToRemove } from '@foci2020/shared/constants';
import { MatchIdType } from '@foci2020/shared/types/common';

export interface IMatchDocumentConverter {
  toResponse(matchDocument: MatchDocument): MatchResponse;
  toResponseList(matchDocuments: MatchDocument[]): MatchResponse[];
  create(matchRequest: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument, expiresIn: number): MatchDocument;
  update(matchId: MatchIdType, matchRequest: MatchRequest, homeTeam: TeamDocument, awayTeam: TeamDocument, tournament: TournamentDocument, expiresIn: number): MatchDocument;
}

export const matchDocumentConverterFactory = (uuid: v4String): IMatchDocumentConverter => {
  const documentType: MatchDocument['documentType'] = 'match';

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
    update: (matchId, matchRequest, homeTeam, awayTeam, tournament, expiresIn) => {
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
        'tournamentId-documentType': concatenate(matchRequest.tournamentId, documentType),
        expiresAt: expiresIn ? Math.floor(addSeconds(expiresIn).getTime() / 1000) : undefined
      };
    },
    toResponseList: matchDocuments => matchDocuments.map(d => instance.toResponse(d)),
    create: (matchRequest, homeTeam, awayTeam, tournament, expiresIn) => instance.update(uuid() as MatchIdType, matchRequest, homeTeam, awayTeam, tournament, expiresIn),
  };

  return instance;
};
