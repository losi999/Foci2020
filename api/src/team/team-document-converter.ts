import { v4String } from 'uuid/interfaces';
import { TeamRequest, TeamDocument, TeamResponse } from '@/shared/types/types';
import { internalDocumentPropertiesToRemove } from '@/shared/constants';

export interface ITeamDocumentConverter {
  create(teamRequest: TeamRequest): TeamDocument;
  update(teamId: string, teamRequest: TeamRequest): TeamDocument;
  toResponse(teamDocument: TeamDocument): TeamResponse;
  toResponseList(teamDocuments: TeamDocument[]): TeamResponse[];
}

export const teamDocumentConverterFactory = (uuid: v4String): ITeamDocumentConverter => {
  const toResponse = (teamDocument: TeamDocument): TeamResponse => {
    return {
      ...teamDocument,
      ...internalDocumentPropertiesToRemove,
      teamId: teamDocument.id,
    };
  };

  const update = (teamId: string, teamRequest: TeamRequest): TeamDocument => {
    return {
      ...teamRequest,
      id: teamId,
      documentType: 'team',
      orderingValue: teamRequest.teamName,
      'documentType-id': `team-${teamId}`
    };
  };

  return {
    toResponse,
    update,
    toResponseList: teamDocuments => teamDocuments.map<TeamResponse>(d => toResponse(d)),
    create: (teamRequest) => {
      const id = uuid();
      return update(id, teamRequest);
    },
  };
};
