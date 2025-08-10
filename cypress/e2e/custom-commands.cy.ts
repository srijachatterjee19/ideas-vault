describe('Custom Commands', () => {
  it('should use custom login command', () => {
    cy.login()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should use custom createIdea command', () => {
    cy.login()
    cy.createIdea('Custom Command Idea', 'Created with custom command', 'custom, command')
    
    // Verify the idea was created
    cy.contains('Custom Command Idea').should('be.visible')
    cy.contains('Created with custom command').should('be.visible')
    cy.contains('custom').should('be.visible')
    cy.contains('command').should('be.visible')
  })

  it('should handle login with custom password', () => {
    cy.login('dev-secret')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
