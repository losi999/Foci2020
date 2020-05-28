import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { v4 as uuid } from 'uuid';
import { TournamentRequest } from '@foci2020/shared/types/requests';
import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { addMinutes } from '@foci2020/shared/common/utils';

describe('PUT /tournament/v1/tournaments/{tournamentId}', () => {
  let tournamentConverter: ITournamentDocumentConverter;
  before(() => {
    tournamentConverter = tournamentDocumentConverterFactory(uuid);
  });

  const tournament: TournamentRequest = {
    tournamentName: 'EB 2020'
  };

  const tournamentToUpdate: TournamentRequest = {
    tournamentName: 'VB 2022'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestUpdateTournament(uuid(), tournamentToUpdate)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestUpdateTournament(uuid(), tournamentToUpdate)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should update a tournament', () => {
      const document = tournamentConverter.create(tournament);
      cy.saveTournamentDocument(document)
        .authenticate('admin1')
        .requestUpdateTournament(document.id, tournamentToUpdate)
        .expectOkResponse()
        .validateTournamentDocument(tournamentToUpdate, document.id);
    });

    describe('related matches', () => {
      let teamConverter: ITeamDocumentConverter;
      let matchConverter: IMatchDocumentConverter;

      let homeTeamDocument: TeamDocument;
      let awayTeamDocument: TeamDocument;
      let tournamentDocument: TournamentDocument;
      let matchDocument: MatchDocument;

      before(() => {
        teamConverter = teamDocumentConverterFactory(uuid);
        matchConverter = matchDocumentConverterFactory(uuid);

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

      it('should be updated if tournament is updated', () => {
        cy.authenticate('admin1')
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
            .requestUpdateTournament(uuid(), {
              ...tournament,
              tournamentName: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('tournamentName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(uuid(), {
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
            .requestUpdateTournament(`${uuid()}-not-valid`, tournamentToUpdate)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'pathParameters');
        });

        it('does not belong to any tournament', () => {
          cy.authenticate('admin1')
            .requestUpdateTournament(uuid(), tournamentToUpdate)
            .expectNotFoundResponse();
        });
      });
    });
  });
});
