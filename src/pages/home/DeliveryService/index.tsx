import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, GitCompare, MapPin, ShieldCheck, Clock } from "lucide-react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import ServicePageHero from "../components/seo/ServicePageHero";
import ServicePageCardsGrid from "../components/seo/ServicePageCardsGrid";
import ServicePageRoutesCard from "../components/seo/ServicePageRoutesCard";
import ServicePageFinalCta from "../components/seo/ServicePageFinalCta";

const services = [
  {
    icon: GitCompare,
    title: "Compare Delivery Prices",
    description:
      "See quotes from DHL, FedEx, FEZ, GIG, UPS and more in one search. Pick the price and speed that works for you no account required.",
  },
  {
    icon: MapPin,
    title: "Book a Courier Pickup",
    description:
      "Schedule a pickup at your door with our vetted GoSendeet franchise partners. Insured, tracked and handled with care from start to finish.",
  },
  {
    icon: ShieldCheck,
    title: "Track Every Delivery",
    description:
      "Follow your parcel in real time from pickup to doorstep. Get status updates at every stage so you always know where your package is.",
  },
  {
    icon: Clock,
    title: "Same-Day & Next-Day Options",
    description:
      "Need it there today? Book before 12 pm for same-day delivery on eligible routes. Next-day options are available across major cities.",
  },
];

const coveragePoints = [
  "Lagos intra-city deliveries across all zones including Ikeja, Lekki, VI, Yaba and more",
  "Ibadan direct courier routes to and from Lagos",
  "Compare multiple couriers for every route to find the best price and speed",
  "Same-day options available on eligible routes when you book before 12 pm",
];

const steps = [
  {
    number: "1",
    title: "Enter your route",
    text: "Type your pickup and drop-off address, then add your package details.",
  },
  {
    number: "2",
    title: "Compare & choose",
    text: "Review prices, delivery speeds and coverage from Nigeria's top couriers.",
  },
  {
    number: "3",
    title: "Book & track",
    text: "Confirm your booking in seconds and follow your parcel every step of the way.",
  },
];

export default function DeliveryService() {
  return (
    <Layout>
      <PageMeta
        title="Delivery Service in Nigeria | GoSendeet"
        description="Compare delivery prices from DHL, FedEx, GIG, FEZ and more. Book a courier pickup in Lagos, Ibadan and across Nigeria. Get a quote in seconds — no account needed."
        path="/delivery-service"
      />

      <ServicePageHero
        id="delivery-service-heading"
        pill="Delivery Service in Nigeria"
        h1="Delivery Service in"
        h1Accent="Lagos & Ibadan"
        subtitle="Compare courier prices, book a package delivery and track your parcel all in one place. Currently serving Lagos and Ibadan routes."
        primaryLabel="Get a free quote"
        secondaryLabel="Track a delivery"
      />

      <ServicePageCardsGrid
        id="services-heading"
        pill="What we offer"
        heading="Everything you need for package delivery in Nigeria"
        items={services}
      />

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="how-it-works-heading">
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
              Book a delivery in 3 steps
            </h2>
          </div>

          <ol className="flex flex-col md:flex-row gap-8 md:gap-6">
            {steps.map((step) => (
              <li key={step.number} className="flex-1 flex flex-col items-start gap-3">
                <span className="w-10 h-10 rounded-full bg-[#173c33] text-[#1fe99b] font-extrabold text-lg flex items-center justify-center shrink-0">
                  {step.number}
                </span>
                <h3 className="font-bold text-blue100 text-base">{step.title}</h3>
                <p className="text-grey200 text-sm leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <Link
              to="/cost-calculator"
              className="inline-flex items-center gap-2 bg-brand text-white font-bold px-7 py-4 rounded-full hover:bg-green-900 transition-colors duration-200"
            >
              Start now, it's free
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Coverage ──────────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 md:py-20 px-6" aria-labelledby="coverage-heading">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-5">
              Our coverage
            </p>
            <h2
              id="coverage-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight leading-tight mb-5"
              style={{ letterSpacing: "-1px" }}
            >
              Currently serving Lagos & Ibadan
            </h2>
            <p className="text-grey200 text-base md:text-lg leading-relaxed mb-8">
              We're starting with Lagos and Ibadan, covering intra-city routes
              within Lagos and inter-city routes between Lagos and Ibadan. More
              cities are on the way as we grow.
            </p>
            <ul className="flex flex-col gap-3">
              {coveragePoints.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="shrink-0 text-green800 mt-0.5" />
                  <span className="text-grey200 text-sm leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <ServicePageRoutesCard heading="Popular delivery routes" ctaLabel="Compare all routes" />
        </div>
      </section>

      <ServicePageFinalCta
        heading="Ready to send your parcel?"
        body="Compare courier prices for your route in seconds and book with confidence, no hidden fees, no guesswork."
      />
    </Layout>
  );
}
