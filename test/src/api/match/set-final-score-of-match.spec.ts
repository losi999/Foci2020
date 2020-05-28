import { v4 as uuid } from 'uuid';
import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { MatchFinalScoreRequest } from '@foci2020/shared/types/requests';
import { addMinutes } from '@foci2020/shared/common/utils';

describe('PATCH /match/v1/matches/{matchId}', () => {
  let teamConverter: ITeamDocumentConverter;
  let tournamentConverter: ITournamentDocumentConverter;
  let matchConverter: IMatchDocumentConverter;

  before(() => {
    teamConverter = teamDocumentConverterFactory(uuid);
    tournamentConverter = tournamentDocumentConverterFactory(uuid);
    matchConverter = matchDocumentConverterFactory(uuid);
  });

  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument: TournamentDocument;
  let matchDocument: MatchDocument;
  const finalScore: MatchFinalScoreRequest = {
    homeScore: 1,
    awayScore: 2
  };

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
    tournamentDocument = tournamentConverter.create({
      tournamentName: 'EB 2020'
    });
    matchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(-110).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument);

    cy.saveTeamDocument(homeTeamDocument)
      .saveTeamDocument(awayTeamDocument)
      .saveTournamentDocument(tournamentDocument)
      .saveMatchDocument(matchDocument);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestSetFinalScoreOfMatch(matchDocument.id, finalScore)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestSetFinalScoreOfMatch(matchDocument.id, finalScore)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should set final score of match', () => {
      cy.authenticate('admin1')
        .requestSetFinalScoreOfMatch(matchDocument.id, finalScore)
        .expectOkResponse()
        .validateMatchFinalScore(finalScore, matchDocument, homeTeamDocument, awayTeamDocument, tournamentDocument, matchDocument.id);
    });
  });

  describe('should return error', () => {
    describe('if matchId', () => {
      it('is not uuid', () => {
        cy.authenticate('admin1')
          .requestSetFinalScoreOfMatch(`${uuid()}-not-valid`, finalScore)
          .expectBadRequestResponse()
          .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
      });

      it('does not belong to any match', () => {
        cy.authenticate('admin1')
          .requestSetFinalScoreOfMatch(uuid(), finalScore)
          .expectNotFoundResponse();
      });
    });

    describe('if homeScore', () => {
      it('is missing from body', () => {
        cy.authenticate('admin1')
          .requestSetFinalScoreOfMatch(matchDocument.id, {
            ...finalScore,
            homeScore: undefined
          })
          .expectBadRequestResponse()
          .expectRequiredProperty('homeScore', 'body');
      });

      it('is not integer', () => {
        cy.authenticate('admin1')
          .requestSetFinalScoreOfMatch(matchDocument.id, {
            ...finalScore,
            homeScore: 'a' as any
          })
          .expectBadRequestResponse()
          .expectWrongPropertyType('homeScore', 'integer', 'body');
      });

      it('is less than 0', () => {
        cy.authenticate('admin1')
          .requestSetFinalScoreOfMatch(matchDocument.id, {
            ...finalScore,
            homeScore: -1
          })
          .expectBadRequestResponse()
          .expectTooSmallNumberProperty('homeScore', 0, 'body');
      });
    });

    describe('if awayScore', () => {
      it('is missing from body', () => {
        cy.authenticate('admin1')
          .requestSetFinalScoreOfMatch(matchDocument.id, {
            ...finalScore,
            awayScore: undefined
          })
          .expectBadRequestResponse()
          .expectRequiredProperty('awayScore', 'body');
      });

      it('is not integer', () => {
        cy.authenticate('admin1')
          .requestSetFinalScoreOfMatch(matchDocument.id, {
            ...finalScore,
            awayScore: 'a' as any
          })
          .expectBadRequestResponse()
          .expectWrongPropertyType('awayScore', 'integer', 'body');
      });

      it('is less than 0', () => {
        cy.authenticate('admin1')
          .requestSetFinalScoreOfMatch(matchDocument.id, {
            ...finalScore,
            awayScore: -1
          })
          .expectBadRequestResponse()
          .expectTooSmallNumberProperty('awayScore', 0, 'body');
      });
    });

    describe('if current time', () => {
      it('is less than 105 minutes from startTime', () => {
        const ongoingMatch = matchConverter.create({
          homeTeamId: homeTeamDocument.id,
          awayTeamId: awayTeamDocument.id,
          tournamentId: tournamentDocument.id,
          group: 'A csoport',
          startTime: addMinutes(-104).toISOString()
        }, homeTeamDocument, awayTeamDocument, tournamentDocument);

        cy.saveMatchDocument(ongoingMatch)
          .authenticate('admin1')
          .requestSetFinalScoreOfMatch(ongoingMatch.id, finalScore)
          .expectBadRequestResponse()
          .expectMessage('Final score cannot be set during the game');
      });
    });
  });
});
