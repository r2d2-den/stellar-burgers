describe('Тест конструктора бургера', function () {
  // ID ингредиентов
  const ingredients = [
    'cy-643d69a5c3f7b9001cfa093e',
    'cy-643d69a5c3f7b9001cfa0946',
    'cy-643d69a5c3f7b9001cfa0942',
    'cy-643d69a5c3f7b9001cfa093c'
  ];

  beforeEach(() => {
    // Перехватываем запросы
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as(
      'postOrder'
    );

    // Устанавливаем токены для авторизации
    window.localStorage.setItem(
      'refreshToken',
      JSON.stringify('tesrtaccessToken')
    );
    cy.setCookie('accessToken', 'test-accessToken');

    // Переход на главную
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
  });

  // Очищаем хранилище и куки
  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  // Функция для добавления ингредиента
  const addIngredient = (ingredientId: string) => {
    cy.get(`[data-cy=${ingredientId}] button`).contains('Добавить').click();
  };

  // Проверка что BurgerConstructor отображается на странице
  it('должен отображать компонент BurgerConstructor', () => {
    cy.get('h1').contains('Соберите бургер');
  });

  it('должен добавить ингредиент в конструктор', () => {
    addIngredient('cy-643d69a5c3f7b9001cfa093e');
    cy.get('[data-cy="cy-ingredients-list"]')
      .children()
      .should('have.length', 1);
  });

  it('должен открыть модальное окно ингредиента', () => {
    cy.get('[data-cy="cy-643d69a5c3f7b9001cfa093e"] a').click();
    cy.get('[data-cy="cy-modal"]').should('be.visible');
    cy.get('[data-cy="cy-ingredient-details-header"]').contains(
      'Филе Люминесцентного тетраодонтимформа'
    );
  });

  it('должен закрыть модальное окно по клику на крестик', () => {
    cy.get('[data-cy="cy-643d69a5c3f7b9001cfa093e"] a').click();
    cy.get('[data-cy="cy-close-modal"]').click();
    cy.get('[data-cy="cy-modal"]').should('not.exist');
  });

  it('должен закрыть модальное окно по клику на оверлей', () => {
    cy.get('[data-cy="cy-643d69a5c3f7b9001cfa093e"] a').click();
    cy.get('[data-cy="cy-modal-overlay"]').click('topRight', { force: true });
    cy.get('[data-cy="cy-modal"]').should('not.exist');
  });

  it('Оформление заказа и проверка конструктора', () => {
    ingredients.forEach(addIngredient);

    cy.get('[data-cy=cy-order-info] button')
      .contains('Оформить заказ')
      .scrollIntoView()
      .click();
    cy.wait('@postOrder');

    cy.get('[data-cy="cy-modal"]').should('be.visible');
    cy.get('[data-cy=cy-order-number]').contains('38217');
    cy.get('[data-cy="cy-close-modal"]').click();
    cy.get('[data-cy="cy-modal"]').should('not.exist');
  });

  it('Должен отображать пустой конструктор', () => {
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
