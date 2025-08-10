describe('Ideas Page', () => {
  beforeEach(() => {
    // Login first
    cy.visit('/login')
    cy.get('input[type="password"]').type('dev-secret')
    cy.get('button').contains('Login').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should display create idea form when logged in', () => {
    cy.get('input[placeholder="Title"]').should('be.visible')
    cy.get('textarea[placeholder="Note"]').should('be.visible')
    cy.get('input[placeholder="tags (comma separated)"]').should('be.visible')
    cy.get('button').contains('Add').should('be.visible')
  })

  it('should create a new idea', () => {
    const title = 'Test Idea'
    const note = 'This is a test idea'
    const tags = 'test, cypress'

    cy.get('input[placeholder="Title"]').type(title)
    cy.get('textarea[placeholder="Note"]').type(note)
    cy.get('input[placeholder="tags (comma separated)"]').type(tags)
    cy.get('button').contains('Add').click()

    // Should display the new idea
    cy.contains(title).should('be.visible')
    cy.contains(note).should('be.visible')
    cy.contains('test').should('be.visible')
    cy.contains('cypress').should('be.visible')
  })

  it('should search for ideas', () => {
    // Create a test idea first
    cy.get('input[placeholder="Title"]').type('Searchable Idea')
    cy.get('textarea[placeholder="Note"]').type('This idea should be searchable')
    cy.get('input[placeholder="tags (comma separated)"]').type('search, test')
    cy.get('button').contains('Add').click()

    // Search for the idea
    cy.get('input[placeholder="Search by title, note, or tag…"]').type('Searchable')
    cy.contains('Searchable Idea').should('be.visible')
  })

  it('should show logout dropdown', () => {
    cy.get('button').contains('Account').should('be.visible')
    cy.get('button').contains('Account').click()
    cy.get('button').contains('Logout').should('be.visible')
  })
})
