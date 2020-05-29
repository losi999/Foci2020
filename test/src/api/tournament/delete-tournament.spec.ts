import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';
import { tournamentConverter, teamConverter, matchConverter } from '@foci2020/test/api/dependencies';

describe('DELETE /tournament/v1/tournaments/{tournamentId}', () => {
  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestDeleteTournament(uuid())
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestDeleteTournament(uuid())
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should delete tournament', () => {
      const document = tournamentConverter.create(tournament);
      cy.saveTournamentDocument(document)
        .authenticate('admin1')
        .requestDeleteTournament(document.id)
        .expectOkResponse()
        .validateTournamentDeleted(document.id);
    });

    describe('related matches', () => {
      let homeTeamDocument: TeamDocument;
      let awayTeamDocument: TeamDocument;
      let tournamentDocument: TournamentDocument;
      let matchDocument: MatchDocument;

      before(() => {
        homeTeamDocument = teamConverter.create({
          teamName: 'Magyarország',
          image: 'http://image.com/hun.png',
          shortName: 'HUN',
        });
        awayTeamDocument = teamConverter.create({
          teamName: 'Anglia',
          image: 'http://image.com/eng.png',
          shortName: 'ENG',
        });
        tournamentDocument = tournamentConverter.create(tournament);
        matchDocument = matchConverter.create({
          homeTeamId: homeTeamDocument.id,
          awayTeamId: awayTeamDocument.id,
          tournamentId: tournamentDocument.id,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString()
        }, homeTeamDocument, awayTeamDocument, tournamentDocument);

        cy.saveTeamDocument(homeTeamDocument)
          .saveTeamDocument(awayTeamDocument)
          .saveTournamentDocument(tournamentDocument)
          .saveMatchDocument(matchDocument);
      });

      it('should be deleted if tournament is deleted', () => {
        cy.authenticate('admin1')
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
            .requestDeleteTournament(`${uuid()}-not-valid`)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });
      });
    });
  });
});
