import { addMinutes } from '@foci2020/shared/common/utils';
import { v4 as uuid } from 'uuid';
import { ITeamDocumentConverter, teamDocumentConverterFactory } from '@foci2020/shared/converters/team-document-converter';
import { ITournamentDocumentConverter, tournamentDocumentConverterFactory } from '@foci2020/shared/converters/tournament-document-converter';
import { IMatchDocumentConverter, matchDocumentConverterFactory } from '@foci2020/shared/converters/match-document-converter';
import { TeamDocument, TournamentDocument, MatchDocument } from '@foci2020/shared/types/documents';

describe('GET /match/v1/matches', () => {
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
  let matchDocument1: MatchDocument;
  let matchDocument2: MatchDocument;

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
    matchDocument1 = matchConverter.create({
      homeTeamId: homeTeamDocument.id,
      awayTeamId: awayTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'A csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument);

    matchDocument2 = matchConverter.create({
      homeTeamId: awayTeamDocument.id,
      awayTeamId: homeTeamDocument.id,
      tournamentId: tournamentDocument.id,
      group: 'B csoport',
      startTime: addMinutes(10).toISOString()
    }, homeTeamDocument, awayTeamDocument, tournamentDocument);
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestGetMatchList()
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestGetMatchList()
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should get a list of matches', () => {
      cy.saveMatchDocument(matchDocument1)
        .saveMatchDocument(matchDocument2)
        .authenticate('admin1')
        .requestGetMatchList()
        .expectOkResponse()
        .expectMatchResponse();
    });
  });
});
