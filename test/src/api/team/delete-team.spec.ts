import { v4 as uuid } from 'uuid';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';
import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';

describe('DELETE /team/v1/teams/{teamId}', () => {
  let teamConverter: ITeamDocumentConverter;
  before(() => {
    teamConverter = teamDocumentConverterFactory(uuid);
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
      const document = teamConverter.create(team);
      cy.saveTeamDocument(document)
        .authenticate('admin1')
        .requestDeleteTeam(document.id)
        .expectOkResponse()
        .validateTeamDeleted(document.id);
    });

    describe('related matches', () => {
      let matchConverter: IMatchDocumentConverter;
      let tournamentConverter: ITournamentDocumentConverter;

      let homeTeamDocument: TeamDocument;
      let awayTeamDocument: TeamDocument;
      let tournamentDocument: TournamentDocument;
      let matchDocument: MatchDocument;

      beforeEach(() => {
        matchConverter = matchDocumentConverterFactory(uuid);
        tournamentConverter = tournamentDocumentConverterFactory(uuid);

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
        tournamentDocument = tournamentConverter.create({
          tournamentName: 'EB 2020'
        });
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

      it('should be deleted if "home team" is deleted', () => {
        cy.authenticate('admin1')
          .requestDeleteTeam(homeTeamDocument.id)
          .expectOkResponse()
          .validateTeamDeleted(homeTeamDocument.id)
          .wait(1000)
          .validateMatchDeleted(matchDocument.id);
      });

      it('should be deleted if "away team" is deleted', () => {
        cy.authenticate('admin1')
          .requestDeleteTeam(awayTeamDocument.id)
          .expectOkResponse()
          .validateTeamDeleted(awayTeamDocument.id)
          .wait(1000)
          .validateMatchDeleted(matchDocument.id);
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
