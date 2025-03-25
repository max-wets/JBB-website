describe('Navigation', () => {
  it('should display the home page', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/');

    // The new page should contain an h1 with "Julie Baronnie Beauty"
    cy.get('h1').contains('Julie Baronnie Beauty');
  });
});
