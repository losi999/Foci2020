export const getAs = (...aliases: string[]): any => {
  if (aliases.length === 1) {
    const alias = aliases[0];
    return cy.get(alias.startsWith('@') ? alias : `@${alias}`);
  }
  const promise = cy.wrap([], { log: false });

  for (const alias of aliases) {
    promise.then((arr) => {
      return cy.get(alias.startsWith('@') ? alias : `@${alias}`).then((got) => {
        return cy.wrap([...arr, got], { log: false });
      });
    });
  }

  return promise;
};
