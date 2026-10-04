const article = '/blog/delivery-cost-nigeria';

function visit(path: string, width = 1280) {
  cy.viewport(width, 900);
  cy.intercept('GET', '**/package-types*', { body: { data: [] } });
  cy.visit(path, { onBeforeLoad(win) {
    win.localStorage.removeItem('gosendeet:newsletter:subscribed');
    win.localStorage.removeItem('gosendeet:newsletter:popup-seen');
  } });
  cy.get('.newsletter-signup').should('exist');
}

describe('newsletter signup behavior', () => {
  it('keeps the email after a failed request, retries, and remembers signup across pages', () => {
    visit('/');
    cy.intercept('POST', '/api/subscribe', { statusCode: 502, body: { error: 'Please try again.' } }).as('failure');
    cy.get('.landing-guides .newsletter-signup input[type="email"]').type('sender@example.com');
    cy.get('.newsletter-signup button[type="submit"]').click();
    cy.wait('@failure');
    cy.get('.newsletter-signup [role="alert"]').should('contain.text', 'Please try again.');
    cy.get('.newsletter-signup input[type="email"]').should('have.value', 'sender@example.com');
    cy.intercept('POST', '/api/subscribe', { statusCode: 502, headers: { 'Content-Type': 'text/html' }, body: '<html>Bad gateway</html>' }).as('badGateway');
    cy.get('.newsletter-signup button[type="submit"]').click();
    cy.wait('@badGateway');
    cy.get('.newsletter-signup [role="alert"]').should('contain.text', 'We couldn’t subscribe you right now');
    cy.get('.newsletter-signup input[type="email"]').should('have.value', 'sender@example.com');
    cy.intercept('POST', '/api/subscribe', { body: { success: true } }).as('success');
    cy.get('.newsletter-signup button[type="submit"]').click();
    cy.wait('@success').its('request.body').should('deep.equal', { email: 'sender@example.com', website: '' });
    cy.get('.newsletter-success').should('be.visible');
    cy.visit(article);
    cy.get('.newsletter-success').should('be.visible');
    cy.scrollTo('bottom');
    cy.get('.newsletter-popup').should('not.exist');
  });

  it('opens once and stays dismissed across articles and reloads', () => {
    visit(article, 390);
    cy.get('.newsletter-popup', { timeout: 8000 }).should('be.visible').and('have.attr', 'role', 'dialog');
    cy.get('[data-slot="dialog-overlay"]').should('exist');
    cy.get('.newsletter-popup').contains('button', 'Close').click();
    cy.get('.newsletter-popup').should('not.exist');
    cy.visit('/blog/lagos-to-ibadan-delivery');
    cy.get('.newsletter-signup').should('exist');
    cy.get('.newsletter-popup').should('not.exist');
    cy.contains('Subscribe to delivery tips').should('not.exist');
    cy.reload();
    cy.get('.newsletter-signup').should('exist');
    cy.get('.newsletter-popup').should('not.exist');
  });

  it('subscribes from the popup and updates the inline form too', () => {
    visit(article);
    cy.get('.newsletter-popup', { timeout: 8000 }).should('be.visible').and('have.attr', 'role', 'dialog');
    cy.get('[data-slot="dialog-overlay"]').should('exist');
    cy.intercept('POST', '/api/subscribe', { body: { success: true } }).as('subscribe');
    cy.get('.newsletter-popup input[type="email"]').type('reader@example.com');
    cy.get('.newsletter-popup button[type="submit"]').click();
    cy.wait('@subscribe');
    cy.get('.newsletter-popup').should('not.exist');
    cy.get('.newsletter-success').should('contain.text', 'You’re subscribed');
  });
  it('opens once on the listing and does not repeat on articles', () => {
    visit('/blog');
    cy.get('h1').should('contain.text', 'Delivery advice for Nigeria');
    cy.get('.newsletter-popup', { timeout: 8000 }).should('be.visible').and('have.attr', 'role', 'dialog');
    cy.get('[data-slot="dialog-overlay"]').should('exist');
    cy.get('.newsletter-popup').contains('button', 'Close').click();
    cy.get('.newsletter-popup').should('not.exist');
    cy.visit('/blog/delivery-cost-nigeria');
    cy.get('h1').should('contain.text', 'How much does delivery cost');
    cy.get('.newsletter-popup').should('not.exist');
    cy.get('.newsletter-signup input[type="email"]').should('exist');
  });
  it('confirms subscription when browser storage cannot be written', () => {
    visit('/');
    cy.window().then(win => {
      const setItem = win.Storage.prototype.setItem;
      cy.stub(win.Storage.prototype, 'setItem').callsFake(function(this: Storage, key: string, value: string) {
        if (key.startsWith('gosendeet:newsletter:')) throw new win.DOMException('Storage full', 'QuotaExceededError');
        setItem.call(this, key, value);
      });
    });
    cy.intercept('POST', '/api/subscribe', { body: { success: true } }).as('subscribeWithoutStorage');
    cy.get('.newsletter-signup input[type="email"]').type('reader@example.com');
    cy.get('.newsletter-signup button[type="submit"]').click();
    cy.wait('@subscribeWithoutStorage');
    cy.get('.newsletter-success').should('be.visible');
  });

});
