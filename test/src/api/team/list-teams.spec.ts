import { TeamRequest } from '@foci2020/shared/types/requests';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { TeamDocument } from '@foci2020/shared/types/documents';
import { default as schema } from '@foci2020/test/api/schemas/team-response-list';

describe('GET /team/v1/teams', () => {
  const team1: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  const team2: TeamRequest = {
    teamName: 'Anglia',
    image: 'http://image.com/eng.png',
    shortName: 'ENG'
  };

  let teamDocument1: TeamDocument;
  let teamDocument2: TeamDocument;

  beforeEach(() => {
    teamDocument1 = teamDocumentConverter.create(team1, Cypress.env('EXPIRES_IN'));
    teamDocument2 = teamDocumentConverter.create(team2, Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetTeamList()
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetTeamList()
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should get a list of teams', () => {
      cy.saveTeamDocument(teamDocument1)
        .saveTeamDocument(teamDocument2)
        .authenticate('admin1')
        .requestGetTeamList()
        .expectOkResponse()
        .expectValidResponseSchema(schema);
    });
  });
});
