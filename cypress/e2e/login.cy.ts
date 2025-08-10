describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form', () => {
    cy.get('input[type="password"]').should('be.visible')
    cy.get('button').contains('Login').should('be.visible')
  })

  it('should show error for invalid password', () => {
    cy.get('input[type="password"]').type('wrong-password')
    cy.get('button').contains('Login').click()
    
    // Should show error message
    cy.contains('Invalid password').should('be.visible')
  })

  it('should redirect to main page after successful login', () => {
    cy.get('input[type="password"]').type('dev-secret')
    cy.get('button').contains('Login').click()
    
    // Should redirect to main page
    cy.url().should('not.include', '/login')
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })
})
