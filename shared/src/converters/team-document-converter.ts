import { TeamRequest } from '@foci2020/shared/types/requests';
import { TeamDocument } from '@foci2020/shared/types/documents';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { v4String } from 'uuid/interfaces';
import { concatenate, addSeconds } from '@foci2020/shared/common/utils';
import { internalDocumentPropertiesToRemove } from '@foci2020/shared/constants';
import { KeyType, TeamIdType } from '@foci2020/shared/types/common';

export interface ITeamDocumentConverter {
  create(teamRequest: TeamRequest, expiresIn: number): TeamDocument;
  update(teamId: TeamIdType, teamRequest: TeamRequest, expiresIn: number): TeamDocument;
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
    update: (teamId, teamRequest, expiresIn): TeamDocument => {
      return {
        ...teamRequest,
        documentType,
        id: teamId,
        orderingValue: teamRequest.teamName,
        'documentType-id': concatenate(documentType, teamId) as KeyType,
        expiresAt: expiresIn ? Math.floor(addSeconds(expiresIn).getTime() / 1000) : undefined,
        modifiedAt: new Date().toISOString(),
      };
    },
    toResponseList: teamDocuments => teamDocuments.map<TeamResponse>(d => instance.toResponse(d)),
    create: (teamRequest, expiresIn) => {
      const id = uuid() as TeamIdType;
      return instance.update(id, teamRequest, expiresIn);
    },
  };

  return instance;
};
