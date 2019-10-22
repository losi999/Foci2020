import { default as converter } from '@/converters/team-documents-to-response-converter';
import { TeamDocument } from '@/types/documents';
import { TeamResponse } from '@/types/responses';

describe('Team documents to response converter', () => {
  let input: TeamDocument;
  const teamId = 'teamId';
  const teamName = 'Team';
  const shortName = 'TMN';
  const image = 'http://image.com/team.png';
  beforeEach(() => {
    input = {
      teamId,
      teamName,
      shortName,
      image
    } as TeamDocument;
  });

  it('should convert documents to response', () => {
    const expectedResponse: TeamResponse = {
      teamId,
      teamName,
      shortName,
      image
    };
    const result = converter(input);
    expect(result).toEqual(expectedResponse);
  });
});
