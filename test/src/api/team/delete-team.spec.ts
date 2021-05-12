import { v4 as uuid } from 'uuid';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { TeamIdType } from '@foci2020/shared/types/common';

describe('DELETE /team/v1/teams/{teamId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;

  beforeEach(() => {
    homeTeamDocument = teamDocumentConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    }, Cypress.env('EXPIRES_IN'));
    awayTeamDocument = teamDocumentConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    }, Cypress.env('EXPIRES_IN'));
    tournamentDocument = tournamentDocumentConverter.create({
      tournamentName: 'EB 2020', 
    }, Cypress.env('EXPIRES_IN'));
    matchDocument = matchDocumentConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString(),
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestDeleteTeam(uuid() as TeamIdType)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteTeam(uuid() as TeamIdType)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should delete team', () => {
      cy.saveTeamDocument(homeTeamDocument)
        .authenticate('admin1')
        .requestDeleteTeam(homeTeamDocument.id)
        .expectOkResponse()
        .validateTeamDeleted(homeTeamDocument.id);
    });

    describe('related matches', () => {
      it('should be deleted if "home team" is deleted', () => {
        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument)
          .authenticate('admin1')
          .requestDeleteTeam(homeTeamDocument.id)
          .expectOkResponse()
          .validateTeamDeleted(homeTeamDocument.id)
          .wait(2000)
          .validateMatchDeleted(matchDocument.id);
      });

      it('should be deleted if "away team" is deleted', () => {
        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument)
          .authenticate('admin1')
          .requestDeleteTeam(awayTeamDocument.id)
          .expectOkResponse()
          .validateTeamDeleted(awayTeamDocument.id)
          .wait(2000)
          .validateMatchDeleted(matchDocument.id);
      });
    });

    describe('should return error', () => {
      describe('if teamId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestDeleteTeam(`${uuid()}-not-valid` as TeamIdType)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('teamId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
