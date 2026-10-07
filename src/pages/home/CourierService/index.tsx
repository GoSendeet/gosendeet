import { CheckCircle2, Package, Store, ShoppingBag, Users } from "lucide-react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import ServicePageHero from "../components/seo/ServicePageHero";
import ServicePageCardsGrid from "../components/seo/ServicePageCardsGrid";
import ServicePageRoutesCard from "../components/seo/ServicePageRoutesCard";
import ServicePageFinalCta from "../components/seo/ServicePageFinalCta";

const useCases = [
  {
    icon: ShoppingBag,
    title: "Online sellers",
    description:
      "Running a business on Instagram or WhatsApp? Compare courier prices for every order and book pickups without leaving your phone.",
  },
  {
    icon: Store,
    title: "Small businesses",
    description:
      "Manage multiple deliveries from one dashboard. Track all your orders in one place and share live updates with your customers.",
  },
  {
    icon: Package,
    title: "One-off senders",
    description:
      "Need to send a parcel to family or a client? Get a quote in seconds, no account needed, no commitment.",
  },
  {
    icon: Users,
    title: "Procurement teams",
    description:
      "Procure courier services for your organisation at transparent prices. Compare, book and keep a full record of every shipment.",
  },
];

const whyPoints = [
  "Compare multiple courier companies side by side on one screen",
  "No hidden fees the price you see is the price you pay",
  "Book a pickup or drop-off in under 5 minutes",
  "Real-time tracking from collection to delivery",
  "Verified couriers only every partner is screened before listing",
];

export default function CourierService() {
  return (
    <Layout>
      <PageMeta
        title="Courier Service in Lagos & Nigeria | GoSendeet"
        description="Find and book a courier service in Lagos and Ibadan. Compare prices from DHL, FedEx, GIG, FEZ and more. Get a quote in seconds — no account needed."
        path="/courier-service"
      />

      <ServicePageHero
        id="courier-service-heading"
        pill="Courier Service Lagos & Nigeria"
        h1="Courier Service in"
        h1Accent="Lagos & Ibadan"
        subtitle="GoSendeet lets you compare courier companies, book a pickup and track your parcel, all in one place. No phone calls, no guesswork."
        primaryLabel="Compare couriers now"
        secondaryLabel="Track a parcel"
      />

      {/* ── Why GoSendeet ─────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="why-heading">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-5">
              Why GoSendeet
            </p>
            <h2
              id="why-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight leading-tight mb-5"
              style={{ letterSpacing: "-1px" }}
            >
              One search. Every courier company in Lagos.
            </h2>
            <p className="text-grey200 text-base md:text-lg leading-relaxed mb-8">
              Instead of calling each courier company individually, GoSendeet
              shows you all your options in one search prices, delivery speeds
              and coverage, so you can pick the right one for every shipment.
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
            heading="Popular courier routes"
            subheading="Click a route to see courier prices"
            bg="bg-[#F8FAFC]"
          />
        </div>
      </section>

      <ServicePageCardsGrid
        id="use-cases-heading"
        pill="Who uses GoSendeet"
        heading="Built for anyone who sends parcels"
        items={useCases}
      />

      {/* ── Coverage ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="coverage-heading">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-5">
            Coverage
          </p>
          <h2
            id="coverage-heading"
            className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight mb-5"
            style={{ letterSpacing: "-1px" }}
          >
            Currently serving Lagos & Ibadan
          </h2>
          <p className="text-grey200 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            We cover intra-city courier deliveries within Lagos and inter-city
            routes between Lagos and Ibadan. We're growing and more cities are
            coming soon.
          </p>
        </div>
      </section>

      <ServicePageFinalCta
        heading="Find a courier for your next delivery"
        body="Compare prices from Nigeria's top courier companies in seconds. No account needed to get a quote."
      />
    </Layout>
  );
}
