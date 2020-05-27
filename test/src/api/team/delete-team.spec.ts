import { v4 as uuid } from 'uuid';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';

describe('DELETE /team/v1/teams/{teamId}', () => {
  let converter: ITeamDocumentConverter;
  before(() => {
    converter = teamDocumentConverterFactory(uuid);
  });

  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestDeleteTeam(uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteTeam(uuid())
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should delete team', () => {
      const document = converter.create(team);
      cy.saveTeamDocument(document)
        .authenticate('admin1')
        .requestDeleteTeam(document.id)
        .expectOkResponse()
        .validateTeamDeleted(document.id);
    });

    describe('related matches', () => {
      it.skip('should be deleted if "home team" is deleted', () => {

      });

      it.skip('should be deleted if "away team" is deleted', () => {

      });
    });

    describe('should return error', () => {
      describe('if teamId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestDeleteTeam(`${uuid()}-not-valid`)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('teamId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
