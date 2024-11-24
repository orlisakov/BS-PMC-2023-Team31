describe('Senerio for Volunteer', () => {
/* global cy,after */
    beforeEach(() => {
        cy.visit('http://localhost:3000/'); // Visit the homepage
        cy.viewport(1920, 1080);
    });

    it('Volunteer sign up successfully', () => {

        cy.get('.nav-item.register').click(); // Click the registration button

        cy.get('.tablinks').should('exist'); // Check if the tabs are loaded

        cy.get('input[name="VolName"]').type('volunteerTest');
        cy.get('input[name="VolLastName"]').type('volunteerTest');
        cy.get('#fieldOfActivity').type('050{enter}');
        cy.get('input[name="phoneNumber"]').type('8854335');
        cy.get('input[name="email"]').type('exemple1@gmail.com');
        cy.get('input[name="password"]').type('password');
        cy.get('input[name="passwordConfirmation"]').type('password');

        // Submit the form
        cy.get('button[type="submit"]').click();
    });

    it('Volunteer Whislist an association', () => {
        cy.get('.nav-item.login').click();
        cy.get('input[name=email]').type('exemple1@gmail.com');
        cy.get('input[name=password]').type('password');
        cy.get('button[type=submit]').click();
        cy.wait(500);
        cy.on('window:confirm', (str) => {
            expect(str).to.equal('שים לב! יש להיכנס לדף הפרופיל על מנת למלא את הפרטים האישיים');
        });

        cy.get('.menu-bar').contains('li', 'עמותות').click();
        cy.wait(500);
        cy.get('.card .post-link').first().click();

        // Check wishlist button and click on it
        cy.get('.wishlist-button').should('exist').click();
        cy.wait(500);

        // Click it again to remove the association from the wishlist
        cy.get('.wishlist-button').click();
        cy.wait(1000);
    });

    afterEach(() => {
        cy.wait(500);
    });

    after(async () => {
        cy.request('DELETE', `http://localhost:5000/deleteVolunteerTest`).its('status').should('eq', 200);
    });
});