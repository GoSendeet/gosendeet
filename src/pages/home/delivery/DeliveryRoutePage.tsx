import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import ServicePageFinalCta from "../components/seo/ServicePageFinalCta";
import { RoutePageConfig } from "./routeConfig";

const HOW_TO_STEPS = [
  {
    number: "1",
    title: "Enter your route",
    text: "Type your pickup address and destination. Our calculator shows live prices from all couriers on that route.",
  },
  {
    number: "2",
    title: "Pick your courier",
    text: "Compare prices, delivery speeds and ratings side by side. No need to call anyone — book directly on GoSendeet.",
  },
  {
    number: "3",
    title: "We arrange collection",
    text: "A verified franchise partner collects your parcel and hands it to your chosen courier at the scheduled time.",
  },
];

interface DeliveryRoutePageProps {
  config: RoutePageConfig;
}

export default function DeliveryRoutePage({ config }: DeliveryRoutePageProps) {
  const calculatorState = {
    mode: "compare",
    routePreset: {
      pickup: config.pickupPreset,
      destination: config.destinationPreset,
    },
  };

  return (
    <Layout>
      <PageMeta
        title={config.title}
        description={config.description}
        path={`/delivery/${config.slug}`}
      />

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section
        className="bg-[#0a2a1e] text-white py-16 md:py-24 px-6"
        aria-labelledby="route-page-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="inline-block bg-[#1fe99b]/15 text-[#1fe99b] px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-6">
            {config.pill}
          </p>

          <h1
            id="route-page-heading"
            className="font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6"
            style={{ letterSpacing: "-2px" }}
          >
            {config.h1}{" "}
            <span className="text-[#1fe99b]">{config.h1Accent}</span>
          </h1>

          <p className="text-white/70 text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-10">
            {config.subtitle}
          </p>

          {/* Route visual */}
          <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 rounded-2xl px-6 py-4 mb-10">
            <span className="font-bold text-white text-base">{config.from}</span>
            <span className="flex items-center gap-1 text-[#1fe99b]">
              <span className="w-8 h-px bg-[#1fe99b]/60" />
              <ArrowRight size={16} />
            </span>
            <span className="font-bold text-white text-base">{config.to}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/cost-calculator"
              state={calculatorState}
              className="inline-flex items-center justify-center gap-2 bg-[#1fe99b] text-[#0a2a1e] font-extrabold px-8 py-4 rounded-full hover:bg-white transition-colors duration-200 text-sm"
            >
              Get a quote for this route
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/delivery-price-calculator"
              className="inline-flex items-center justify-center gap-2 border border-white/30 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-colors duration-200 text-sm"
            >
              See all delivery prices
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats strip ────────────────────────────────────────────────── */}
      <section className="bg-[#173c33] py-8 px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-3 gap-4 text-center">
          {config.stats.map(({ label, value }) => (
            <div key={label} className="flex flex-col gap-1">
              <span className="font-extrabold text-2xl md:text-3xl text-[#1fe99b]">
                {value}
              </span>
              <span className="text-white/60 text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── About this route ───────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="about-route-heading">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-start">
          <div>
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-5">
              About this route
            </p>
            <h2
              id="about-route-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight leading-tight mb-5"
              style={{ letterSpacing: "-1px" }}
            >
              Reliable delivery from {config.from} to {config.to}
            </h2>
            <p className="text-grey200 text-base leading-relaxed mb-8">
              {config.about}
            </p>
            <Link
              to="/cost-calculator"
              state={calculatorState}
              className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-full hover:bg-green-900 transition-colors duration-200 text-sm"
            >
              Compare prices now
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="bg-[#F8FAFC] rounded-2xl border border-gray-100 p-6">
            <p className="font-bold text-blue100 text-base mb-5">Common use cases</p>
            <ul className="flex flex-col gap-3">
              {config.useCases.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-green800 mt-0.5" />
                  <span className="text-grey200 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── How to book ────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 md:py-20 px-6" aria-labelledby="how-to-book-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-4">
              How it works
            </p>
            <h2
              id="how-to-book-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              Book your {config.from} to {config.to} delivery
            </h2>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute top-5 left-[calc(12.5%-1px)] right-[calc(12.5%-1px)] h-px bg-gray-200 z-0" />
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {HOW_TO_STEPS.map((step) => (
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
              state={calculatorState}
              className="inline-flex items-center gap-2 bg-brand text-white font-bold px-7 py-4 rounded-full hover:bg-green-900 transition-colors duration-200"
            >
              Get a quote for this route
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Explore more ───────────────────────────────────────────────── */}
      <section className="bg-white py-12 px-6" aria-label="Related pages">
        <div className="max-w-6xl mx-auto">
          <p className="font-bold text-blue100 text-sm mb-4">Explore more</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/delivery-price-calculator"
              className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Price Calculator</p>
                <p className="text-grey200 text-xs">Compare courier costs for any route</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link
              to="/delivery-service"
              className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Delivery Service</p>
                <p className="text-grey200 text-xs">Same day and next day delivery</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link
              to="/courier-service"
              className="group bg-[#F8FAFC] rounded-2xl border border-gray-100 p-5 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <p className="font-bold text-blue100 text-sm mb-0.5">Courier Service</p>
                <p className="text-grey200 text-xs">All courier companies in Nigeria</p>
              </div>
              <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      <ServicePageFinalCta
        heading={`Ready to send from ${config.from} to ${config.to}?`}
        body="Compare live courier prices and book a pickup in minutes. No account needed, no hidden fees."
        ctaLabel="Get a quote"
      />
    </Layout>
  );
}
