import { Link } from "react-router-dom";
import { ArrowRight, Package, MapPin, Truck } from "lucide-react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import Calculator from "../CostCalculator/components/Calculator";
import ServicePageRoutesCard from "../components/seo/ServicePageRoutesCard";
import ServicePageFinalCta from "../components/seo/ServicePageFinalCta";
import "../landing.css";

const pricingFactors = [
  {
    icon: Package,
    title: "Package weight and size",
    body: "Heavier or bulkier parcels cost more to ship. Each courier sets its own weight bands, which is why comparing prices across providers saves money on almost every route.",
  },
  {
    icon: MapPin,
    title: "Pickup and delivery location",
    body: "Intra-city routes within Lagos are priced differently from inter-city routes like Lagos to Ibadan. Distance and traffic zones both affect the final price.",
  },
  {
    icon: Truck,
    title: "Courier type and delivery speed",
    body: "Same-day collection costs more than next-day. Premium couriers like DHL may charge more for international-grade handling; budget options are faster to book online.",
  },
];

export default function DeliveryPriceCalculator() {
  return (
    <Layout>
      <PageMeta
        title="Delivery Price Calculator Nigeria | Compare Courier Costs – GoSendeet"
        description="Use GoSendeet's free delivery price calculator to compare courier costs across Lagos and Nigeria. Get instant quotes from DHL, FedEx, GIG, FEZ and more — no account needed."
        path="/delivery-price-calculator"
      />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-white pt-12 pb-4 px-6 text-center" aria-labelledby="calculator-page-heading">
        <div className="max-w-3xl mx-auto">
          <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-5">
            Free delivery price calculator
          </p>
          <h1
            id="calculator-page-heading"
            className="font-extrabold text-4xl md:text-5xl text-blue100 tracking-tight leading-tight mb-5"
            style={{ letterSpacing: "-1.5px" }}
          >
            Delivery Price Calculator{" "}
            <span className="text-green800">in Nigeria</span>
          </h1>
          <p className="text-grey200 text-base md:text-lg leading-relaxed max-w-xl mx-auto">
            Enter your pickup address, destination and package details to compare live courier prices from DHL, FedEx, GIG, FEZ and more. No account needed to get a quote.
          </p>
        </div>
      </section>

      {/* ── Calculator ───────────────────────────────────────────────────── */}
      <div className="quote-page">
        <Calculator />
      </div>

      {/* ── How delivery pricing works ───────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="pricing-factors-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-4">
              How pricing works
            </p>
            <h2
              id="pricing-factors-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              What affects your delivery cost
            </h2>
            <p className="text-grey200 text-base mt-4 max-w-xl mx-auto leading-relaxed">
              Courier prices in Nigeria vary because of three main factors. Understanding them helps you pick the right option every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingFactors.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-[#F8FAFC] rounded-2xl border border-gray-100 p-6 flex flex-col gap-4"
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

      {/* ── Popular routes ───────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 md:py-20 px-6" aria-labelledby="routes-heading">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-5">
              Popular routes
            </p>
            <h2
              id="routes-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight leading-tight mb-5"
              style={{ letterSpacing: "-1px" }}
            >
              Delivery costs across Lagos and Ibadan
            </h2>
            <p className="text-grey200 text-base md:text-lg leading-relaxed mb-6">
              Click any route below to load it directly into the calculator above and get a live price comparison from all available couriers.
            </p>
            <Link
              to="/cost-calculator"
              className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-full hover:bg-green-900 transition-colors duration-200 text-sm"
            >
              Open full calculator
              <ArrowRight size={16} />
            </Link>
          </div>

          <ServicePageRoutesCard
            heading="Compare prices on these routes"
            subheading="Click a route to see live courier prices"
            ctaLabel="See all delivery prices"
            bg="bg-white"
          />
        </div>
      </section>

      {/* ── Explore more ─────────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-6" aria-label="Related pages">
        <div className="max-w-6xl mx-auto">
          <p className="font-bold text-blue100 text-sm mb-4">Explore more</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/delivery-service" className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Delivery Service</p>
                <p className="text-grey200 text-xs">Same day and next day delivery in Lagos</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link to="/courier-service" className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Courier Service</p>
                <p className="text-grey200 text-xs">Compare courier companies in Nigeria</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link to="/logistics" className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Logistics</p>
                <p className="text-grey200 text-xs">Logistics solutions for businesses</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      <ServicePageFinalCta
        heading="Ready to ship? Get your price now."
        body="Compare live courier prices for your route in seconds. No account needed, no hidden fees."
        ctaLabel="Calculate delivery cost"
      />
    </Layout>
  );
}
