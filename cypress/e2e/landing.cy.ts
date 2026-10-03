const packages = [{ id: "small", name: "Small parcel", weightUnit: "kg", length: 20, width: 15, height: 10, dimensionUnit: "cm" }, { id: "large", name: "Large box", weightUnit: "kg", length: 40, width: 30, height: 20, dimensionUnit: "cm" }];

function openHome(width = 1280, height = 1000) {
  cy.viewport(width, height);
  cy.intercept("GET", "**/package-types*", { body: { data: packages } }).as("packages");
  cy.visit("/", { onBeforeLoad(win) {
    win.sessionStorage.clear();
    cy.stub(win.navigator.geolocation, "getCurrentPosition").callsFake((_success, error) => error({ code: 1 }));
  } });
  cy.get("#compare-pickup-location-input").should("be.visible");
  cy.get("#compare-pickup-location-input").should("be.focused");
}

function manualAddress(field: string, city: string, street: string) {
  cy.get(field).click();
  cy.contains("button", "Enter manually").click({ scrollBehavior: false });
  cy.get('[data-slot="popover-content"] [role="combobox"]').first().click({ scrollBehavior: false });
  cy.get('[role="option"]').contains(/^Lagos$/).click();
  cy.get('[data-slot="popover-content"] [role="combobox"]').eq(1).click({ scrollBehavior: false });
  cy.get('[role="option"]').contains(new RegExp(`^${city}$`)).click();
  cy.get('input[placeholder="e.g. Admiralty Way"]').type(street);
  cy.get('input[placeholder="e.g. 34"]').type("12");
  cy.get('[data-slot="popover-content"]').contains("button", /^Apply$/).click({ scrollBehavior: false });
  cy.get(field).should("contain.value", street);
}

describe("landing presentation preserves booking behavior", () => {
  beforeEach(() => {
    // Radix can defer resize notifications while positioning nested select portals.
    // Keep every other application exception fatal.
    cy.on("uncaught:exception", error => {
      if (error.message === "ResizeObserver loop completed with undelivered notifications.") return false;
    });
  });
  it("validates incomplete details and retains the address popup tools", () => {
    openHome();
    cy.get("body").type("{esc}");
    cy.get(".landing-form").contains("button", "Compare prices").click();
    cy.contains("Enter pickup location").should("be.visible");
    cy.get("#compare-pickup-location-input").click();
    cy.contains("button", "Use location").click();
    cy.contains("Location permission was denied or unavailable.").should("be.visible");
    cy.contains("button", "Enter manually").should("be.visible");

  });

  for (const viewport of [{ name: "desktop", width: 1440, height: 1000 }, { name: "mobile", width: 390, height: 844 }]) {
    it(`keeps selected addresses and package details through tracking and resize on ${viewport.name}`, () => {
      openHome(viewport.width, viewport.height);
      manualAddress("#compare-pickup-location-input", "Ikeja", "Allen Avenue");
      manualAddress("#compare-destination-location-input", "Lagos", "Admiralty Way");
      cy.get('button[data-appearance="landing"]').click();
      cy.contains("button", "Large box").click();
      cy.get('button[data-appearance="landing"]').should("contain.text", "Large box").click();
      cy.contains("button", "1-5kg").click();
      cy.get('button[data-appearance="landing"]').should("contain.text", "5kg");
      cy.get(".landing-modes").contains("button", "Track a delivery").click();
      cy.get("#trackingNumber").type("GOSTEST123");
      cy.get(".landing-modes").contains("button", "Compare prices").click();
      cy.get("#compare-pickup-location-input").should("contain.value", "Allen Avenue");
      cy.get("#compare-destination-location-input").should("contain.value", "Admiralty Way");
      cy.viewport(viewport.name === "mobile" ? 1440 : 390, 1000);
      cy.get("#compare-pickup-location-input").should("contain.value", "Allen Avenue");
      cy.window().then(win => { expect(JSON.parse(win.sessionStorage.getItem("bookingInputData")!)).to.include({ packageTypeId: "large", weight: "5" }); });
    });
  }

  it("submits the same quote payload and follows the existing results route", () => {
    openHome();
    manualAddress("#compare-pickup-location-input", "Ikeja", "Allen Avenue");
    manualAddress("#compare-destination-location-input", "Lagos", "Admiralty Way");
    cy.intercept("POST", "**/quotes?direct=false*", req => {
      expect(req.body[0]).to.include({ packageTypeId: "small", weight: "1", quantity: 1, itemValue: 0 });
      expect(req.body[0].pickupLocation).to.contain("Allen Avenue");
      expect(req.body[0].dropOffLocation).to.contain("Admiralty Way");
      req.reply({ body: { data: [] } });
    }).as("quotes");
    cy.get(".landing-form").contains("button", "Compare prices").click();
    cy.wait("@quotes");
    cy.location("pathname").should("eq", "/cost-calculator");
  });

  it("keeps tracking validation and API errors intact", () => {
    openHome();
    cy.get(".landing-modes").contains("button", "Track a delivery").click();
    cy.get(".landing-form").contains("button", "Track a delivery").click();
    cy.contains("Please enter a tracking number").should("be.visible");
    cy.intercept("GET", "**/bookings/track/GOSTEST123", { statusCode: 404, body: { message: "Tracking test: not found" } }).as("tracking");
    cy.get("#trackingNumber").type("GOSTEST123");
    cy.get(".landing-form").contains("button", "Track a delivery").click();
    cy.wait("@tracking");
    cy.location("pathname").should("eq", "/");
    cy.get("#trackingNumber").should("have.value", "GOSTEST123");
  });

  it("renders a successful tracking object and survives refreshing the results page", () => {
    openHome();
    const booking = { trackingNumber: "GOSTEST123", id: "test-booking", status: "IN_TRANSIT", hasRating: true, bookingDate: "2026-10-03T12:00:00Z", packageType: { name: "Small parcel" }, maxWeight: 1, weightUnit: "kg", length: 20, width: 15, height: 10, dimensionsUnit: "cm", company: { name: "Test Courier" }, trackingHistories: [] };
    cy.intercept("GET", "**/bookings/track/GOSTEST123", { body: { data: booking } }).as("successfulTracking");
    cy.get(".landing-modes").contains("button", "Track a delivery").click();
    cy.get("#trackingNumber").type(" GOSTEST123 ");
    cy.get(".landing-form").contains("button", "Track a delivery").click();
    cy.wait("@successfulTracking");
    cy.location("pathname").should("eq", "/track-booking");
    cy.contains("h1", "GOSTEST123").should("be.visible");
    cy.contains("Test Courier").should("be.visible");
    cy.reload();
    cy.contains("h1", "GOSTEST123").should("be.visible");
  });

  it("uses the updated quote page with the existing fields on mobile", () => {
    openHome(390, 844);
    cy.get("body").type("{esc}");
    cy.visit("/cost-calculator");
    cy.get(".landing-form").should("be.visible");
    manualAddress("#compare-pickup-location-input", "Ikeja", "Allen Avenue");
    manualAddress("#compare-destination-location-input", "Lagos", "Admiralty Way");
    cy.intercept("POST", "**/quotes?direct=false*", { body: { data: [] } }).as("quotePageRequest");
    cy.get(".landing-form").contains("button", "Compare prices").click();
    cy.wait("@quotePageRequest");
    cy.get("#compare-pickup-location-input").should("contain.value", "Allen Avenue");
    cy.get(".landing-modes").contains("button", "Track a delivery").click();
    cy.get("#trackingNumber").should("be.visible");
    cy.window().then(win => expect(win.document.documentElement.scrollWidth).to.equal(390));
  });

  for (const route of [
    { label: "Ikeja to Lekki", pickup: "Ikeja", destination: "Lekki" },
    { label: "Yaba to Victoria Island", pickup: "Yaba", destination: "Victoria Island" },
    { label: "Lagos to Ibadan", pickup: "Lagos", destination: "Ibadan" },
  ]) it(`prefills ${route.label} searches and clears stale selected addresses`, () => {
    openHome();
    cy.get("body").type("{esc}");
    cy.window().then(win => win.sessionStorage.setItem("bookingInputData", JSON.stringify({ pickupLocation: "12 Allen Avenue, Ikeja, Lagos", dropOffLocation: "12 Admiralty Way, Lagos", packageTypeId: "small", weight: "1" })));
    cy.contains(".landing-route-card", route.label).click();
    cy.location("pathname").should("eq", "/cost-calculator");
    cy.get("#compare-pickup-location-input").should("have.value", route.pickup);
    cy.get("#compare-destination-location-input").should("have.value", route.destination);
    cy.get("#compare-destination-location-input").click();
    cy.get('.address-entry-actions button').first().should('contain.text', 'Use location');
    cy.contains("button", "Enter manually").click({ scrollBehavior: false });
    cy.get('[data-slot="popover-content"] [role="combobox"]').first().should('contain.text', route.destination === 'Ibadan' ? 'Oyo' : 'Lagos');
    cy.get('[data-slot="popover-content"] [role="combobox"]').eq(1).should('contain.text', route.destination);
    cy.get('input[placeholder="e.g. Admiralty Way"]').should('have.value', '');
    cy.get('body').type('{esc}');
    cy.get(".landing-form").contains("button", "Compare prices").click();
    cy.window().then(win => {
      const saved = JSON.parse(win.sessionStorage.getItem("bookingInputData")!);
      expect(saved.pickupLocation).to.equal("");
      expect(saved.dropOffLocation).to.equal("");
    });
    cy.location("pathname").should("eq", "/cost-calculator");
  });

  it("does not submit a stale selected address after the search text changes", () => {
    openHome();
    manualAddress("#compare-pickup-location-input", "Ikeja", "Allen Avenue");
    manualAddress("#compare-destination-location-input", "Lagos", "Admiralty Way");
    let requests = 0;
    cy.intercept("POST", "**/quotes?direct=false*", req => {
      requests += 1;
      req.reply({ data: [] });
    });
    cy.get("#compare-pickup-location-input").clear().type("Different address");
    cy.get('body').type('{esc}');
    cy.get(".landing-form").contains("button", "Compare prices").click();
    cy.contains("Select or enter the complete address before comparing prices").should("be.visible");
    cy.then(() => expect(requests).to.equal(0));
    cy.location("pathname").should("eq", "/");
    manualAddress("#compare-pickup-location-input", "Ikeja", "Opebi Road");
    cy.get(".landing-form").contains("button", "Compare prices").click();
    cy.location("pathname").should("eq", "/cost-calculator");
    cy.then(() => expect(requests).to.equal(1));
  });

  it("opens a published guide and returns to the comparison form through a CTA", () => {
    openHome();
    cy.get('body').type('{esc}');
    cy.get('.landing-modes').contains('button', 'Track a delivery').click();
    cy.get('.landing-final-cta').contains('button', 'Get a quote').click();
    cy.get('#compare-pickup-location-input').should('be.focused');
    cy.get('body').type('{esc}');
    cy.get('.landing-guide-card').first().click();
    cy.location('pathname').should('eq', '/blog/delivery-cost-nigeria');
    cy.get('main h1').should('be.visible');
  });

});
