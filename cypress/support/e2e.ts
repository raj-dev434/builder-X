// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Hide fetch/XHR requests from command log
Cypress.on('window:before:load', (win) => {
  // Remove fetch from window to avoid logging
  delete win.fetch;
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Don't fail tests on uncaught exceptions
  return false;
});
