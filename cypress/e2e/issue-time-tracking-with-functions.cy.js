//Variables
const backlog = '[data-testid="board-list:backlog"]';
const stopWatch = '[data-testid="icon:stopwatch"]';
const inputTime = 'input[placeholder="Number"]';
const closeButton = '[data-testid="icon:close"]';
const timeTrackingModal = '[data-testid="modal:tracking"]';
const title = "Time";

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
    cy.addTimeEstimation(10);
    cy.get(backlog).should("be.visible").contains(title).click();

    cy.get(stopWatch)
      .parent()
      .should("contain", "10h estimated")
      .should("be.visible");

    cy.editTimeEstimation(20);
    cy.get(backlog).should("be.visible").contains(title).click();

    cy.get(stopWatch)
      .parent()
      .should("contain", "20h estimated")
      .should("be.visible");

    cy.deleteTimeEstimation();
    cy.get(backlog).should("be.visible").contains(title).click();

    cy.get(stopWatch)
      .parent()
      .should("contain", "No time logged")
      .should("be.visible");
  });

  it("Should add and remove logged time from recently created issue", () => {
    cy.get(stopWatch).click();
    cy.logTime(2, 5);

    cy.get(stopWatch)
      .parent()
      .should("contain", "2h logged")
      .should("be.visible");

    cy.get(stopWatch).click();

    cy.editLogTime(3, 6);

    cy.get(stopWatch)
      .parent()
      .should("contain", "3h logged")
      .should("be.visible");

    cy.get(stopWatch).click();

    cy.removeLoggedTime();

    cy.get(stopWatch)
      .parent()
      .should("contain", "No time logged")
      .should("be.visible");
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

  Cypress.Commands.add("logTime", (hoursSpent, hoursRemaining) => {
    cy.get(timeTrackingModal).within(() => {
      cy.get(inputTime).first().type(hoursSpent).wait(1000);
      cy.get(inputTime).eq(1).type(hoursRemaining).wait(1000);
      cy.contains("button", "Done").click().should("not.exist");
    });
  });

  Cypress.Commands.add("editLogTime", (hoursSpent, hoursRemaining) => {
    cy.get(timeTrackingModal).within(() => {
      cy.get(inputTime).first().clear().type(hoursSpent).wait(1000);
      cy.get(inputTime).eq(1).clear().type(hoursRemaining).wait(1000);
      cy.contains("button", "Done").click().should("not.exist");
    });
  });

  Cypress.Commands.add("removeLoggedTime", () => {
    cy.get(timeTrackingModal).within(() => {
      cy.get(inputTime).first().clear().wait(1000);
      cy.get(inputTime).eq(1).clear().wait(1000);
      cy.contains("button", "Done").click().should("not.exist");
    });
  });

  Cypress.Commands.add("addTimeEstimation", (hours) => {
    cy.get(inputTime).type(hours).wait(1000);
    cy.get(closeButton).first().click();
  });

  Cypress.Commands.add("editTimeEstimation", (hours) => {
    cy.get(inputTime).clear().type(hours).wait(1000);
    cy.get(closeButton).first().click();
  });

  Cypress.Commands.add("deleteTimeEstimation", () => {
    cy.get(inputTime).clear().click().wait(1000);
    cy.get(closeButton).first().click();
  });
});
