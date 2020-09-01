import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';
import { tournamentConverter, teamConverter, matchConverter } from '@foci2020/test/api/dependencies';
import { TournamentIdType } from '@foci2020/shared/types/common';

describe('DELETE /tournament/v1/tournaments/{tournamentId}', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;

  beforeEach(() => {
    homeTeamDocument = teamConverter.create({
      teamName: 'Magyarország',
      image: 'http://image.com/hun.png',
      shortName: 'HUN',
    }, 600);
    awayTeamDocument = teamConverter.create({
      teamName: 'Anglia',
      image: 'http://image.com/eng.png',
      shortName: 'ENG',
    }, 600);
    tournamentDocument = tournamentConverter.create(tournament, 600);
    matchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument, 600);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestDeleteTournament(uuid() as TournamentIdType)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteTournament(uuid() as TournamentIdType)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should delete tournament', () => {
      cy.saveTournamentDocument(tournamentDocument)
        .authenticate('admin1')
        .requestDeleteTournament(tournamentDocument.id)
        .expectOkResponse()
        .validateTournamentDeleted(tournamentDocument.id);
    });

    describe('related matches', () => {
      it('should be deleted if tournament is deleted', () => {
        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument)
          .authenticate('admin1')
          .requestDeleteTournament(tournamentDocument.id)
          .expectOkResponse()
          .validateTournamentDeleted(tournamentDocument.id)
          .wait(2000)
          .validateMatchDeleted(matchDocument.id);
      });
    });

    describe('should return error', () => {
      describe('if tournamentId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestDeleteTournament(`${uuid()}-not-valid` as TournamentIdType)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
