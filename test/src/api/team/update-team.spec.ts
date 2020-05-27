import { TeamRequest, TournamentRequest } from '@foci2020/shared/types/requests';
import { deleteMatch, createMatch, getMatch } from '@foci2020/test/api/match/match-common';
import { deleteTeam, createTeam_, updateTeam, getTeam_, validateTeam_ } from '@foci2020/test/api/team/team-common';
import { deleteTournament, createTournament } from '@foci2020/test/api/tournament/tournament-common';
import { TeamResponse, MatchResponse } from '@foci2020/shared/types/responses';
import { addMinutes } from '@foci2020/shared/common/utils';

describe('PUT /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  const teamToUpdate: TeamRequest = {
    teamName: 'to update',
    image: 'http://toupdate.com',
    shortName: 'TUP'
  };

  let createdMatchIds: string[];
  let createdTeamIds: string[];
  let createdTournamentIds: string[];

  before(() => {
    createdMatchIds = [];
    createdTeamIds = [];
    createdTournamentIds = [];
  });

  after(() => {
    createdMatchIds.map(matchId => deleteMatch(matchId, 'admin1'));
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin1'));
    createdTournamentIds.map(tournamentId => deleteTournament(tournamentId, 'admin1'));
  });

  let teamId: string;

  before(() => {
    createTeam_(teamToUpdate, 'admin1')
      .its('body')
      .its('teamId')
      .then((id) => {
        teamId = id;
        createdTeamIds.push(id);
        expect(id).to.be.a('string');
      });
  });

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      updateTeam(teamId, team, 'player1')
        .its('status')
        .should((status) => {
          expect(status).to.equal(403);
        });
    });
  });

  describe('called as an admin', () => {
    it('should update a team', () => {
      updateTeam(teamId, team, 'admin1')
        .its('status')
        .then((status) => {
          expect(status).to.equal(200);
          return getTeam_(teamId, 'admin1');
        })
        .its('body')
        .should((body: TeamResponse) => {
          validateTeam_(body, teamId, team);
        });
    });

    describe('related matches', () => {
      let fixTeamId: string;
      let tournamentId: string;

      const fixTeam: TeamRequest = {
        teamName: 'Anglia',
        image: 'http://image.com/eng.png',
        shortName: 'ENG'
      };

      const tournament: TournamentRequest = {
        tournamentName: 'EB 2020'
      };

      const updatedTeam: TeamRequest = {
        teamName: 'updated',
        shortName: 'UPD',
        image: 'http://updated.com/upd.png'
      };

      beforeEach(() => {
        createTeam_(fixTeam, 'admin1')
          .its('body')
          .its('teamId')
          .then((id) => {
            fixTeamId = id;
            createdTeamIds.push(id);
            expect(id).to.be.a('string');
            return createTournament(tournament, 'admin1');
          })
          .its('body')
          .its('tournamentId')
          .then((id) => {
            tournamentId = id;
            createdTournamentIds.push(id);
            expect(id).to.be.a('string');
          });
      });

      it('should be updated if home team is updated', () => {
        let matchId: string;

        createMatch({
          tournamentId,
          homeTeamId: teamId,
          awayTeamId: fixTeamId,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString()
        }, 'admin1').its('body')
          .its('matchId')
          .then((id) => {
            matchId = id;
            createdMatchIds.push(id);
            expect(id).to.be.a('string');
            return getMatch(matchId, 'admin1');
          })
          .its('body')
          .then(() => {
            return updateTeam(teamId, updatedTeam, 'admin1');
          })
          .its('status')
          .wait(1000)
          .then((status) => {
            expect(status).to.equal(200);
            return getMatch(matchId, 'admin1');
          })
          .its('body')
          .should((body: MatchResponse) => {
            validateTeam_(body.homeTeam, teamId, updatedTeam);
          });
      });

      it('should be updated if away team is updated', () => {
        let matchId: string;

        createMatch({
          tournamentId,
          awayTeamId: teamId,
          homeTeamId: fixTeamId,
          group: 'A csoport',
          startTime: addMinutes(10).toISOString()
        }, 'admin1').its('body')
          .its('matchId')
          .then((id) => {
            matchId = id;
            createdMatchIds.push(id);
            expect(id).to.be.a('string');
            return getMatch(matchId, 'admin1');
          })
          .its('body')
          .then(() => {
            return updateTeam(teamId, updatedTeam, 'admin1');
          })
          .its('status')
          .wait(1000)
          .then((status) => {
            expect(status).to.equal(200);
            return getMatch(matchId, 'admin1');
          })
          .its('body')
          .should((body: MatchResponse) => {
            validateTeam_(body.awayTeam, teamId, updatedTeam);
          });
      });
    });

    describe('should return error', () => {
      describe('if teamName', () => {
        it('is missing from body', () => {
          updateTeam(teamId, {
            ...team,
            teamName: undefined
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('teamName').to.contain('required');
            });
        });

        it('is not string', () => {
          updateTeam(teamId, {
            ...team,
            teamName: 1 as any
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('teamName').to.contain('string');
            });
        });
      });

      describe('if image', () => {
        it('is missing from body', () => {
          updateTeam(teamId, {
            ...team,
            image: undefined
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('image').to.contain('required');
            });
        });

        it('is not string', () => {
          updateTeam(teamId, {
            ...team,
            image: 1 as any
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('image').to.contain('string');
            });
        });

        it('is not an URI', () => {
          updateTeam(teamId, {
            ...team,
            image: 'not.an.uri'
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('image').to.contain('format').to.contain('uri');
            });
        });
      });

      describe('if shortName', () => {
        it('is missing from body', () => {
          updateTeam(teamId, {
            ...team,
            shortName: undefined
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('shortName').to.contain('required');
            });
        });

        it('is not string', () => {
          updateTeam(teamId, {
            ...team,
            shortName: 1 as any
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('shortName').to.contain('string');
            });
        });

        it('is shorter than 3 characters', () => {
          updateTeam(teamId, {
            ...team,
            shortName: 'AB'
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('shortName').to.contain('shorter').to.contain('3');
            });
        });

        it('is longer than 3 characters', () => {
          updateTeam(teamId, {
            ...team,
            shortName: 'ABCD'
          }, 'admin1')
            .should((response) => {
              expect(response.status).to.equal(400);
              expect(response.body.body).to.contain('shortName').to.contain('longer').to.contain('3');
            });
        });
      });

      describe('if teamId', () => {
        it.skip('is not uuid', () => {

        });

        it.skip('does not belong to any team', () => {

        });
      });
    });
  });
});
