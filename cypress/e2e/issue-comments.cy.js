import { faker } from "@faker-js/faker";

describe("Issue comments creating, editing and deleting", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board");
        cy.contains("This is an issue of type: Task.").click();
      });
  });

  const getIssueDetailsModal = () =>
    cy.get('[data-testid="modal:issue-details"]');
  const getIssueComment = '[data-testid="issue-comment"]';
  const getCommentInputField = 'textarea[placeholder="Add a comment..."]';

  const randomComment = faker.lorem.sentence();
  const editedComment = faker.lorem.sentence();

  const deleteText = "Are you sure you want to delete this comment?";
  const deleteMessage = "Once you delete, it's gone for good";

  it("Should create, edit and delete a comment successfully", () => {
    getIssueDetailsModal().within(() => {
      cy.contains("Add a comment...").click();

      cy.get(getCommentInputField).type(randomComment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.contains("Add a comment...").should("exist");
      cy.get(getIssueComment).should("contain", randomComment);
    });

    getIssueDetailsModal().within(() => {
      cy.get(getIssueComment)
        .first()
        .contains("Edit")
        .click()
        .should("not.exist");

      cy.get(getCommentInputField)
        .should("contain", randomComment)
        .clear()
        .type(editedComment);

      cy.contains("button", "Save").click().should("not.exist");

      cy.get(getIssueComment)
        .should("contain", "Edit")
        .and("contain", editedComment);
    });

    getIssueDetailsModal().find(getIssueComment).contains("Delete").click();

    cy.get('[data-testid="modal:confirm"]').within(() => {
      cy.contains(deleteText).should("be.visible");
      cy.contains(deleteMessage).should("be.visible");
      cy.contains("button", "Delete comment").click().should("not.exist");
    });

    getIssueDetailsModal().find(getIssueComment);
    cy.contains(editedComment).should("not.exist");
  });
});
