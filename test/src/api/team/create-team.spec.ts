import { TeamRequest } from '@foci2020/shared/types/requests';
import { createTeam, validateTeam } from '@foci2020/test/api/team/team-common';
import { expectUnauthorized, expectForbidden, expectBadRequest, expectRequiredProperty, expectWrongPropertyType, expectWrongPropertyFormat, expectTooShortProperty, expectTooLongProperty } from '@foci2020/test/api/common-expects';
import { authenticate } from '@foci2020/test/api/auth/auth-common';

describe('POST /team/v1/teams', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      createTeam(team)(undefined)
        .its('status')
        .should(expectUnauthorized);
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      authenticate('player1')
        .then(createTeam(team))
        .its('status')
        .should(expectForbidden);
    });
  });

  describe('called as an admin', () => {
    it.only('should create a team', () => {
      cy.authenticate('admin1')
        .requestCreateTeam(team)
        .expectOkResponse()
        .expectTeamIdResponse()
        .getTeamDocument()
        .validateTeam(team);
    });

    it('should create a team without image', () => {
      const request: TeamRequest = {
        ...team,
        image: undefined
      };
      authenticate('admin1')
        .then(createTeam(request))
        .its('body')
        .its('teamId')
        .getTeam()
        .should(validateTeam(request));
    });

    describe('should return error', () => {
      describe('if teamName', () => {
        it('is missing from body', () => {
          authenticate('admin1')
            .then(createTeam({
              ...team,
              teamName: undefined
            })).as('response');
          cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
          cy.getAs<Cypress.Response>('@response').its('body').should(expectRequiredProperty('teamName', 'body'));
        });

        it('is not string', () => {
          authenticate('admin1')
            .then(createTeam({
              ...team,
              teamName: 1 as any
            })).as('response');
          cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
          cy.getAs<Cypress.Response>('@response').its('body').should(expectWrongPropertyType('teamName', 'string', 'body'));
        });
      });

      describe('if image', () => {
        it('is not string', () => {
          authenticate('admin1')
            .then(createTeam({
              ...team,
              image: 1 as any
            })).as('response');
          cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
          cy.getAs<Cypress.Response>('@response').its('body').should(expectWrongPropertyType('image', 'string', 'body'));
        });

        it('is not an URI', () => {
          authenticate('admin1')
            .then(createTeam({
              ...team,
              image: 'not.an.uri'
            })).as('response');
          cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
          cy.getAs<Cypress.Response>('@response').its('body').should(expectWrongPropertyFormat('image', 'uri', 'body'));
        });
      });

      describe('if shortName', () => {
        it('is missing from body', () => {
          authenticate('admin1')
            .then(createTeam({
              ...team,
              shortName: undefined
            })).as('response');
          cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
          cy.getAs<Cypress.Response>('@response').its('body').should(expectRequiredProperty('shortName', 'body'));
        });

        it('is not string', () => {
          authenticate('admin1')
            .then(createTeam({
              ...team,
              shortName: 1 as any
            })).as('response');
          cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
          cy.getAs<Cypress.Response>('@response').its('body').should(expectWrongPropertyType('shortName', 'string', 'body'));
        });

        it('is shorter than 3 characters', () => {
          authenticate('admin1')
            .then(createTeam({
              ...team,
              shortName: 'AB'
            })).as('response');
          cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
          cy.getAs<Cypress.Response>('@response').its('body').should(expectTooShortProperty('shortName', 3, 'body'));
        });

        it('is longer than 3 characters', () => {
          authenticate('admin1')
            .then(createTeam({
              ...team,
              shortName: 'ABCD'
            })).as('response');
          cy.getAs<Cypress.Response>('@response').its('status').should(expectBadRequest);
          cy.getAs<Cypress.Response>('@response').its('body').should(expectTooLongProperty('shortName', 3, 'body'));
        });
      });
    });
  });
});
