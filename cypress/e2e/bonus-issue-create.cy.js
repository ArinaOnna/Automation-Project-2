describe("Issue create", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        // System will already open issue creating modal in beforeEach block
        cy.visit(url + "/board?modal-issue-create=true");
      });
  });

  it("verifies spaces are trimmed from title on board", () => {
    const title = " Hello       world! ";

    cy.createIssue("New issue for trim", title, "Baby Yoda");

    cy.get('[data-testid="icon:close"]').first().click();

    cy.get('[data-testid="list-issue"]')
      .first()
      .click()
      .invoke("text")
      .then((boardTitle) => {
        const trimmedTitle = boardTitle.trim();
        expect(trimmedTitle).to.equal(title.trim());
      });

    cy.get('[data-testid="icon:close"]').first().click();
    cy.get('[data-testid="list-issue"]')
      .first()
      .should("contain", title.trim());
  });

  //Function

  Cypress.Commands.add(
    "createIssue",
    (issueType, description, title, assignee) => {
      cy.get('[data-testid="modal:issue-create"]').within(() => {
        cy.get('[data-testid="select:type"]').click();
        cy.get('[data-testid="select-option:Bug"]').click();
        cy.get(".ql-editor").type("New issue for trim");
        cy.get('input[name="title"]').type(" Hello       world! ");
        cy.get('[data-testid="select:userIds"]').click();
        cy.get('[data-testid="select-option:Lord Gaben"]').click();
        cy.get('button[type="submit"]').click();
      });

      cy.contains("Issue has been successfully created.")
        .should("be.visible")
        .wait(20000);
      cy.get('[data-testid="board-list:backlog"]')
        .should("be.visible")
        .contains("Hello world!")
        .click();
    }
  );
});
