import { TeamRequest } from '@foci2020/shared/types/requests';

describe('POST /team/v1/teams', () => {
  const team: TeamRequest = {
    teamName: 'Magyarország',
    image: 'http://image.com/hun.png',
    shortName: 'HUN'
  };

  describe('called as anonymous', () => {
    it('should return unauthorized', () => {
      cy.unauthenticate()
        .requestCreateTeam(team)
        .expectUnauthorizedResponse();
    });
  });

  describe('called as a player', () => {
    it('should return forbidden', () => {
      cy.authenticate('player1')
        .requestCreateTeam(team)
        .expectForbiddenResponse();
    });
  });

  describe('called as an admin', () => {
    it('should create a team', () => {
      cy.authenticate('admin1')
        .requestCreateTeam(team)
        .expectOkResponse()
        .validateTeamDocument(team);
    });

    it('should create a team without image', () => {
      const request: TeamRequest = {
        ...team,
        image: undefined
      };
      cy.authenticate('admin1')
        .requestCreateTeam(request)
        .expectOkResponse()
        .validateTeamDocument(request);
    });

    describe('should return error', () => {
      describe('if teamName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestCreateTeam({
              ...team,
              teamName: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('teamName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateTeam({
              ...team,
              teamName: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('teamName', 'string', 'body');
        });
      });

      describe('if image', () => {
        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateTeam({
              ...team,
              image: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('image', 'string', 'body');
        });

        it('is not an URI', () => {
          cy.authenticate('admin1')
            .requestCreateTeam({
              ...team,
              image: 'not.an.uri'
            })
            .expectBadRequestResponse()
            .expectWrongPropertyFormat('image', 'uri', 'body');
        });
      });

      describe('if shortName', () => {
        it('is missing from body', () => {
          cy.authenticate('admin1')
            .requestCreateTeam({
              ...team,
              shortName: undefined
            })
            .expectBadRequestResponse()
            .expectRequiredProperty('shortName', 'body');
        });

        it('is not string', () => {
          cy.authenticate('admin1')
            .requestCreateTeam({
              ...team,
              shortName: 1 as any
            })
            .expectBadRequestResponse()
            .expectWrongPropertyType('shortName', 'string', 'body');
        });

        it('is shorter than 3 characters', () => {
          cy.authenticate('admin1')
            .requestCreateTeam({
              ...team,
              shortName: 'AB'
            })
            .expectBadRequestResponse()
            .expectTooShortProperty('shortName', 3, 'body');
        });

        it('is longer than 3 characters', () => {
          cy.authenticate('admin1')
            .requestCreateTeam({
              ...team,
              shortName: 'ABCD'
            })
            .expectBadRequestResponse()
            .expectTooLongProperty('shortName', 3, 'body');
        });
      });
    });
  });
});
