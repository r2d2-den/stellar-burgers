/// <reference types="cypress" />

// Добавить ингредиент
Cypress.Commands.add('addIngredient', (ingredientId) => {
  cy.get(`[data-cy=${ingredientId}]`)
    .find('button')
    .contains('Добавить')
    .click();
});

// Открыть модальное окно
Cypress.Commands.add('openIngredientModal', (ingredientId) => {
  cy.get(`[data-cy=${ingredientId}] a`).click();
  cy.get('[data-cy="cy-modal"]').should('be.visible');
});

// Закрыть модальное окно
Cypress.Commands.add('closeModal', () => {
  cy.get('[data-cy="cy-close-modal"]').click();
  cy.get('[data-cy="cy-modal"]').should('not.exist');
});

// Закрыть модальное окно по клику на оверлей
Cypress.Commands.add('closeModalByOverlay', () => {
  cy.get('[data-cy="cy-modal-overlay"]').click('topRight', { force: true });
  cy.get('[data-cy="cy-modal"]').should('not.exist');
});

// Оформить заказ
Cypress.Commands.add('placeOrder', (ingredientIds) => {
  ingredientIds.forEach((id) => cy.addIngredient(id));
  cy.get('[data-cy="cy-order-info"] button')
    .contains('Оформить заказ')
    .scrollIntoView()
    .click();
  cy.wait('@postOrder');
  cy.get('[data-cy="cy-modal"]').should('be.visible');
});
