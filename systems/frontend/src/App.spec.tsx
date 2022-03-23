import { mount } from '@cypress/react';

import App from './App';

describe('AdminApp', () => {
  it('should render correctly', () => {
    mount(<App />);
    cy.get(`[data-testid='add-new-game']`).click();
    cy.get(`[data-testid='game-id']`)
      .should('be.visible')
      .then(el => {
        const gameId = el.text();
        cy.request({
          method: 'GET',
          url: `http://localhost:5333/test/seeder/game/${gameId}`,
        })
          .its('body.data.id')
          .should('equal', gameId);
      });
  });
});
