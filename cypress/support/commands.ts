// Custom commands for common operations

Cypress.Commands.add('login', (password: string = 'dev-secret') => {
  cy.visit('/login')
  cy.get('input[type="password"]').type(password)
  cy.get('button').contains('Login').click()
  cy.url().should('eq', Cypress.config().baseUrl + '/')
})

Cypress.Commands.add('createIdea', (title: string, note: string, tags: string) => {
  cy.get('input[placeholder="Title"]').type(title)
  cy.get('textarea[placeholder="Note"]').type(note)
  cy.get('input[placeholder="tags (comma separated)"]').type(tags)
  cy.get('button').contains('Add').click()
})
