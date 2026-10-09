import { Link } from "react-router-dom";
import { ArrowRight, Zap, MapPin, Bell, ShieldCheck, ShoppingBag, Instagram, MessageCircle, Globe } from "lucide-react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import ServicePageHero from "../components/seo/ServicePageHero";
import ServicePageCardsGrid from "../components/seo/ServicePageCardsGrid";
import ServicePageRoutesCard from "../components/seo/ServicePageRoutesCard";
import ServicePageFinalCta from "../components/seo/ServicePageFinalCta";

const features = [
  {
    icon: Zap,
    title: "Dispatch Orders Fast",
    description:
      "Book a courier pickup in under 2 minutes. Enter the route, pick a price and schedule collection — no calls, no waiting.",
  },
  {
    icon: Bell,
    title: "Keep Customers Updated",
    description:
      "Share a live tracking link with every buyer after dispatch. Fewer \"where is my order\" messages, happier customers.",
  },
  {
    icon: ShieldCheck,
    title: "Verified Couriers Only",
    description:
      "Every courier on GoSendeet is screened and rated. Your customers receive their orders from partners you can trust.",
  },
  {
    icon: MapPin,
    title: "Lagos and Ibadan Coverage",
    description:
      "Intra-city deliveries across all Lagos zones and inter-city routes to Ibadan. More cities are on the way.",
  },
];

const channels = [
  {
    icon: Instagram,
    label: "Instagram Stores",
    body: "Selling on Instagram? Book a pickup from your phone the moment an order comes in.",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp Sellers",
    body: "Running a WhatsApp business? Dispatch orders without switching apps or calling couriers.",
  },
  {
    icon: Globe,
    label: "Online Stores",
    body: "Shopify, Flutterwave storefront or your own website — GoSendeet handles last mile delivery.",
  },
  {
    icon: ShoppingBag,
    label: "Market Traders",
    body: "Sell at Balogun, Computer Village or any Lagos market and deliver to customers the same day.",
  },
];

const steps = [
  {
    number: "1",
    title: "Order comes in",
    text: "A buyer places an order on your store, WhatsApp or Instagram page.",
  },
  {
    number: "2",
    title: "Compare and book",
    text: "Open GoSendeet, enter the route and pick the courier that fits your timing and budget.",
  },
  {
    number: "3",
    title: "Courier collects",
    text: "Your chosen courier picks up the parcel from your location at the scheduled time.",
  },
  {
    number: "4",
    title: "Customer gets it",
    text: "Your buyer receives the parcel and tracks its progress with the link you share.",
  },
];

export default function EcommerceDelivery() {
  return (
    <Layout>
      <PageMeta
        title="E-commerce Delivery in Nigeria | GoSendeet"
        description="Fast e-commerce delivery for online sellers in Lagos and Ibadan. Compare courier prices, dispatch orders the same day and keep your customers updated with live tracking."
        path="/ecommerce-delivery"
      />

      <ServicePageHero
        id="ecommerce-delivery-heading"
        pill="E-commerce Delivery Nigeria"
        h1="E-commerce Delivery for"
        h1Accent="Online Sellers"
        subtitle="Compare courier prices, book same day pickups and send your buyers a live tracking link — all from one place. No account needed to get started."
        primaryLabel="Dispatch your first order"
        secondaryLabel="See delivery prices"
        secondaryTo="/cost-calculator"
      />

      {/* ── Order flow ────────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 md:py-20 px-6" aria-labelledby="how-it-works-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-4">
              How it works
            </p>
            <h2
              id="how-it-works-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              From order received to door delivered
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-5 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-px bg-gray-200 z-0" />
            <ol className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
              {steps.map((step) => (
                <li key={step.number} className="flex flex-col items-center text-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-[#173c33] text-[#1fe99b] font-extrabold text-base flex items-center justify-center shrink-0 ring-4 ring-[#F8FAFC]">
                    {step.number}
                  </span>
                  <h3 className="font-bold text-blue100 text-sm">{step.title}</h3>
                  <p className="text-grey200 text-sm leading-relaxed">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/cost-calculator"
              className="inline-flex items-center gap-2 bg-brand text-white font-bold px-7 py-4 rounded-full hover:bg-green-900 transition-colors duration-200"
            >
              Compare prices now
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <ServicePageCardsGrid
        id="features-heading"
        pill="Built for sellers"
        heading="Everything an online seller needs to ship"
        items={features}
      />

      {/* ── Selling channels ──────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="channels-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-4">
              Works with how you sell
            </p>
            <h2
              id="channels-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              No matter where your store lives
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {channels.map(({ icon: Icon, label, body }) => (
              <div
                key={label}
                className="rounded-2xl bg-[#F8FAFC] border border-gray-100 p-6 flex flex-col gap-4"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-green-100 text-green800">
                  <Icon size={22} />
                </span>
                <h3 className="font-bold text-blue100 text-base leading-snug">{label}</h3>
                <p className="text-grey200 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Routes ────────────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 md:py-20 px-6" aria-labelledby="routes-heading">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-5">
              Delivery routes
            </p>
            <h2
              id="routes-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight leading-tight mb-5"
              style={{ letterSpacing: "-1px" }}
            >
              Delivering across Lagos and Ibadan
            </h2>
            <p className="text-grey200 text-base md:text-lg leading-relaxed mb-6">
              We cover all major zones within Lagos and routes between Lagos and
              Ibadan. Click any route below to see live courier prices for your
              next order.
            </p>
            <Link
              to="/cost-calculator"
              className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-full hover:bg-green-900 transition-colors duration-200 text-sm"
            >
              See all prices
              <ArrowRight size={16} />
            </Link>
          </div>

          <ServicePageRoutesCard
            heading="Popular e-commerce routes"
            subheading="Click a route to compare courier prices"
            ctaLabel="See all courier prices"
            bg="bg-white"
          />
        </div>
      </section>

      {/* ── Explore more ──────────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-6" aria-label="Related pages">
        <div className="max-w-6xl mx-auto">
          <p className="font-bold text-blue100 text-sm mb-4">Explore more</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link to="/courier-service" className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Courier Service</p>
                <p className="text-grey200 text-xs">Compare courier companies in Lagos</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link to="/business-delivery" className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Business Delivery</p>
                <p className="text-grey200 text-xs">Delivery solutions for companies</p>
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
        heading="Ready to dispatch your next order?"
        body="Compare courier prices for your route in seconds. No account needed, no hidden fees."
        ctaLabel="Dispatch an order"
      />
    </Layout>
  );
}
