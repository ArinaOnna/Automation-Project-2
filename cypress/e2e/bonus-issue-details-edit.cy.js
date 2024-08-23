describe("Issue details editing", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  it("should check the dropdown “Priority” on the issue detail page", () => {
    const expectedLength = 5;
    let priorityValues = [];

    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:priority"]')
        .contains("High")
        .click("bottomRight");

      cy.get('[data-testid="select:priority"]')
        .invoke("text")
        .then((High) => {
          priorityValues.push(High.trim());
        });

      cy.get('[data-testid="select:priority"]').click("bottomRight");

      cy.get('[data-testid^="select-option:"]')
        .each(($option) => {
          const optionText = $option.text().trim();
          priorityValues.push(optionText);
          cy.log(
            "Added value:",
            optionText,
            "Array length:",
            priorityValues.length
          );
        })

        .then(() => {
          const expectedPriorities = [
            "Lowest",
            "Low",
            "Medium",
            "High",
            "Highest",
          ];

          cy.get('[data-testid="select:priority"]').click();

          expect(priorityValues).to.have.length(expectedLength);
          expect(priorityValues).to.have.members(expectedPriorities);
        });
    });
  });

  it("Should check that reporter name has only characters", () => {
    // Access reporter name element
    getIssueDetailsModal().within(() => {
      cy.get('[data-testid="select:reporter"]')
        .wait(1000)
        .should("be.visible")
        .invoke("text")
        .then((reporterName) => {
          expect(reporterName).to.match(/^[A-Za-z\s]+$/);
        });
    });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
});
