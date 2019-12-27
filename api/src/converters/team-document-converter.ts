import { TeamDocument, TeamDocumentUpdatable } from '@/types/documents';
import { TeamResponse } from '@/types/responses';
import { TeamRequest } from '@/types/requests';
import { v4String } from 'uuid/interfaces';

export interface ITeamDocumentConverter {
  create(body: TeamRequest): TeamDocument;
  update(body: TeamRequest): TeamDocumentUpdatable;
  toResponse(document: TeamDocument): TeamResponse;
  toResponseList(documents: TeamDocument[]): TeamResponse[];
}

export const teamDocumentConverterFactory = (uuid: v4String): ITeamDocumentConverter => {
  const toResponse = ({ shortName, id, teamName, image }: TeamDocument): TeamResponse => {
    return {
      image,
      teamName,
      shortName,
      teamId: id
    };
  };

  return {
    toResponse,
    toResponseList: (documents): TeamResponse[] => {
      return documents.map<TeamResponse>(d => toResponse(d));
    },
    create: ({ image, teamName, shortName }): TeamDocument => {
      const id = uuid();
      return {
        id,
        image,
        teamName,
        shortName,
        documentType: 'team',
        orderingValue: teamName,
        'documentType-id': `team-${id}`
      };
    },
    update: ({ image, teamName, shortName }): TeamDocumentUpdatable => {
      return {
        image,
        teamName,
        shortName,
      };
    }
  };
};
