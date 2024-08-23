const issueModal = '[data-testid="modal:issue-create"]';
const issueType = '[data-testid="select:type"]';
const issueTypeBug = '[data-testid="select-option:Bug"]';
const descriptionField = ".ql-editor";
const issueTitle = 'input[name="title"]';
const assignee = '[data-testid="select:userIds"]';
const babyYoda = '[data-testid="select-option:Baby Yoda"]';
const submitButton = 'button[type="submit"]';

const backlog = '[data-testid="board-list:backlog"]';
const stopWatch = '[data-testid="icon:stopwatch"]';
const inputTime = 'input[placeholder="Number"]';
const closeButton = '[data-testid="icon:close"]';
const timeTrackingModal = '[data-testid="modal:tracking"]';

describe("Covering time estimation and time logging functionality", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.url()
      .should("eq", `${Cypress.env("baseUrl")}project/board`)
      .then((url) => {
        cy.visit(url + "/board?modal-issue-create=true");

        cy.createIssue("Issue for time tracking", "Time", "Baby Yoda");
      });
  });

  it("Should add, edit and delete the time estimation from recently created issue", () => {
    cy.get(stopWatch).parent().should("contain", "No time logged");
    cy.get(inputTime).type(10).wait(1000);
    cy.get(closeButton).first().click();
    cy.get(backlog).should("be.visible").contains("Time").click();
    cy.get(stopWatch)
      .parent()
      .should("contain", "10h estimated")
      .should("be.visible");

    cy.get(inputTime).clear().type(20).wait(1000);
    cy.get(closeButton).first().click();
    cy.get(backlog).should("be.visible").contains("Time").click();
    cy.get(stopWatch)
      .parent()
      .should("contain", "20h estimated")
      .should("be.visible");

    cy.get(inputTime).clear().click().wait(1000);
    cy.get(closeButton).first().click();
    cy.get(backlog).should("be.visible").contains("Time").click();
    cy.get(stopWatch)
      .parent()
      .should("contain", "No time logged")
      .should("be.visible");
  });

  it.only("Should add and remove logged time from recently created issue", () => {
    //Test case ID - Log time
    cy.get(stopWatch).parent().should("contain", "No time logged");
    cy.get(inputTime).type(10).wait(1000);
    cy.get(closeButton).first().click();
    cy.get(backlog).should("be.visible").contains("Time").click();
    cy.get(stopWatch)
      .parent()
      .should("contain", "10h estimated")
      .should("be.visible");

    cy.get(stopWatch).click();

    cy.get(timeTrackingModal).within(() => {
      cy.get(inputTime).first().type(2).wait(1000);
      cy.get(inputTime).eq(1).type(5).wait(1000);
      cy.contains("button", "Done").click().should("not.exist");
    });

    cy.get(closeButton).first().click();
    cy.get(backlog).should("be.visible").contains("Time").click();

    cy.get(stopWatch)
      .parent()
      .should("contain", "2h logged")
      .should("be.visible");

    //Test case ID - Remove logged time
    cy.get(stopWatch).parent().should("contain", "2h logged").click();
    cy.get(timeTrackingModal).within(() => {
      cy.get(inputTime).first().clear().wait(1000);
      cy.get(inputTime).eq(1).clear().wait(1000);
      cy.contains("button", "Done").click().should("not.exist");
    });
    cy.get(stopWatch)
      .parent()
      .should("contain", "No time logged")
      .should("be.visible");
    cy.contains("No time logged");
    cy.contains("10h estimated");
  });
});

//Functsions

Cypress.Commands.add(
  "createIssue",
  (issueType, description, title, assignee) => {
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Bug"]').click();
      cy.get(".ql-editor").type("Issue for time tracking");
      cy.get('input[name="title"]').type("Time");
      cy.get('[data-testid="select:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();
      cy.get('button[type="submit"]').click();
    });

    cy.contains("Issue has been successfully created.").should("be.visible");
    cy.get(backlog).should("be.visible").contains("Time").click();
  }
);
