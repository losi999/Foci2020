import { v4 as uuid } from 'uuid';
import { TeamRequest } from '@foci2020/shared/types/requests';
import { deleteTeam, getTeam_, createTeam_, validateTeam_, getTeam } from '@foci2020/test/api/team/team-common';
import { TeamResponse } from '@foci2020/shared/types/responses';
import { expectUnauthorized, expectForbidden, expectBadRequest, expectWrongPropertyFormat, expectNotFound } from '@foci2020/test/api/common-expects';
import { authenticate } from '@foci2020/test/api/auth/auth-common';

describe('GET /team/v1/teams/{teamId}', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  let createdTeamIds: string[];

  before(() => {
    createdTeamIds = [];
  });

  after(() => {
    createdTeamIds.map(teamId => deleteTeam(teamId, 'admin1'));
  });

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      getTeam(uuid())(undefined)
        .its('status')
        .should(expectUnauthorized);
    });
  });

  describe('called as a player', () => {
    it('should return unauthorized', () => {
      authenticate('player1')
        .then(getTeam(uuid()))
        .its('status')
        .should(expectForbidden);
    });
  });

  describe('called as an admin', () => {
    it.skip('should get team by id', () => {
      let teamId: string;

      createTeam_(team, 'admin1')
        .its('body')
        .its('teamId')
        .then((id) => {
          createdTeamIds.push(id);
          teamId = id;
          expect(id).to.be.a('string');
          return getTeam_(teamId, 'admin1');
        })
        .its('body')
        .should((body: TeamResponse) => {
          validateTeam_(body, teamId, team);
        });
    });

    describe('should return error if teamId', () => {
      it('is not uuid', () => {
        authenticate('admin1')
          .then(getTeam(`${uuid()}-not-valid`))
          .as('response');
        cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
        cy.getAs<Cypress.Response>('@response').its('body').should(expectWrongPropertyFormat('teamId', 'uuid', 'pathParameters'));
      });

      it('does not belong to any team', () => {
        authenticate('admin1')
          .then(getTeam(uuid()))
          .its('status')
          .should(expectNotFound);
      });
    });
  });
});
