/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    login(password?: string): Chainable<void>
    createIdea(title: string, note: string, tags: string): Chainable<void>
  }
}
