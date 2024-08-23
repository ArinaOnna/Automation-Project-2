import IssueModal from "../pages/IssueModal";
import { faker } from "@faker-js/faker";

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

  it("Should create an issue with random data and validate it successfully", () => {
    const randomTitle = faker.random.word();
    const randomDescription = faker.lorem.sentence();
    // Variables
    const Title = cy.get('input[name="title"]');
    const IssueTypeTask = cy.get('[data-testid="icon:task"]');
    // Function
    function clickSubmitButton() {
      cy.get('button[type="submit"]').click();
    }

    // Issue details
    const issueDetails = {
      type: "Task",
      title: randomTitle,
      description: randomDescription,
      assignee: "Baby Yoda",
    };

    cy.get('[data-testid="modal:issue-create"]').within(() => {
      cy.get(".ql-editor").type(randomDescription);
      cy.get(".ql-editor").should("have.text", randomDescription);

      Title.type(randomTitle);
      Title.should("have.value", randomTitle);

      // Issue type - Task
      cy.get('[data-testid="icon:task"]').scrollIntoView();
      cy.get('[data-testid="icon:task"]').should("be.visible");

      // Reporter - Baby Yoda
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Priority - Low
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Low"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");

      // Create issue

      clickSubmitButton();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", 1)
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", 5)
          .first()
          .find("p")
          .contains(randomTitle)
          .siblings()
          .within(() => {});
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains(randomTitle)
      .within(() => {
        // Assert that correct type icon is visible
        cy.get('[data-testid="icon:task"]').should("be.visible");
      });
  });

  it("Should create a custom issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get(".ql-editor").type("My bug description");
      cy.get(".ql-editor").should("have.text", "My bug description");

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type("Bug");
      cy.get('input[name="title"]').should("have.value", "Bug");

      // Open issue type dropdown and choose Bug
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="icon:bug"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:bug"]').should("be.visible");

      // Select priority as 'Highest'
      cy.get('[data-testid="select:priority"]').click();
      cy.get('[data-testid="select-option:Highest"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");

      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Lord Gaben"]').click();

      cy.get('button[type="submit"]').click();
    });

    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", 1)
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", 5)
          .first()
          .find("p")
          .contains("Bug")
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
            cy.get('[data-testid="icon:bug"]').should("be.visible");
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains("Bug")
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Lord Gaben"]').should("be.visible");
        cy.get('[data-testid="icon:bug"]').should("be.visible");
      });
  });

  it("Should create an issue and validate it successfully", () => {
    // System finds modal for creating issue and does next steps inside of it
    cy.get('[data-testid="modal:issue-create"]').within(() => {
      // Type value to description input field
      cy.get(".ql-editor").type("TEST_DESCRIPTION");
      cy.get(".ql-editor").should("have.text", "TEST_DESCRIPTION");

      // Type value to title input field
      // Order of filling in the fields is first description, then title on purpose
      // Otherwise filling title first sometimes doesn't work due to web page implementation
      cy.get('input[name="title"]').type("TEST_TITLE");
      cy.get('input[name="title"]').should("have.value", "TEST_TITLE");

      // Open issue type dropdown and choose Story
      cy.get('[data-testid="select:type"]').click();
      cy.get('[data-testid="select-option:Story"]')
        .wait(1000)
        .trigger("mouseover")
        .trigger("click");
      cy.get('[data-testid="icon:story"]').should("be.visible");

      // Select Baby Yoda from reporter dropdown
      cy.get('[data-testid="select:reporterId"]').click();
      cy.get('[data-testid="select-option:Baby Yoda"]').click();

      // Select Baby Yoda from assignee dropdown
      cy.get('[data-testid="form-field:userIds"]').click();
      cy.get('[data-testid="select-option:Pickle Rick"]').click();

      // Click on button "Create issue"
      cy.get('button[type="submit"]').click();
    });

    // Assert that modal window is closed and successful message is visible
    cy.get('[data-testid="modal:issue-create"]').should("not.exist");
    cy.contains("Issue has been successfully created.").should("be.visible");

    // Reload the page to be able to see recently created issue
    // Assert that successful message has dissappeared after the reload
    cy.reload();
    cy.contains("Issue has been successfully created.").should("not.exist");

    // Assert than only one list with name Backlog is visible and do steps inside of it
    cy.get('[data-testid="board-list:backlog"]')
      .should("be.visible")
      .and("have.length", 1)
      .within(() => {
        // Assert that this list contains 5 issues and first element with tag p has specified text
        cy.get('[data-testid="list-issue"]')
          .should("have.length", 5)
          .first()
          .find("p")
          .contains("TEST_TITLE")
          .siblings()
          .within(() => {
            //Assert that correct avatar and type icon are visible
            cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
            cy.get('[data-testid="icon:story"]').should("be.visible");
          });
      });

    cy.get('[data-testid="board-list:backlog"]')
      .contains("TEST_TITLE")
      .within(() => {
        // Assert that correct avatar and type icon are visible
        cy.get('[data-testid="avatar:Pickle Rick"]').should("be.visible");
        cy.get('[data-testid="icon:story"]').should("be.visible");
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
