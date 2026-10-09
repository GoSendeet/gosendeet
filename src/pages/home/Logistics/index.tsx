import { Link } from "react-router-dom";
import { ArrowRight, BarChart2, MapPin, Zap, Shield, Clock, Store, ShoppingBag, Building2, Truck, CheckCircle2, Activity } from "lucide-react";
import type { LucideProps } from "lucide-react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import ServicePageRoutesCard from "../components/seo/ServicePageRoutesCard";
import ServicePageFinalCta from "../components/seo/ServicePageFinalCta";

const stats: { icon: React.ComponentType<LucideProps>; value: string; label: string }[] = [
  { icon: Truck, value: "6+", label: "Courier Partners" },
  { icon: MapPin, value: "2", label: "Cities Covered" },
  { icon: Shield, value: "₦0", label: "Hidden Fees" },
  { icon: Activity, value: "24/7", label: "Live Tracking" },
];

const useCases = [
  {
    icon: ShoppingBag,
    title: "Online Sellers",
    body: "Running a store on Instagram, WhatsApp or Shopify? Stop calling couriers one by one. Compare, book and track all your orders from one place.",
    bg: "#1fe99b",
    color: "#0a2a1e",
  },
  {
    icon: Store,
    title: "Retail Businesses",
    body: "Send stock to your branches, fulfil customer orders and manage returns. GoSendeet gives you one dashboard for every shipment.",
    bg: "#173c33",
    color: "#ffffff",
  },
  {
    icon: Building2,
    title: "Corporate Teams",
    body: "Procure logistics at transparent rates with a full audit trail. No more petty cash receipts for courier runs.",
    bg: "#0a2a1e",
    color: "#1fe99b",
  },
  {
    icon: Truck,
    title: "Logistics Resellers",
    body: "Partner with GoSendeet to offer courier services to your own customers and earn on every booking you refer.",
    bg: "#e8f5f0",
    color: "#173c33",
  },
];

const coveragePoints = [
  "Intra city deliveries within Lagos across all major zones",
  "Inter city routes between Lagos and Ibadan",
  "Multiple courier options on every route so you always get the best price",
  "Same day delivery on eligible routes when you book before 12pm",
];

export default function LogisticsService() {
  return (
    <Layout>
      <PageMeta
        title="Logistics Company in Lagos & Nigeria | GoSendeet"
        description="GoSendeet is a logistics platform in Lagos and Nigeria. Compare prices from DHL, FedEx, GIG, FEZ and more, book a courier pickup and track your parcel in real time."
        path="/logistics"
      />

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-[#0a2a1e] text-white pt-20 pb-0 px-6 overflow-hidden" aria-labelledby="logistics-heading">
        <div className="max-w-6xl mx-auto">
          <p className="inline-block bg-white/10 text-[#1fe99b] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-8">
            Logistics Company Lagos &amp; Nigeria
          </p>
          <h1
            id="logistics-heading"
            className="font-extrabold text-5xl md:text-7xl lg:text-8xl tracking-tight leading-none mb-8"
            style={{ letterSpacing: "-3px" }}
          >
            Smarter logistics
            <br />
            for{" "}
            <span className="text-[#1fe99b]">every business</span>
            <br />
            in Nigeria.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Link
              to="/cost-calculator"
              className="inline-flex items-center gap-2 bg-[#1fe99b] text-[#0a2a1e] font-bold px-7 py-4 rounded-full hover:bg-[#17d48a] transition-colors duration-200 text-base w-fit"
            >
              Get a free quote
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/cost-calculator"
              className="inline-flex items-center gap-2 bg-white/10 text-white font-semibold px-7 py-4 rounded-full hover:bg-white/20 transition-colors duration-200 text-base border border-white/20 w-fit"
            >
              Compare couriers
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="py-8 px-4 flex flex-col items-center text-center border-r border-white/10 last:border-r-0">
                <span className="inline-flex w-10 h-10 items-center justify-center rounded-xl bg-[#1fe99b]/15 text-[#1fe99b] mb-4">
                  <Icon size={20} />
                </span>
                <p className="font-extrabold text-3xl md:text-4xl text-[#1fe99b] tracking-tight">
                  {value}
                </p>
                <p className="text-white/50 text-sm mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services bento grid ────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="services-heading">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
              Logistics Services Nigeria
            </p>
            <h2
              id="services-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              Everything your business needs to ship
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-[#0a2a1e] text-white rounded-3xl p-8 flex flex-col gap-5 min-h-[220px]">
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-[#1fe99b]/20 text-[#1fe99b]">
                <BarChart2 size={24} />
              </span>
              <h3 className="font-bold text-xl leading-snug">Instant Price Comparison</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                See quotes from all major courier companies on one screen. Find the fastest option, the cheapest option, or the best balance of both for every shipment.
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 flex flex-col gap-4 border border-gray-100">
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-green-100 text-green800">
                <MapPin size={24} />
              </span>
              <h3 className="font-bold text-base text-blue100 leading-snug">Pickup Scheduling</h3>
              <p className="text-grey200 text-sm leading-relaxed">
                Book a doorstep pickup with our verified franchise partners across Lagos.
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 flex flex-col gap-4 border border-gray-100">
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-green-100 text-green800">
                <Zap size={24} />
              </span>
              <h3 className="font-bold text-base text-blue100 leading-snug">Same Day Options</h3>
              <p className="text-grey200 text-sm leading-relaxed">
                Book before 12pm for same day delivery on eligible Lagos routes.
              </p>
            </div>

            <div className="bg-[#1fe99b] rounded-3xl p-8 flex flex-col gap-4">
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-[#0a2a1e]/10 text-[#0a2a1e]">
                <Shield size={24} />
              </span>
              <h3 className="font-bold text-base text-[#0a2a1e] leading-snug">Insured Shipments</h3>
              <p className="text-[#0a2a1e]/70 text-sm leading-relaxed">
                Every booking goes through screened and verified courier partners. Your goods are handled with care.
              </p>
            </div>

            <div className="bg-[#F8FAFC] rounded-3xl p-8 flex flex-col gap-4 border border-gray-100">
              <span className="inline-flex w-12 h-12 items-center justify-center rounded-xl bg-green-100 text-green800">
                <Clock size={24} />
              </span>
              <h3 className="font-bold text-base text-blue100 leading-snug">Real Time Tracking</h3>
              <p className="text-grey200 text-sm leading-relaxed">
                Follow every parcel from pickup to doorstep. Share live tracking links with your customers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use cases ─────────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 md:py-20 px-6" aria-labelledby="use-cases-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-4">
              Who uses GoSendeet
            </p>
            <h2
              id="use-cases-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              Built for every type of business
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {useCases.map((uc) => (
              <div
                key={uc.title}
                className="rounded-3xl p-8 flex flex-col gap-5 min-h-50"
                style={{ backgroundColor: uc.bg }}
              >
                <uc.icon size={28} style={{ color: uc.color, opacity: 0.85 }} />
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: uc.color }}>
                    {uc.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: uc.color, opacity: 0.8 }}>
                    {uc.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Coverage + routes ─────────────────────────────────────────────── */}
      <section className="bg-white py-16 md:py-20 px-6" aria-labelledby="coverage-heading">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mb-5">
              Service Area
            </p>
            <h2
              id="coverage-heading"
              className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight leading-tight mb-5"
              style={{ letterSpacing: "-1px" }}
            >
              Logistics services in Lagos and Ibadan
            </h2>
            <p className="text-grey200 text-base md:text-lg leading-relaxed mb-8">
              We cover intra city deliveries within Lagos and inter city routes between Lagos and Ibadan. More cities are being added as we grow.
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

          <ServicePageRoutesCard
            heading="Popular logistics routes"
            subheading="Click a route to compare courier prices"
            bg="bg-[#F8FAFC]"
          />
        </div>
      </section>

      {/* ── Explore more ──────────────────────────────────────────────────── */}
      <section className="bg-[#F8FAFC] py-16 md:py-20 px-6" aria-labelledby="explore-heading">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h2
              id="explore-heading"
              className="font-extrabold text-2xl md:text-3xl text-blue100 tracking-tight"
              style={{ letterSpacing: "-1px" }}
            >
              Explore more GoSendeet services
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              to="/delivery-service"
              className="group bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <p className="font-bold text-blue100 text-sm mb-1">Delivery Service</p>
                <p className="text-grey200 text-xs">Book same day and next day delivery</p>
              </div>
              <ArrowRight size={16} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link
              to="/courier-service"
              className="group bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <p className="font-bold text-blue100 text-sm mb-1">Courier Service</p>
                <p className="text-grey200 text-xs">Compare courier companies in Lagos</p>
              </div>
              <ArrowRight size={16} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
            <Link
              to="/cost-calculator"
              className="group bg-white rounded-2xl border border-gray-100 p-6 flex items-center justify-between hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <p className="font-bold text-blue100 text-sm mb-1">Price Calculator</p>
                <p className="text-grey200 text-xs">Get an instant quote for your route</p>
              </div>
              <ArrowRight size={16} className="text-grey200 group-hover:text-green800 transition-colors shrink-0" />
            </Link>
          </div>
        </div>
      </section>

      <ServicePageFinalCta
        heading="Start shipping smarter today"
        body="Compare logistics prices from Nigeria's top courier companies in seconds. No account needed to get a quote."
      />
    </Layout>
  );
}
