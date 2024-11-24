describe('template spec', () => {
  it('passes', () => {
    cy.visit('https://example.cypress.io')
  })
  /* global cy,before,after */
  describe('Senerio for Association', () => {
    let associations;

    before(() => {
      // Load fixture before starting tests
      cy.fixture('association.json').then((loadedAssociations) => {
        associations = loadedAssociations;
      });
    });

    beforeEach(() => {
      cy.visit('http://localhost:3000/'); // Visit the homepage
      cy.viewport(1920, 1080);

    });

    it('Association sign up successfully', () => {

      cy.get('.App').should('exist'); // Check if the app is loaded

      cy.get('.nav-item.register').click(); // Click the registration button

      cy.get('.tablinks').should('exist'); // Check if the tabs are loaded
      cy.contains('button', 'עמותה').click(); // Click the association tab

      // Pass input to the fields using the fixture data
      const association = associations; // Using the first association as an example
      cy.get('input[name=associationName]').type('עמותה לדוגמא');
      cy.get('input[name=associationrecruiterName]').type('שם מגייס');
      cy.get('input[name=email]').type('example@email.com');
      cy.get('#fieldOfActivity').type('050{enter}');
      cy.get('input[name="phoneNumber"]').type('8854335');
      cy.get('input[name=password]').type('password');
      cy.get('input[name=passwordConfirmation]').type('password');

      cy.get('#joinDate').clear().type(association['תאריך רישום עמותה']);

      // Submit the form
      cy.get('button[type=submit]').click();
    });


    it('Association login, enter to profile page, add event successfully', () => {
      cy.get('.nav-item.login').click();
      cy.get('input[name=email]').type('example@email.com');
      cy.get('input[name=password]').type('password');
      cy.get('button[type=submit]').click();
      cy.wait(500);
      cy.on('window:confirm', (str) => {
        expect(str).to.equal('שים לב! יש להיכנס לדף הפרופיל על מנת למלא את הפרטים האישיים');
      });
      cy.get('.nav-item.register').click();
      cy.wait(500);
      cy.contains('button', 'הגדרות').click();
      cy.wait(500);
      cy.get('.side-menu').contains('li', 'אירועים').click();
      cy.contains('button', 'הוספת אירוע').click();
      cy.wait(500);

      // Filling event fields
      cy.get('input[type=text]').type('Event Topic'); // Enter event topic
      cy.get('textarea').type('Event Description'); // Enter event description
      cy.get('input[type=date]').first().type('2023-06-01'); // Enter event start date
      cy.get('input[type=date]').last().type('2023-06-02'); // Enter event end date
      cy.get('input[type=number]').type('50'); // Enter amount of volunteers

      // Submit the event form
      cy.get('button[type=submit]').click();
      cy.wait(1000);

      cy.get('.table tbody tr').should('have.length.at.least', 1);

    });


    afterEach(() => {
      cy.wait(500);
    });

    after(async () => {
      cy.request('DELETE', `http://localhost:5000/deleteAssociationTest`).its('status').should('eq', 200);
      cy.request('DELETE', `http://localhost:5000/deleteEventesTest`).its('status').should('eq', 200);
    });
  });
});