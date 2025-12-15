describe('BuilderX Page Builder E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.waitForPageLoad();
  });

  describe('Page Load', () => {
    it('should load the page builder interface', () => {
      cy.get('[data-testid="app-container"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('be.visible');
      cy.get('[data-testid="canvas"]').should('be.visible');
      cy.get('[data-testid="toolbar"]').should('be.visible');
    });

    it('should show empty canvas state', () => {
      cy.get('[data-testid="canvas"]').should('contain', 'Start building your page');
      cy.get('[data-testid="canvas"]').should('contain', 'Drag blocks from the sidebar or click to add them');
    });
  });

  describe('Block Addition', () => {
    it('should add a text block when clicked', () => {
      cy.get('[data-testid="block-text"]').click();
      
      cy.get('[data-testid="canvas"]').should('contain', 'Text content');
      cy.get('[data-testid="inspector"]').should('be.visible');
    });

    it('should add an image block when clicked', () => {
      cy.get('[data-testid="block-image"]').click();
      
      cy.get('[data-testid="canvas"]').should('contain', 'Image');
      cy.get('[data-testid="inspector"]').should('be.visible');
    });

    it('should add a button block when clicked', () => {
      cy.get('[data-testid="block-button"]').click();
      
      cy.get('[data-testid="canvas"]').should('contain', 'Button');
      cy.get('[data-testid="inspector"]').should('be.visible');
    });

    it('should add a section block when clicked', () => {
      cy.get('[data-testid="block-section"]').click();
      
      cy.get('[data-testid="canvas"]').should('contain', 'Section');
      cy.get('[data-testid="inspector"]').should('be.visible');
    });
  });

  describe('Block Selection and Editing', () => {
    beforeEach(() => {
      cy.get('[data-testid="block-text"]').click();
    });

    it('should select a block when clicked', () => {
      cy.get('[data-testid="canvas"]').find('[data-block-id]').first().click();
      
      cy.get('[data-testid="inspector"]').should('be.visible');
      cy.get('[data-testid="inspector"]').should('contain', 'Block Properties');
    });

    it('should enter edit mode on double click', () => {
      cy.get('[data-testid="canvas"]').find('[data-block-id]').first().dblclick();
      
      cy.get('[data-testid="canvas"]').find('[contenteditable="true"]').should('be.visible');
    });

    it('should save changes on blur', () => {
      cy.get('[data-testid="canvas"]').find('[data-block-id]').first().dblclick();
      
      cy.get('[data-testid="canvas"]').find('[contenteditable="true"]')
        .clear()
        .type('Updated content');
      
      cy.get('[data-testid="canvas"]').find('[contenteditable="true"]').blur();
      
      cy.get('[data-testid="canvas"]').should('contain', 'Updated content');
    });

    it('should cancel changes on escape', () => {
      cy.get('[data-testid="canvas"]').find('[data-block-id]').first().dblclick();
      
      cy.get('[data-testid="canvas"]').find('[contenteditable="true"]')
        .clear()
        .type('Updated content');
      
      cy.get('[data-testid="canvas"]').find('[contenteditable="true"]').type('{esc}');
      
      cy.get('[data-testid="canvas"]').should('contain', 'Text content');
    });
  });

  describe('Toolbar Functionality', () => {
    it('should show undo/redo buttons', () => {
      cy.get('[data-testid="toolbar"]').should('contain', 'Undo');
      cy.get('[data-testid="toolbar"]').should('contain', 'Redo');
    });

    it('should show export and clear buttons', () => {
      cy.get('[data-testid="toolbar"]').should('contain', 'Export');
      cy.get('[data-testid="toolbar"]').should('contain', 'Clear');
    });

    it('should open export modal when export button is clicked', () => {
      cy.get('[data-testid="toolbar"]').find('button').contains('Export').click();
      
      cy.get('[data-testid="export-modal"]').should('be.visible');
    });

    it('should clear canvas when clear button is clicked', () => {
      cy.get('[data-testid="block-text"]').click();
      cy.get('[data-testid="canvas"]').should('contain', 'Text content');
      
      cy.get('[data-testid="toolbar"]').find('button').contains('Clear').click();
      
      cy.get('[data-testid="canvas"]').should('contain', 'Start building your page');
    });
  });

  describe('Keyboard Shortcuts', () => {
    beforeEach(() => {
      cy.get('[data-testid="block-text"]').click();
    });

    it('should undo on Ctrl+Z', () => {
      cy.get('[data-testid="canvas"]').should('contain', 'Text content');
      
      cy.get('body').type('{ctrl+z}');
      
      cy.get('[data-testid="canvas"]').should('contain', 'Start building your page');
    });

    it('should redo on Ctrl+Y', () => {
      cy.get('[data-testid="canvas"]').should('contain', 'Text content');
      
      cy.get('body').type('{ctrl+z}');
      cy.get('[data-testid="canvas"]').should('contain', 'Start building your page');
      
      cy.get('body').type('{ctrl+y}');
      cy.get('[data-testid="canvas"]').should('contain', 'Text content');
    });
  });

  describe('Export Functionality', () => {
    beforeEach(() => {
      cy.get('[data-testid="block-text"]').click();
    });

    it('should export HTML', () => {
      cy.get('[data-testid="toolbar"]').find('button').contains('Export').click();
      
      cy.get('[data-testid="export-modal"]').should('be.visible');
      cy.get('[data-testid="export-modal"]').should('contain', 'HTML Output');
      
      cy.get('[data-testid="export-modal"]').find('textarea').should('contain', '<!DOCTYPE html>');
      cy.get('[data-testid="export-modal"]').find('textarea').should('contain', 'Text content');
    });

    it('should export JSON', () => {
      cy.get('[data-testid="toolbar"]').find('button').contains('Export').click();
      
      cy.get('[data-testid="export-modal"]').find('button').contains('Export as JSON').click();
      
      cy.get('[data-testid="export-modal"]').should('contain', 'JSON Schema');
      cy.get('[data-testid="export-modal"]').find('textarea').should('contain', '"type":"text"');
    });

    it('should download export file', () => {
      cy.get('[data-testid="toolbar"]').find('button').contains('Export').click();
      
      cy.get('[data-testid="export-modal"]').find('button').contains('Download').click();
      
      // Verify download was triggered (this is a basic check)
      cy.window().then((win) => {
        expect(win.URL.createObjectURL).to.be.called;
      });
    });
  });

  describe('Responsive Design', () => {
    it('should work on mobile viewport', () => {
      cy.viewport(375, 667);
      
      cy.get('[data-testid="app-container"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('be.visible');
      cy.get('[data-testid="canvas"]').should('be.visible');
    });

    it('should work on tablet viewport', () => {
      cy.viewport(768, 1024);
      
      cy.get('[data-testid="app-container"]').should('be.visible');
      cy.get('[data-testid="sidebar"]').should('be.visible');
      cy.get('[data-testid="canvas"]').should('be.visible');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      cy.get('[data-testid="block-text"]').should('have.attr', 'aria-label');
      cy.get('[data-testid="canvas"]').should('have.attr', 'role');
    });

    it('should be keyboard navigable', () => {
      cy.get('body').tab();
      cy.focused().should('be.visible');
    });
  });
});
