/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<JQuery<HTMLElement>>;
      
      /**
       * Custom command to add a block to the canvas
       * @example cy.addBlock('text')
       */
      addBlock(blockType: string): Chainable<void>;
      
      /**
       * Custom command to select a block on the canvas
       * @example cy.selectBlock('text-1')
       */
      selectBlock(blockId: string): Chainable<void>;
      
      /**
       * Custom command to wait for the page to be ready
       * @example cy.waitForPageLoad()
       */
      waitForPageLoad(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('dataCy', (value) => {
  return cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add('addBlock', (blockType) => {
  cy.get(`[data-testid="block-${blockType}"]`).click();
  cy.wait(100); // Wait for block to be added
});

Cypress.Commands.add('selectBlock', (blockId) => {
  cy.get(`[data-block-id="${blockId}"]`).click();
});

Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('[data-testid="app-container"]').should('be.visible');
  cy.get('[data-testid="sidebar"]').should('be.visible');
  cy.get('[data-testid="canvas"]').should('be.visible');
});
