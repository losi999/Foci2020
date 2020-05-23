declare global {
  namespace Cypress {
    interface Chainable {
      getAll: (...aliases: string[]) => Chainable<any[]>;
    }
  }
}

export const getAll = (...aliases: string[]): any => {
  const promise = cy.wrap([], { log: false });

  for (const alias of aliases) {
    promise.then(arr => cy.get(alias).then(got => cy.wrap([...arr, got], { log: false })));
  }

  return promise;
};

Cypress.Commands.add('getAll', getAll);
