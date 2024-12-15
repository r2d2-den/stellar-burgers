import '../support/commands';

describe('Тест конструктора бургера', function () {
  const INGREDIENT_IDS = [
    'cy-643d69a5c3f7b9001cfa093e',
    'cy-643d69a5c3f7b9001cfa0946',
    'cy-643d69a5c3f7b9001cfa0942',
    'cy-643d69a5c3f7b9001cfa093c'
  ];

  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('tesrtaccessToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('должен отображать компонент BurgerConstructor', () => {
    cy.get('h1').contains('Соберите бургер');
  });

  it('должен добавить ингредиент в конструктор', () => {
    cy.addIngredient(INGREDIENT_IDS[0]);
    cy.get('[data-cy="cy-ingredients-list"]')
      .children()
      .should('have.length', 1);
  });

  it('должен открыть и закрыть модальное окно ингредиента', () => {
    cy.openIngredientModal(INGREDIENT_IDS[0]);
    cy.get('[data-cy="cy-ingredient-details-header"]').contains(
      'Филе Люминесцентного тетраодонтимформа'
    );
    cy.closeModal();
  });

  it('должен закрыть модальное окно по клику на оверлей', () => {
    cy.openIngredientModal(INGREDIENT_IDS[0]);
    cy.closeModalByOverlay();
  });

  it('оформление заказа', () => {
    cy.placeOrder(INGREDIENT_IDS);
    cy.get('[data-cy="cy-order-number"]').contains('38217');
    cy.closeModal();
  });

  it('должен отображать пустой конструктор', () => {
    cy.get('[data-cy="burger-constructor"]').should('exist').and('be.visible');
    cy.get('[data-cy="cy-bun-top"]').children().should('have.length', 0);
    cy.get('[data-cy="cy-bun-bottom"]').children().should('have.length', 0);
    cy.get('[data-cy="cy-ingredients-list"]').should('not.have.descendants');

    cy.get('[data-cy="cy-price"]').should('contain', '0');
    cy.get('[data-cy="cy-order-button"]')
      .should('be.visible')
      .and('contain', 'Оформить заказ');
  });
});
