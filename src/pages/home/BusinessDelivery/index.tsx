import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, Package, Activity, Shield, CheckCircle2, Briefcase, Store, Building2, Users } from "lucide-react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import ServicePageHero from "../components/seo/ServicePageHero";
import ServicePageCardsGrid from "../components/seo/ServicePageCardsGrid";
import ServicePageRoutesCard from "../components/seo/ServicePageRoutesCard";
import ServicePageFinalCta from "../components/seo/ServicePageFinalCta";

const benefits = [
  {
    icon: BarChart2,
    title: "Compare Courier Costs",
    description:
      "See prices from DHL, FedEx, GIG, FEZ and more side by side. Always pick the best rate for each delivery without calling around.",
  },
  {
    icon: Package,
    title: "Schedule Pickups",
    description:
      "Book doorstep pickups for your business location. Our verified franchise partners collect and hand over to your chosen courier.",
  },
  {
    icon: Activity,
    title: "Track Every Shipment",
    description:
      "Monitor all your business deliveries from one dashboard. Share live tracking links with clients so they always know where their order is.",
  },
  {
    icon: Shield,
    title: "Vetted Courier Partners",
    description:
      "Every courier on GoSendeet is screened before listing. Your goods and your clients get consistent, reliable service.",
  },
];

const useCases = [
  {
    icon: Store,
    title: "Retail Shops",
    body: "Fulfil customer orders and manage stock transfers between locations without negotiating courier rates every time.",
  },
  {
    icon: Briefcase,
    title: "Professional Services",
    body: "Send documents, samples and equipment to clients across Lagos and Ibadan at transparent, predictable costs.",
  },
  {
    icon: Building2,
    title: "Corporate Procurement",
    body: "Centralise all courier bookings for your team. No more petty cash receipts — every delivery is logged and traceable.",
  },
  {
    icon: Users,
    title: "Sales Teams",
    body: "Dispatch product demos, contracts and gifts to prospects on the same day. Book in seconds from any device.",
  },
];

const whyPoints = [
  "One platform for all your business deliveries",
  "No subscription fee and no account needed to get a quote",
  "Transparent pricing with no surprise charges",
  "Screened courier partners on every route",
  "Share live tracking links directly with your clients",
  "Same day options available on eligible Lagos routes",
];

export default function BusinessDelivery() {
  return (
    <Layout>
      <PageMeta
        title="Business Delivery in Lagos & Nigeria | GoSendeet"
        description="Reliable business delivery in Lagos and Ibadan. Compare courier prices from DHL, FedEx, GIG, FEZ and more, book pickups and track all your business shipments in one place."
        path="/business-delivery"
      />

      <ServicePageHero
        id="business-delivery-heading"
        pill="Business Delivery Lagos & Nigeria"
        h1="Business Delivery in"
        h1Accent="Lagos & Ibadan"
        subtitle="GoSendeet helps businesses compare courier prices, schedule pickups and track every delivery from one place. No contracts, no setup fees."
        primaryLabel="Get a business quote"
        secondaryLabel="Track a shipment"
      />

      <ServicePageCardsGrid
        id="benefits-heading"
        pill="What we offer"
        heading="Everything your business needs to ship"
        items={benefits}
      />

      {/* ── Why GoSendeet for business ─────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="why-business-heading">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-5">
              Why businesses choose GoSendeet
            </p>
            <h2
              id="why-business-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight leading-tight mb-5"
              style={{ letterSpacing: "-1px" }}
            >
              Cut delivery costs without cutting corners
            </h2>
            <p className="text-grey200 text-base md:text-lg leading-relaxed mb-8">
              Most businesses in Lagos overpay for deliveries because they stick
              with one courier. GoSendeet shows you every option on a single
              screen so you can make a smarter choice every time.
            </p>
            <ul className="flex flex-col gap-3">
              {whyPoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-green800 mt-0.5" />
                  <span className="text-grey200 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <ServicePageRoutesCard
            heading="Business routes we cover"
            subheading="Click a route to compare courier prices"
            bg="bg-[#F8FAFC]"
          />
        </div>
      </section>

      {/* ── Use cases ─────────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 md:py-20 px-6" aria-labelledby="use-cases-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-4">
              Business types
            </p>
            <h2
              id="use-cases-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              Built for businesses that ship regularly
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-green-100 text-green800">
                  <Icon size={22} />
                </span>
                <h3 className="font-bold text-blue100 text-base leading-snug">{title}</h3>
                <p className="text-grey200 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Explore more ──────────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-6" aria-label="Related pages">
        <div className="max-w-6xl mx-auto">
          <p className="font-bold text-blue100 text-sm mb-4">Explore more</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/delivery-service" className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Delivery Service</p>
                <p className="text-grey200 text-xs">Same day and next day options</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link to="/logistics" className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Logistics</p>
                <p className="text-grey200 text-xs">Full logistics solutions for businesses</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link to="/cost-calculator" className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Price Calculator</p>
                <p className="text-grey200 text-xs">Get an instant quote for your route</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      <ServicePageFinalCta
        heading="Ship smarter for your business"
        body="Compare courier prices for your Lagos and Ibadan routes in seconds. No account needed, no hidden fees."
        ctaLabel="Get a business quote"
      />
    </Layout>
  );
}
