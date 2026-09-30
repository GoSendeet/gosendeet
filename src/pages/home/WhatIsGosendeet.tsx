import { Link } from "react-router-dom";
import { ArrowRight, GitCompare, MapPin, ShieldCheck } from "lucide-react";

const features = [
  {
    icon: GitCompare,
    color: "bg-green-100 text-green800",
    title: "Compare Delivery Quotes",
    description:
      "Instantly see prices from DHL, FedEx, Fez, GIG, UPS and more side by side, no account needed.",
  },
  {
    icon: MapPin,
    color: "bg-green-100 text-green800",
    title: "Book a Direct Pickup",
    description:
      "Schedule a pickup with our vetted GoSendeet franchise partners for premium, insured delivery.",
  },
  {
    icon: ShieldCheck,
    color: "bg-green-100 text-green800",
    title: "Track Every Step",
    description:
      "Get real-time notifications from the moment your package is picked up to doorstep delivery.",
  },
];

const WhatIsGosendeet = () => {
  return (
    <section
      aria-labelledby="what-is-gosendeet-heading"
      className="bg-white md:px-20 px-6 md:py-20 py-14 font-arial"
    >
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p className="text-center text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-inter font-bold text-xs mx-auto uppercase tracking-wider mb-6">
          What is Gosendet ?
        </p>

        {/* Heading — SEO: includes brand name + value prop */}
        <h2
          id="what-is-gosendeet-heading"
          className="text-center font-extrabold lg:text-5xl md:text-4xl text-3xl tracking-tight text-blue100 mb-5 leading-tight"
        >
          GoSendeet is a <br className="hidden md:block" />
          Smart Delivery Platform
        </h2>

        <p className="text-center text-grey200 text-base md:text-lg max-w-2xl mx-auto mb-12">
          We connect senders with verified couriers across Nigeria. Compare prices,
          book pickups/dropoff, and track deliveries all in one place.
        </p>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {features.map(({ icon: Icon, color, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] p-6 hover:shadow-md transition-shadow duration-200"
            >
              <span className={`inline-flex w-11 h-11 items-center justify-center rounded-xl ${color}`}>
                <Icon size={22} />
              </span>
              <h3 className="font-bold text-blue100 text-lg leading-snug">{title}</h3>
              <p className="text-grey200 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <Link
            to="/cost-calculator"
            className="inline-flex items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-full hover:bg-green-900 transition-colors duration-200"
          >
            Calculate Delivery Cost
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhatIsGosendeet;
