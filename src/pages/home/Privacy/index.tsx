import { useState } from "react";
import Layout from "@/layouts/HomePageLayout";
import { Plus, Minus } from "lucide-react";

const Privacy = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Content extracted from Privacy component
  const sections = [
    {
      title: "Introduction",
      content: `At GoSendEet, we prioritize your trust by handling your personal information with the highest standards of care and transparency. Our goal is to deliver seamless parcel shipping solutions while safeguarding your privacy. This Privacy Policy outlines how we collect, use, store, share, and protect your data, the reasons behind these actions, and your rights under applicable laws.

We are committed to complying with the Nigeria Data Protection Regulation (NDPR) 2019 and other relevant data protection frameworks, ensuring your data is processed responsibly and securely.`,
    },
    {
      title: "Scope of this Privacy Policy",
      content: `This Privacy Policy covers all individuals interacting with our platform, website (gosendeet.vercel.app), mobile apps, or services worldwide, unless a separate policy applies to a specific feature or region.

It applies to:
• Senders: Individuals or businesses initiating shipments, including their staff.
• Recipients: Individuals receiving parcels.
• Users and Customers: Those inquiring about, booking, or paying for our services.
• Partners: Logistics carriers, vendors, or affiliates working with us, including their employees.
• Job Applicants: Candidates applying for roles at GoSendEet.

We refer to all these as "you" or "your" throughout this policy. Our practices align with local laws in the regions we operate, including Nigeria and any international jurisdictions where shipments occur. We only process data as permitted by these laws.`,
    },
    {
      title: "Changes to this Privacy Policy",
      content: `We may update this policy to reflect changes in our services, data handling practices, or legal requirements. Updates will be posted here with the new "Last Updated" date. We encourage you to review it regularly.`,
    },
    {
      title: "Who is Responsible",
      content: `GoSendEet acts as the data controller, deciding how and why your data is processed. For global operations, we may collaborate with affiliates, but GoSendEet Limited remains the primary controller.

If you have questions, contact our Data Protection Officer (DPO) at dpo@gosendeet.com.`,
    },
    {
      title: "Types of Data We Process",
      content: `We only collect data essential for our services or required by law. In Nigeria and other regions, additional data may be processed for compliance.

Contact Information: Details to reach you for bookings, updates, or support. Examples: Name, email, phone number, postal address.

Account and Authentication Data: Information for secure access to your profile. Examples: Username, password, security questions.

Shipment Details: Data needed to process, track, and deliver parcels. Examples: Origin/destination addresses, parcel weight/dimensions, contents description, tracking numbers.

Payment and Financial Information: Details for billing and transactions. Examples: Bank details, card information (processed securely via third-party gateways), transaction history.

Profile and Preference Data: Custom settings to enhance your experience. Examples: Delivery preferences, booking history, saved addresses.

Identification Verification Data: Proof to confirm identity for security or legal reasons. Examples: National ID, driver's license number (where required for high-value shipments).

Interaction and Feedback Data: Records from communications or surveys.

Technical and Usage Data: Automatically collected for site functionality. Examples: IP address, browser type, device info, cookies.

Employment Application Data: For recruitment purposes. Examples: CV, qualifications, references.`,
    },
    {
      title: "Why We Collect Your Data",
      content: `We process data only for defined purposes with a valid legal basis under NDPR and similar laws: performance of a contract, legal obligations, legitimate interests (balanced against your rights), or consent (which you can withdraw anytime).

The purposes include:
• Core Shipping Services: Comparing carrier rates, arranging pickups/deliveries, verifying shipment details, handling payments
• Customer Relationship Management: Personalizing your experience, sending updates, gathering feedback, onboarding users
• Partner and Operational Management: Collaborating with carriers, managing vendor contracts
• Recruitment: Processing job applications, maintaining talent pools
• Security and Compliance: Preventing fraud, ensuring data security, regulatory audits

We balance legitimate interests by assessing impacts on your privacy and only proceeding if benefits outweigh risks.`,
    },
    {
      title: "Website and App Usage",
      content: `When you visit our site or app, we log basic data (e.g., IP, visit duration) to maintain functionality and security. This is based on legitimate interest; data is deleted when no longer needed.`,
    },
    {
      title: "Parcel Verification",
      content: `We review shipment details to ensure accuracy, value, and legal compliance, preventing restricted items (e.g., hazardous goods). This protects our network and is a legitimate interest.`,
    },
    {
      title: "Undeliverable Parcels",
      content: `If delivery fails (e.g., invalid address), we may inspect packaging to find return details, based on contract performance.`,
    },
    {
      title: "Restricted Party Checks",
      content: `We screen against government lists for sanctioned entities to avoid illegal shipments. If flagged, we may request ID verification; you can object.`,
    },
    {
      title: "Feedback Collection",
      content: `We or partners may survey you to improve services, based on consent or legitimate interest.`,
    },
    {
      title: "Payment Processing",
      content: `We use secure gateways for transactions, complying with financial standards.`,
    },
    {
      title: "Cookies and Tracking",
      content: `Essential cookies enable core functions; others (e.g., analytics) require consent via our preference center.`,
    },
    {
      title: "Location Services",
      content: `With consent, we use geolocation for tracking or finding drop-off points.`,
    },
    {
      title: "How We Collect Your Data",
      content: `We gather data directly (e.g., when you book a shipment or create an account) or indirectly (e.g., from senders providing recipient details). Indirect providers must ensure accuracy and lawful transfer. For partners, data is collected as needed for contracts.`,
    },
    {
      title: "Information for Our Partners",
      content: `We process partner data to fulfill agreements, such as carrier integrations for rate comparisons. Sharing is limited to essentials, with safeguards under NDPR.`,
    },
    {
      title: "How Long We Keep Your Data",
      content: `Retention is minimized: Data is kept only as long as needed for purposes, contracts, or laws (e.g., up to 7 years for financial records under Nigerian tax laws). Shipment data may be retained for 3-5 years for disputes. Consent-based data is deleted upon withdrawal. We regularly review and delete unnecessary data.`,
    },
    {
      title: "How We Secure Your Data",
      content: `We employ advanced measures: encryption, firewalls, access controls, and regular audits aligned with ISO 27001 principles. Employee training and incident response plans minimize risks. Physical security protects our facilities.`,
    },
    {
      title: "Will Your Data Be Shared",
      content: `Sharing is limited to necessities, with safeguards:
• Affiliates: For internal operations.
• Carriers and Partners: To execute shipments (e.g., pickup/delivery).
• Service Providers: For IT, payments, or analytics (bound by contracts).
• Authorities: As required by law (e.g., customs).

International transfers (e.g., to England carriers) use NDPR-approved mechanisms like adequacy decisions or standard clauses.`,
    },
    {
      title: "We Respect Your Rights",
      content: `Under NDPR, you have rights (subject to conditions):
• Access: View your data and processing details.
• Rectification: Correct inaccuracies.
• Erasure: Delete data in certain cases.
• Restriction: Limit processing.
• Portability: Receive your data in a transferable format.
• Objection: Challenge legitimate interest processing.
• Withdraw Consent: Anytime, without affecting prior processing.
• Automated Decisions: Review any automated profiling (none currently with significant effects).

This policy ensures transparency — contact us at support@gosendeet.com for clarifications.`,
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Layout>
      {/* Banner Section */}
      <div className="bg-privacy relative overflow-hidden rounded-3xl md:mx-20 mx-6 my-8">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-green1000/95 via-green1000/90 to-transparent"></div> */}
        <div className="relative py-16 md:py-20 px-8 md:px-12 text-center">
          <h1 className="text-white font-extrabold text-4xl md:text-5xl mb-6">
            Privacy Policy
          </h1>
          <div className="bg-white inline-block px-4 py-2 rounded-lg">
            <p className="text-grey300 text-sm font-semibold">
              Last updated Dec 20, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto lg:px-30 md:px-20 px-6 py-12 md:py-20">
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="border-b border-grey200 overflow-hidden"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full flex items-center justify-between py-6 px-6 hover:bg-grey50 transition-colors text-left"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex-shrink-0">
                    {openIndex === index ? (
                      <Minus className="text-red-500" size={24} />
                    ) : (
                      <Plus className="text-green500" size={24} />
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-blue100">
                    {section.title}
                  </h3>
                </div>
              </button>

              {/* Accordion Content */}
              {openIndex === index && (
                <div className="px-6 pb-6 text-grey300 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
