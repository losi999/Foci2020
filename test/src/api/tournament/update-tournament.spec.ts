import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { TournamentIdType } from '@foci2020/shared/types/common';

describe('PUT /tournament/v1/tournaments/{tournamentId}', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  const tournamentToUpdate: TournamentRequest = {
    tournamentName: 'VB 2022'
  };

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
    tournamentDocument = tournamentDocumentConverter.create(tournament, Cypress.env('EXPIRES_IN'));
    matchDocument = matchDocumentConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, Cypress.env('EXPIRES_IN'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestUpdateTournament(uuid() as TournamentIdType, tournamentToUpdate)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestUpdateTournament(uuid() as TournamentIdType, tournamentToUpdate)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should update a tournament', () => {
      cy.saveTournamentDocument(tournamentDocument)
        .authenticate('admin1')
        .requestUpdateTournament(tournamentDocument.id, tournamentToUpdate)
        .expectOkResponse()
        .validateTournamentDocument(tournamentToUpdate, tournamentDocument.id);
    });

    describe('related matches', () => {
      it('should be updated if tournament is updated', () => {
        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument)
          .authenticate('admin1')
          .requestUpdateTournament(tournamentDocument.id, tournamentToUpdate)
          .expectOkResponse()
          .wait(2000)
          .validateUpdatedTournament(tournamentToUpdate, matchDocument, homeTeamDocument, awayTeamDocument, tournamentDocument, matchDocument.id);
      });
    });

    describe('should return error', () => {
      describe('if tournamentName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(uuid() as TournamentIdType, {
              ...tournament,
              tournamentName: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('tournamentName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(uuid() as TournamentIdType, {
              ...tournament,
              tournamentName: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('tournamentName', 'string', 'body');
        });
      });

      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(`${uuid()}-not-valid` as TournamentIdType, tournamentToUpdate)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });

        it('does not belong to any tournament', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(uuid() as TournamentIdType, tournamentToUpdate)
            .expectNotFoundResponse();
        });
      });
    });
  });
});
