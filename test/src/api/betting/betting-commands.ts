export const requestGetMatchListOfTournament = (idToken: string, tournamentId: string) => {
  return cy.request({
    method: 'GET',
    url: `/betting/v1/tournaments/${tournamentId}/matches`,
    headers: {
      Authorization: idToken
    },
    failOnStatusCode: false
  }) as Cypress.ChainableResponse;
};
