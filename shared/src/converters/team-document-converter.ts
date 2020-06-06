import { TeamRequest } from '@foci2020/shared/types/requests';
import { TeamDocument } from '@foci2020/shared/types/documents';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { v4String } from 'uuid/interfaces';
import { concatenate, addMinutes } from '@foci2020/shared/common/utils';
import { internalDocumentPropertiesToRemove } from '@foci2020/shared/constants';

export interface ITeamDocumentConverter {
  create(teamRequest: TeamRequest, isTestData: boolean): TeamDocument;
  update(teamId: string, teamRequest: TeamRequest, isTestData: boolean): TeamDocument;
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
    update: (teamId, teamRequest, isTestData): TeamDocument => {
      return {
        ...teamRequest,
        documentType,
        id: teamId,
        orderingValue: teamRequest.teamName,
        'documentType-id': concatenate(documentType, teamId),
        expiresAt: isTestData ? Math.floor(addMinutes(60).getTime() / 1000) : undefined
      };
    },
    toResponseList: teamDocuments => teamDocuments.map<TeamResponse>(d => instance.toResponse(d)),
    create: (teamRequest, isTestData) => {
      const id = uuid();
      return instance.update(id, teamRequest, isTestData);
    },
  };

  return instance;
};
