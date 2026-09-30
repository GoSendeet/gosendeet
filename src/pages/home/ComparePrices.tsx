import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import dhl from "@/assets/images/dhl.png";
import fedex from "@/assets/images/fedex.png";
import gig from "@/assets/images/gig.png";
import ups from "@/assets/images/ups.png";

const logos = [
  { src: dhl, alt: "DHL" },
  { src: fedex, alt: "FedEx" },
  { src: gig, alt: "GIG Logistics" },
  { src: ups, alt: "UPS" },
];

const stats = [
  { value: "100%", label: "Insured Deliveries" },
  { value: "Verified", label: "Courier Partners" },
  { value: "Tracking", label: "Parcel Tracking" },
  { value: "24/7", label: "Support Active" },
];

const ComparePrices = () => {
  return (
    <section
      aria-labelledby="compare-prices-heading"
      className="bg-white md:px-20 px-6 md:py-16 py-12 font-arial border-t border-gray-100"
    >
      <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">

        {/* Headline */}
        <div className="text-center">
          <h2
            id="compare-prices-heading"
            className="font-extrabold lg:text-4xl md:text-3xl text-2xl tracking-tight text-blue100 mb-3 leading-tight"
          >
            Compare prices from Nigeria's top couriers
          </h2>
          <p className="text-grey200 text-base md:text-lg max-w-xl mx-auto">
            Book with trusted carriers at competitive rates to destinations
            across Nigeria and beyond.
          </p>
        </div>

        {/* Partner logos */}
        <div className="w-full flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((l) => (
            <img
              key={l.alt}
              src={l.src}
              alt={l.alt}
              className="h-8 opacity-60 hover:opacity-100 transition-opacity duration-200"
              draggable={false}
            />
          ))}
        </div>

        {/* Stats */}
        <div className="w-full grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1.5 items-center text-center bg-[#F8FAFC] p-5 rounded-2xl"
            >
              <p className="text-3xl font-inter font-bold text-green100">
                {stat.value}
              </p>
              <p className="text-xs font-inter font-semibold text-grey200 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/cost-calculator"
          className="inline-flex items-center gap-2 border border-brand text-brand font-bold px-6 py-3 rounded-full hover:bg-brand hover:text-white transition-colors duration-200 text-sm"
        >
          Get an Instant Quote
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default ComparePrices;
