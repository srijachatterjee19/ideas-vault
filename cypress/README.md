# Cypress Tests for Idea Vault

This directory contains end-to-end tests for the Idea Vault application using Cypress.

## Test Files

- **`login.cy.ts`** - Tests for the login page functionality
- **`ideas.cy.ts`** - Tests for the main ideas page functionality
- **`custom-commands.cy.ts`** - Tests demonstrating custom Cypress commands
- **`idea-operations.cy.ts`** - Tests for editing and deleting ideas

## Running Tests

### Open Cypress GUI
```bash
npm run cypress:open
```

### Run Tests Headlessly
```bash
npm run cypress:run
```

### Run Specific Test File
```bash
npm run cypress:run -- --spec "cypress/e2e/login.cy.ts"
```

## Prerequisites

1. Make sure your development server is running:
   ```bash
   npm run dev
   ```

2. Ensure the database is running and accessible

3. The default admin password is `dev-secret` (as set in your environment)

## Custom Commands

The tests use custom Cypress commands defined in `cypress/support/commands.ts`:

- `cy.login(password?)` - Logs in with the specified password (defaults to 'dev-secret')
- `cy.createIdea(title, note, tags)` - Creates a new idea with the specified data

## Test Structure

Each test file follows the pattern:
1. **Setup** - Navigate to the page and perform any necessary setup
2. **Action** - Perform the action being tested
3. **Assertion** - Verify the expected outcome

## Adding New Tests

When adding new tests:
1. Create a new `.cy.ts` file in the `cypress/e2e/` directory
2. Follow the existing naming convention
3. Use the custom commands when possible for consistency
4. Keep tests focused and independent

## Troubleshooting

- If tests fail, check that your dev server is running on `http://localhost:3000`
- Ensure the database is accessible and contains the expected data
- Check the Cypress video recordings and screenshots for failed tests
- Make sure all UI elements have the expected placeholders and text content
