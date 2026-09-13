describe('Event booking flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('lists available events', () => {
    cy.get('[data-cy=event-card]').should('have.length.greaterThan', 0);
  });

  it('shows the booking form after selecting an event', () => {
    cy.get('[data-cy=select-event]').first().click();
    cy.get('[data-cy=customer-name]').should('be.visible');
  });

  it('rejects booking with missing fields', () => {
    cy.get('[data-cy=select-event]').first().click();
    cy.get('[data-cy=submit-booking]').click();
    cy.get('[data-cy=booking-error]').should('be.visible');
  });

  it('confirms a valid booking', () => {
    cy.get('[data-cy=select-event]').first().click();
    cy.get('[data-cy=customer-name]').type('Fahim Rahman');
    cy.get('[data-cy=customer-email]').type('fahim@example.com');
    cy.get('[data-cy=seat-count]').clear().type('2');
    cy.get('[data-cy=submit-booking]').click();
    cy.get('[data-cy=booking-success]').should('be.visible');
  });

  // This test is EXPECTED TO FAIL against the current backend (seeded bug: the
  // service adds booked seats back instead of subtracting them). That failure is
  // the trigger for the whole pipeline: CI catches it -> scripts/report-to-jira.js
  // reads the mochawesome report -> files a JIRA bug -> JIRA Automation routes it.
  it('reduces available seats after a successful booking', () => {
    const eventName = 'Dhaka Tech Summit 2026';

    cy.contains('[data-cy=event-card]', eventName)
.find('[data-cy=seat-count-display]').invoke('text')        const seatsBefore = parseInt(before.match(/(\d+)\s*\/\s*(\d+)/)[1], 10);

        cy.contains('[data-cy=event-card]', eventName)
          .find('[data-cy=select-event]').click();
        cy.get('[data-cy=customer-name]').type('Nusrat Jahan');
        cy.get('[data-cy=customer-email]').type('nusrat@example.com');
        cy.get('[data-cy=seat-count]').clear().type('3');
        cy.get('[data-cy=submit-booking]').click();
        cy.get('[data-cy=booking-success]').should('be.visible');

        cy.reload();
        cy.contains('[data-cy=event-card]', eventName)
.find('[data-cy=seat-count-display]').invoke('text')            const seatsAfter = parseInt(after.match(/(\d+)\s*\/\s*(\d+)/)[1], 10);
            expect(seatsAfter).to.eq(seatsBefore - 3);
          });
      });
  });
});
