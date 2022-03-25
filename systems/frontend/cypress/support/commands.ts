Cypress.Commands.add('getBySel', selector => {
  return cy.get(`[data-testid=${selector}]`);
});

Cypress.Commands.add('getBySelLike', selector => {
  return cy.get(`[data-testid*=${selector}]`);
});

export {};
