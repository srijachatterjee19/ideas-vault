describe('Idea Operations', () => {
  beforeEach(() => {
    // Login first
    cy.visit('/login')
    cy.get('input[type="password"]').type('dev-secret')
    cy.get('button').contains('Login').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should edit an existing idea', () => {
    // Create an idea first
    cy.createIdea('Original Title', 'Original content', 'original')
    
    // Find and click edit button
    cy.contains('Original Title').parent().find('button').contains('Edit').click()
    
    // Update the title
    cy.get('input[placeholder="Title"]').clear().type('Updated Title')
    cy.get('button').contains('Save').click()
    
    // Verify the change
    cy.contains('Updated Title').should('be.visible')
    cy.contains('Original Title').should('not.exist')
  })

  it('should delete an idea', () => {
    // Create an idea first
    cy.createIdea('To Delete', 'This will be deleted', 'delete')
    
    // Find and click delete button
    cy.contains('To Delete').parent().find('button').contains('Delete').click()
    
    // Verify the idea is gone
    cy.contains('To Delete').should('not.exist')
  })

  it('should cancel editing', () => {
    // Create an idea first
    cy.createIdea('Test Cancel', 'Original content', 'test')
    
    // Start editing
    cy.contains('Test Cancel').parent().find('button').contains('Edit').click()
    
    // Make a change but don't save
    cy.get('input[placeholder="Title"]').clear().type('Changed Title')
    
    // Cancel the edit
    cy.get('button').contains('Cancel').click()
    
    // Verify the original content is still there
    cy.contains('Test Cancel').should('be.visible')
    cy.contains('Changed Title').should('not.exist')
  })
})
