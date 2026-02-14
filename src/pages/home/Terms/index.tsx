import { useState } from "react";
import Layout from "@/layouts/HomePageLayout";
import { Plus, Minus } from "lucide-react";

const Terms = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Content extracted from TermsConditions component
  const sections = [
    {
      title: "1. Introduction and Acceptance of Terms",
      content: `Welcome to GoSendEet (the "Platform" or "Website" at gosendeet.vercel.app), operated by [GoSendEet] Limited**, "we", "us", "our", or "GoSendEet").

These Terms of Service ("Terms") govern your access to and use of our website, mobile applications (if any), and all associated services (collectively, the "Services"). The Services include parcel shipping comparison tools, direct booking options, rate comparisons from multiple carriers, scheduling of pickups, label generation, payment processing, and real-time tracking.

By accessing, browsing, or using the Services (including obtaining quotes or booking shipments), you acknowledge that you have read, understood, and agree to be bound by these Terms, our Privacy Policy, and any additional guidelines or rules applicable to specific features. If you do not agree, you must not use the Services.

We reserve the right to update these Terms at any time. Changes will be posted on the Website with the updated "Last Updated" date. Your continued use of the Services after changes constitutes acceptance of the revised Terms.`,
    },
    {
      title: "2. Description of Services",
      content: `GoSendEet acts as an intermediary platform connecting users with third-party carriers for parcel shipping within Nigeria and globally.

Compare Mode: We provide real-time quotes and comparisons from over 50 partnered carriers based on your provided shipment details (origin, destination, weight, dimensions, etc.).

Direct Mode: We offer our branded shipping service for simplified, doorstep-to-doorstep delivery.

Additional value added services and features include but are not limited to optional insurance, flexible pickup/drop-off scheduling, secure payments, label generation, and live GPS tracking with notifications.

We do not physically handle, transport, or store parcels. The contract of carriage is formed directly between you and the selected carrier (or us in Direct Mode where applicable).`,
    },
    {
      title: "3. Eligibility and Account Registration",
      content: `You must be at least 18 years old and capable of forming a binding contract to use the Services. By registering, you represent and warrant that you meet these requirements.

To access certain features (e.g., booking, tracking history), you must create an account with accurate information. You are responsible for maintaining the security of your account credentials and for all activities occurring under your account. Notify us immediately at support@gosendeet.com of any unauthorized use or issues you may have with your account as soon as possible. Our team will respond as soon as possible to understand the situation and advise you the most feasible SLA timeline for resolution.`,
    },
    {
      title: "4. User Obligations and Responsibilities",
      content: `You agree to:
• Provide accurate, complete, and up-to-date information for all shipments (e.g., addresses, parcel weight/dimensions, contents description, value).
• Package parcels securely in accordance with carrier guidelines and our Packaging Advice (available during booking).
• Ensure parcels comply with all applicable laws, including customs declarations if required.
• Print and correctly attach shipping labels (or use label-free options where offered).
• Be present (or arrange for someone) at pickup addresses during scheduled times, or use drop-off points.
• Inform recipients of relevant customs duties, charges or taxes where and when applicable.

You are solely responsible for the contents of your parcels, proper packaging, and any consequences of inaccuracies or non-compliance. Gosendeet reserves the right to escalate any suspicious dealings to relevant law enforcements and regulatory authorities.`,
    },
    {
      title: "5. Regulatory Matters",
      content: `All parcels received by GoSendEet are subject to being opened for controlled inspection as they make their way to you in and out of Nigeria. Edible items, furniture and other goods imported or exported may attract additional government levies including NAFDAC and Customs charges. Importation of items containing lithium batteries for instance will attract additional charges as they need to be handled as dangerous goods.`,
    },
    {
      title: "6. Prohibited and Restricted Items",
      content: `We and our carriers prohibit or restrict certain items for safety, legal, or operational reasons. Prohibited items include (but are not limited to):
• Dangerous goods (e.g., explosives, flammables, radioactive materials)
• Illegal substances, weapons, or counterfeit goods
• Live animals, human remains, or perishables
• High-value items exceeding carrier limits without declaration`,
    },
    {
      title: "7. Pricing, Payments, and Additional Charges",
      content: `The Platform is free to use; you pay only the selected shipping rate (plus any optional extras like insurance).

Quotes are based on your provided details and are subject to verification.

Payments are processed securely via third-party providers (e.g., Stripe or similar). We do not store full card details.

Additional charges may apply from carriers for discrepancies (e.g., overweight/oversize parcels, incorrect addresses, failed collections, remote area surcharges). These will be billed to your payment method.

All prices include VAT where applicable.`,
    },
    {
      title: "8. Insurance, Claims, and Liability",
      content: `Insurance coverage and claims procedures are subject to the selected carrier's terms and conditions. Additional optional insurance may be purchased during checkout. Please review carrier-specific liability limits before booking.`,
    },
    {
      title: "9. Intellectual Property and Website Use",
      content: `All content, logos, software, and designs on the Platform are owned by us or our licensors. You may not copy, modify, distribute, or reverse-engineer without permission from an authorised signatory of the company.`,
    },
    {
      title: "10. Termination and Suspension",
      content: `We may suspend or terminate your access for breaches of these Terms, suspected fraud, or non-payment of charges at any time without any due notice.`,
    },
    {
      title: "11. Governing Law and Dispute Resolution",
      content: `These Terms of Service and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with them, their subject matter, or formation shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.

You irrevocably agree that the courts of Lagos State, Nigeria shall have exclusive jurisdiction to settle any dispute or claim arising out of or in connection with these Terms or the Services. For our sole benefit, nothing in this clause shall limit our right to initiate proceedings against you in any other court of competent jurisdiction (including the courts where you are domiciled or where any assets are located), nor shall the commencement of proceedings in one jurisdiction preclude us from commencing proceedings in any other jurisdiction, whether concurrently or not, to the extent permitted by the law of such jurisdiction.`,
    },
    {
      title: "12. Miscellaneous",
      content: `Force Majeure: We are not liable for failures due to events beyond our control.

Severability: If any provision is invalid, the remainder remains in effect.

Contact: For questions, email support@gosendeet.com`,
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Layout>
      {/* Banner Section */}
      <div className="bg-terms relative overflow-hidden rounded-3xl md:mx-20 mx-6 my-8">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-green1000/95 via-green1000/90 to-transparent"></div> */}
        <div className="relative py-16 md:py-20 px-8 md:px-12 text-center">
          <h1 className="text-white font-extrabold text-4xl md:text-5xl mb-6">
            Terms of Service
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

export default Terms;
