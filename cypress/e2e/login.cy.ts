describe("login flow", () => {
  it("takes a user from email entry through password login", () => {
    const dummyEmail = "dummy@example.com";
    const dummyPassword = "secret123";
    const dummyUser = {
      id: "a3e2d97d-0ec4-4eb9-9db6-3cb1a8c4dc20",
      username: "Dummy User",
      email: dummyEmail,
      role: "user",
      profilePicture: "https://example.com/avatar.png",
    };

    cy.intercept("POST", "**/auth?email=*", {
      statusCode: 200,
      body: {
        data: {
          username: dummyUser.username,
          email: dummyUser.email,
        },
      },
    }).as("validateEmail");

    cy.intercept("POST", "**/auth/login", (req) => {
      expect(req.body).to.deep.equal({
        email: dummyEmail,
        password: dummyPassword,
      });

      req.reply({
        statusCode: 200,
        body: {
          data: {
            token: "simulated-jwt-token",
            user: dummyUser,
          },
        },
      });
    }).as("loginRequest");

    cy.visit("/signin");

    cy.get('input[placeholder="Enter your email address"]').type(dummyEmail);
    cy.get("form").contains("button", "Continue").click();

    cy.wait("@validateEmail");
    cy.location("pathname").should("eq", "/login");
    cy.get('input[type="password"]').should("be.visible");
    cy.contains(dummyEmail).should("be.visible");

    cy.get('input[type="password"]').type(dummyPassword);
    cy.get("form").contains("button", "Login").click();

    cy.wait("@loginRequest");
    cy.location("pathname").should("eq", "/dashboard");
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem("authToken")).to.equal("simulated-jwt-token");
      expect(win.sessionStorage.getItem("userId")).to.equal(dummyUser.id);
      expect(win.sessionStorage.getItem("role")).to.equal(dummyUser.role);
      expect(win.sessionStorage.getItem("profileImage")).to.equal(dummyUser.profilePicture);
    });
  });
});
