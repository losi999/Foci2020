import { Converter } from '@/types/types';
import { TeamDocument } from '@/types/documents';
import { TeamResponse } from '@/types/responses';

const converter: Converter<TeamDocument, TeamResponse> = ({ teamId, teamName, shortName, image }) => {
  return {
    teamId,
    teamName,
    shortName,
    image
  };
};
export default converter;
