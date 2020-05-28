import { v4 as uuid } from 'uuid';
import { MatchRequest } from '@foci2020/shared/types/requests';
import { addMinutes } from '@foci2020/shared/common/utils';
import { matchDocumentConverterFactory, IMatchDocumentConverter } from '@foci2020/shared/converters/match-document-converter';
import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';

describe('PUT /match/v1/matches/{matchId}', () => {
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
  let tournamentDocument1: TournamentDocument;
  let tournamentDocument2: TournamentDocument;
  let matchDocument: MatchDocument;
  let updatedMatch: MatchRequest;

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
    tournamentDocument1 = tournamentConverter.create({
      tournamentName: 'EB 2020'
    });
    tournamentDocument2 = tournamentConverter.create({
      tournamentName: 'VB 2022'
    });
    matchDocument = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument1.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument1);

    cy.saveTeamDocument(homeTeamDocument)
      .saveTeamDocument(awayTeamDocument)
      .saveTournamentDocument(tournamentDocument1)
      .saveTournamentDocument(tournamentDocument2)
      .saveMatchDocument(matchDocument);

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
      cy.authenticate('admin1')
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
              homeTeamId: `${uuid()}-not-valid`
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('homeTeamId', 'uuid', 'body');
        });

        it('does not belong to any team', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              homeTeamId: uuid()
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
              awayTeamId: `${uuid()}-not-valid`
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('awayTeamId', 'uuid', 'body');
        });

        it('does not belong to any team', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              awayTeamId: uuid()
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
              tournamentId: `${uuid()}-not-valid`
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('tournamentId', 'uuid', 'body');
        });

        it('does not belong to any tournament', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(matchDocument.id, {
              ...updatedMatch,
              tournamentId: uuid()
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
            .requestUpdateMatch(`${uuid()}-not-valid`, updatedMatch)
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('matchId', 'uuid', 'pathParameters');
        });

        it('does not belong to any match', () => {
          cy.authenticate('admin1')
            .requestUpdateMatch(uuid(), updatedMatch)
            .expectNotFoundResponse();
        });
      });

      describe('if finalScore', () => {
        it('is already set for a match', () => {
          const finishedMatch = matchConverter.create({
            homeTeamId: homeTeamDocument.id,
            awayTeamId: awayTeamDocument.id,
            tournamentId: tournamentDocument1.id,
            group: 'A csoport',
            startTime: addMinutes(10).toISOString()
          }, homeTeamDocument, awayTeamDocument, tournamentDocument1);

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
