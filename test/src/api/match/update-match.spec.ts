import { v4 as uuid } from 'uuid';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { addMinutes } from '@foci2020/shared/common/utils';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';
import { matchDocumentConverter } from '@foci2020/shared/dependencies/converters/match-document-converter';
import { teamDocumentConverter } from '@foci2020/shared/dependencies/converters/team-document-converter';
import { tournamentDocumentConverter } from '@foci2020/shared/dependencies/converters/tournament-document-converter';
import { TeamIdType, TournamentIdType, MatchIdType } from '@foci2020/shared/types/common';

describe('PUT /match/v1/matches/{matchId}', () => {
  let homeTeamDocument: TeamDocument;
  let awayTeamDocument: TeamDocument;
  let tournamentDocument1: TournamentDocument;
  let tournamentDocument2: TournamentDocument;
  let matchDocument: MatchDocument;
  let finishedMatch: MatchDocument;
  let updatedMatch: MatchRequest;

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
    tournamentDocument1 = tournamentDocumentConverter.create({
      tournamentName: 'EB 2020'
    }, Cypress.env('EXPIRES_IN'));
    tournamentDocument2 = tournamentDocumentConverter.create({
      tournamentName: 'VB 2022'
    }, Cypress.env('EXPIRES_IN'));
    matchDocument = matchDocumentConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument1.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument1, Cypress.env('EXPIRES_IN'));

    finishedMatch = matchDocumentConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument1.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument1, Cypress.env('EXPIRES_IN'));

    updatedMatch = {
      homeTeamId: awayTeamDocument.id,
      awayTeamId: homeTeamDocument.id,
      tournamentId: tournamentDocument2.id,
      group: 'B csoport',
      startTime: addMinutes(15).toISOString()
    };
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestUpdateMatch(matchDocument.id, updatedMatch)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestUpdateMatch(matchDocument.id, updatedMatch)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should update a match', () => {
      cy.saveTeamDocument(homeTeamDocument)
        .saveTeamDocument(awayTeamDocument)
        .saveTournamentDocument(tournamentDocument1)
        .saveTournamentDocument(tournamentDocument2)
        .saveMatchDocument(matchDocument)
        .authenticate('admin1')
        .requestUpdateMatch(matchDocument.id, updatedMatch)
        .expectOkResponse()
        .validateMatchDocument(updatedMatch, awayTeamDocument, homeTeamDocument, tournamentDocument2, matchDocument.id);
    });

    describe('should return error', () => {
      describe('if homeTeamId', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              homeTeamId: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('homeTeamId', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              homeTeamId: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('homeTeamId', 'string', 'body');
        });

        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              homeTeamId: `${uuid()}-not-valid` as TeamIdType
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('homeTeamId', 'uuid', 'body');
        });

        it('does not belong to any team', () => {
          cy.saveTeamDocument(homeTeamDocument)
            .saveTeamDocument(awayTeamDocument)
            .saveTournamentDocument(tournamentDocument1)
            .saveTournamentDocument(tournamentDocument2)
            .saveMatchDocument(matchDocument)
            .authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              homeTeamId: uuid() as TeamIdType
            })
            .expectBadRequestResponse()
            .expectMessage('Home team not found');
        });
      });

      describe('if awayTeamId', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              awayTeamId: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('awayTeamId', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              awayTeamId: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('awayTeamId', 'string', 'body');
        });

        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              awayTeamId: `${uuid()}-not-valid` as TeamIdType
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('awayTeamId', 'uuid', 'body');
        });

        it('does not belong to any team', () => {
          cy.saveTeamDocument(homeTeamDocument)
            .saveTeamDocument(awayTeamDocument)
            .saveTournamentDocument(tournamentDocument1)
            .saveTournamentDocument(tournamentDocument2)
            .saveMatchDocument(matchDocument)
            .authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              awayTeamId: uuid() as TeamIdType
            })
            .expectBadRequestResponse()
            .expectMessage('Away team not found');
        });

        it('is the same as homeTeamId', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              awayTeamId: awayTeamDocument.id
            })
            .expectBadRequestResponse()
            .expectMessage('Home and away teams cannot be the same');
        });
      });

      describe('if tournamentId', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              tournamentId: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('tournamentId', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              tournamentId: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('tournamentId', 'string', 'body');
        });

        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              tournamentId: `${uuid()}-not-valid` as TournamentIdType
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'body');
        });

        it('does not belong to any tournament', () => {
          cy.saveTeamDocument(homeTeamDocument)
            .saveTeamDocument(awayTeamDocument)
            .saveTournamentDocument(tournamentDocument1)
            .saveTournamentDocument(tournamentDocument2)
            .saveMatchDocument(matchDocument)
            .authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              tournamentId: uuid() as TournamentIdType
            })
            .expectBadRequestResponse()
            .expectMessage('Tournament not found');
        });
      });

      describe('if group', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              group: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('group', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              group: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('group', 'string', 'body');
        });
      });

      describe('if startTime', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              startTime: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('startTime', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              startTime: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('startTime', 'string', 'body');
        });

        it('is not date-time', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              startTime: 'not-a-date'
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('startTime', 'date-time', 'body');
        });

        it('is less than 5 minutes from now', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              startTime: addMinutes(4.9).toISOString()
            })
            .expectBadRequestResponse()
            .expectMessage('Start time has to be at least 5 minutes from now');
        });
      });

      describe('if matchId', () => {
        it('is not uuid', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(`${uuid()}-not-valid` as MatchIdType, updatedMatch)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
        });

        it('does not belong to any match', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(uuid() as MatchIdType, updatedMatch)
            .expectNotFoundResponse();
        });
      });

      describe('if finalScore', () => {
        it('is already set for a match', () => {
          cy.saveMatchDocument({
            ...finishedMatch,
            finalScore: {
              homeScore: 1,
              awayScore: 2
            }
          })
            .authenticate('admin1')
            .requestUpdateMatch(finishedMatch.id, updatedMatch)
            .expectBadRequestResponse()
            .expectMessage('Final score is already set for this match');
        });
      });
    });
  });
});
