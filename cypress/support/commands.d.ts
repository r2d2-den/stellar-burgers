declare namespace Cypress {
  interface Chainable {
    addIngredient(ingredientId: string): Chainable<void>;
    openIngredientModal(ingredientId: string): Chainable<void>;
    closeModal(): Chainable<void>;
    closeModalByOverlay(): Chainable<void>;
    placeOrder(ingredientIds: string[]): Chainable<void>;
  }
}
