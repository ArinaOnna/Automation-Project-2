// Variables
const confirmationModal = '[data-testid="modal:confirm"]';
const issueDetailsModal = '[data-testid="modal:issue-details"]';
const trashButton = '[data-testid="icon:trash"]';
const closeIssueModal = '[data-testid="icon:close"]';

const backlogList = '[data-testid="list-issue"]';
const backlog = '[data-testid="board-list:backlog"]';

const issueTitle = "This is an issue of type: Task.";
const deleteText = "Are you sure you want to delete this issue?";
const deleteMessage = "Once you delete, it's gone for good";

const expectedAmountOfIssuesAfterDeletion = 3;
const expectedAmountOfIssuesAfterCancel = 4;

describe("Issue deletion and deletion cancellation", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains(issueTitle).click();
      });
  });

  it("Should delete issue successfully", () => {
    cy.get(issueDetailsModal).should("be.visible");
    cy.get(trashButton).should("be.visible").click();
    cy.get(confirmationModal).should("be.visible");
    cy.get(confirmationModal).within(() => {
      cy.contains(deleteText).should("be.visible");
      cy.contains(deleteMessage).should("be.visible");
      cy.get("button").contains("Delete issue").click();
    });

    cy.get(confirmationModal).should("not.exist");

    cy.get(backlog).within(() => {
      cy.contains(issueTitle).should("not.exist");
      cy.get(backlogList).should("have.length", 3);
    });
  });

  it("Should cancel issue deletion process successfully", () => {
    cy.get(issueDetailsModal).should("be.visible");
    cy.get(trashButton).click();
    cy.get(confirmationModal).should("be.visible");
    cy.get(confirmationModal).within(() => {
      cy.contains(deleteText).should("be.visible");
      cy.contains(deleteMessage).should("be.visible");
      cy.get("button").contains("Cancel").click();
    });

    cy.get(confirmationModal).should("not.exist");
    cy.get(closeIssueModal).first().click();
    cy.get(issueDetailsModal).should("not.exist");

    cy.get(backlog).within(() => {
      cy.contains(issueTitle).should("be.visible");
      cy.get(backlogList).should("have.length", 4);
    });
  });
});
