import { TeamRequest } from '@foci2020/shared/types/requests';
import { TeamDocument } from '@foci2020/shared/types/documents';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { v4String } from 'uuid/interfaces';
import { concatenate } from '@foci2020/shared/common/utils';
import { internalDocumentPropertiesToRemove } from '@foci2020/shared/constants';

export interface ITeamDocumentConverter {
  create(teamRequest: TeamRequest): TeamDocument;
  update(teamId: string, teamRequest: TeamRequest): TeamDocument;
  toResponse(teamDocument: TeamDocument): TeamResponse;
  toResponseList(teamDocuments: TeamDocument[]): TeamResponse[];
}

export const teamDocumentConverterFactory = (uuid: v4String): ITeamDocumentConverter => {
  const documentType: TeamDocument['documentType'] = 'team';

  const instance: ITeamDocumentConverter = {
    toResponse: (teamDocument): TeamResponse => {
      return {
        ...teamDocument,
        ...internalDocumentPropertiesToRemove,
        teamId: teamDocument.id,
      };
    },
    update: (teamId, teamRequest): TeamDocument => {
      return {
        ...teamRequest,
        id: teamId,
        documentType,
        orderingValue: teamRequest.teamName,
        'documentType-id': concatenate(documentType, teamId)
      };
    },
    toResponseList: teamDocuments => teamDocuments.map<TeamResponse>(d => instance.toResponse(d)),
    create: (teamRequest) => {
      const id = uuid();
      return instance.update(id, teamRequest);
    },
  };

  return instance;
};
