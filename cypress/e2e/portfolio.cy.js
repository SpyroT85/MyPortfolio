describe('My PortfoliOS+ - Demo Flow', () => {

  it('should boot, open About Me, download CV, minimize, open Projects, move and resize window', () => {

    // Visit portfolio and force fresh start
    cy.visit('http://localhost:5176');
    cy.clearLocalStorage();
    cy.reload();
    cy.wait(2000);

    // Press power button
    cy.get('[data-cy="power-button"]', { timeout: 10000 }).click();
    cy.wait(12000); // Wait for BIOS + loading screen

    // Click About Me icon
    cy.get('[data-cy="icon-about-me"]', { timeout: 15000 }).click({ force: true });
    cy.wait(2000);

    // Click Download CV
    cy.get('[data-cy="download-cv"]').click({ force: true });
    cy.wait(1500);

    // Minimize About Me window
    cy.get('[data-cy="minimize-about"]').click({ force: true });
    cy.wait(1500);

    // Click Projects icon
    cy.get('[data-cy="icon-projects"]').click({ force: true });
    cy.wait(2000);

    // Resize Projects window - height and width only
    cy.get('[data-cy="minimize-projects"]').closest('.window').then($win => {
      const rect = $win[0].getBoundingClientRect();
      cy.wrap($win).find('.window-resize-handle')
        .trigger('mousedown', { clientX: rect.right, clientY: rect.bottom });
      cy.document().trigger('mousemove', { clientX: rect.right - 200, clientY: rect.bottom - 150, force: true });
      cy.wait(600);
      cy.document().trigger('mousemove', { clientX: rect.right - 250, clientY: rect.bottom - 200, force: true });
      cy.wait(400);
      cy.document().trigger('mouseup', { force: true });
    });
    cy.wait(1200);

    // Minimize Projects window
    cy.get('[data-cy="minimize-projects"]').click({ force: true });
    cy.wait(1500);

    // Click Looking For icon
    cy.get('[data-cy="icon-looking-for"]').click({ force: true });
    cy.wait(2000);

    // Move Looking For window slightly to the right
    cy.get('[data-cy="minimize-lookingfor"]').closest('.window').then($win => {
      const rect = $win[0].getBoundingClientRect();
      cy.wrap($win).find('.window-titlebar')
        .trigger('mousedown', { clientX: rect.left + 150, clientY: rect.top + 15 });
      cy.wait(200);
      cy.document().trigger('mousemove', { clientX: rect.left + 220, clientY: rect.top + 15, force: true });
      cy.wait(200);
      cy.document().trigger('mousemove', { clientX: rect.left + 290, clientY: rect.top + 15, force: true });
      cy.wait(200);
      cy.document().trigger('mousemove', { clientX: rect.left + 350, clientY: rect.top + 15, force: true });
      cy.wait(200);
      cy.document().trigger('mouseup', { force: true });
    });
    cy.wait(1500);

    // Minimize Looking For window
    cy.get('[data-cy="minimize-lookingfor"]').click({ force: true });
    cy.wait(3000); // Sit on taskbar for 3 seconds

    // Close Looking For from taskbar - reopen then close
    cy.get('[data-cy="minimize-lookingfor"]').click({ force: true });
    cy.wait(1000);
    cy.get('[data-cy="close-lookingfor"]').click({ force: true });
    cy.wait(800);

    // Open start menu
    cy.get('[data-cy="start-menu-btn"]').click({ force: true });
    cy.wait(1000);

    // Click Shut Down (wait for visible, longer timeout)
    cy.get('[data-cy="shutdown-btn"]', { timeout: 7000 }).should('be.visible').click({ force: true });
    cy.wait(1000);

  });

});