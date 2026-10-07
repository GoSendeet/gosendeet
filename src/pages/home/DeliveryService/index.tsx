import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, GitCompare, MapPin, ShieldCheck, Clock } from "lucide-react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";

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

const routes = [
  { label: "Lagos to Ibadan", pickup: "Lagos", destination: "Ibadan" },
  { label: "Ibadan to Lagos", pickup: "Ibadan", destination: "Lagos" },
  { label: "Ikeja to Lekki", pickup: "Ikeja", destination: "Lekki" },
  { label: "Yaba to Victoria Island", pickup: "Yaba", destination: "Victoria Island" },
  { label: "Lekki to Ikeja", pickup: "Lekki", destination: "Ikeja" },
  { label: "Victoria Island to Yaba", pickup: "Victoria Island", destination: "Yaba" },
];

const coveragePoints = [
  "Lagos intra-city deliveries across all zones including Ikeja, Lekki, VI, Yaba and more",
  "Ibadan direct courier routes to and from Lagos",
  "Compare multiple couriers for every route to find the best price and speed",
  "Sameday options available on eligible routes when you book before 12 pm",
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

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section
        className="bg-[#173c33] text-white py-20 md:py-28 px-6"
        aria-labelledby="delivery-service-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="inline-block bg-white/10 text-[#1fe99b] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
            Delivery Service in Nigeria
          </p>
          <h1
            id="delivery-service-heading"
            className="font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6"
            style={{ letterSpacing: "-2px" }}
          >
            Delivery Service in<br className="hidden sm:block" />{" "}
            <span className="text-[#1fe99b]">Lagos & Ibadan</span>
          </h1>
          <p className="text-[#eef4f1] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Compare courier prices, book a package delivery and track your parcel
            all in one place. Currently serving Lagos and Ibadan routes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cost-calculator"
              className="inline-flex items-center justify-center gap-2 bg-[#1fe99b] text-[#0a2a1e] font-bold px-7 py-4 rounded-full hover:bg-[#17d48a] transition-colors duration-200 text-base"
            >
              Get a free quote
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/track"
              className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-7 py-4 rounded-full hover:bg-white/20 transition-colors duration-200 text-base border border-white/20"
            >
              Track a delivery
            </Link>
          </div>
        </div>
      </section>

      {/* ── Services ──────────────────────────────────────────────────────── */}
      <section
        className="bg-[#F8FAFC] py-16 md:py-20 px-6"
        aria-labelledby="services-heading"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-4">
              What we offer
            </p>
            <h2
              id="services-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              Everything you need for package delivery in Nigeria
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
              >
                <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-green-100 text-green800">
                  <Icon size={22} />
                </span>
                <h3 className="font-bold text-blue100 text-base leading-snug">{title}</h3>
                <p className="text-grey200 text-sm leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────── */}
      <section
        className="bg-white py-16 md:py-20 px-6"
        aria-labelledby="how-it-works-heading"
      >
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
      <section
        className="bg-[#F8FAFC] py-16 md:py-20 px-6"
        aria-labelledby="coverage-heading"
      >
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
              We're starting with Lagos and Ibadan covering intra-city routes
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

          <div className="bg-white rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm">
            <p className="font-bold text-blue100 text-base mb-5">Popular delivery routes</p>
            <div className="flex flex-col divide-y divide-gray-100">
              {routes.map((route) => (
                <Link
                  key={route.label}
                  to="/cost-calculator"
                  state={{ mode: "compare", routePreset: { pickup: route.pickup, destination: route.destination } }}
                  className="flex items-center justify-between py-3.5 group"
                >
                  <span className="text-sm text-blue100 font-medium group-hover:text-green800 transition-colors">
                    {route.label}
                  </span>
                  <ArrowRight size={15} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
            <Link
              to="/cost-calculator"
              className="mt-6 flex items-center justify-center gap-2 w-full bg-brand text-white font-bold py-3 rounded-full hover:bg-green-900 transition-colors duration-200 text-sm"
            >
              Compare all routes
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────── */}
      <section className="bg-[#173c33] text-white py-16 md:py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2
            className="font-extrabold text-3xl md:text-4xl tracking-tight mb-5"
            style={{ letterSpacing: "-1px" }}
          >
            Ready to send your parcel?
          </h2>
          <p className="text-[#eef4f1] text-lg leading-relaxed mb-8">
            Compare courier prices for your route in seconds and book with
            confidence, no hidden fees, no guesswork.
          </p>
          <Link
            to="/cost-calculator"
            className="inline-flex items-center gap-2 bg-[#1fe99b] text-[#0a2a1e] font-bold px-7 py-4 rounded-full hover:bg-[#17d48a] transition-colors duration-200"
          >
            Get a free quote
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
