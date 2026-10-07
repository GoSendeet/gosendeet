import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const points = [
  "Instantly compare quotes from Nigeria's top couriers side by side, no account needed.",
  "Book a pickup or drop-off with verified couriers across Nigeria in minutes.",
  "Track every delivery in real time from pickup to doorstep.",
];

const WhatIsGosendeet = () => {
  return (
    <section
      aria-labelledby="what-is-gosendeet-heading"
      className="bg-white py-6 md:py-8 font-arial"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 xl:px-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">

          {/* Left — image (moves below content on mobile) */}
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[4/3] md:aspect-auto md:h-[480px] order-last md:order-first">
            <img
              src="/images/landing/parcel.webp"
              alt="A courier handing a parcel to its recipient"
              className="w-full h-full object-fit"
              width="720"
              height="480"
              loading="lazy"
            />
            {/* overlay badge — compact on mobile, full on md+ */}
            <div className="absolute bottom-3 left-3 w-50 md:w-sm right-3 md:bottom-1 md:left-4 md:right-4 bg-white/90 backdrop-blur-sm rounded-md px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 md:gap-3 shadow-sm">
              <span className="shrink-0 w-7 h-7 md:w-9 md:h-9 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 size={15} className="text-green800" />
              </span>
              <div>
                <p className="text-xs font-bold text-blue100 leading-tight">Verified couriers only</p>
                <p className="text-xs text-grey200 hidden md:block">Every partner is screened before listing</p>
              </div>
            </div>
          </div>

          {/* Right — content (comes first on mobile) */}
          <div className="flex flex-col gap-4 order-first md:order-last">
            <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-inter font-bold text-xs uppercase tracking-wider">
              What is GoSendeet?
            </p>

            <h2
              id="what-is-gosendeet-heading"
              className="font-extrabold text-3xl md:text-4xl lg:text-5xl tracking-tight text-blue100 leading-tight"
            >
              An Easy Way <br className="hidden sm:block" /> to send Parcels
            </h2>

            <p className="text-grey200 text-base md:text-lg leading-relaxed -mt-5">
              GoSendeet connects senders with verified couriers across Nigeria. Compare prices,
              book pickups, and track deliveries, all in one place, without the guesswork.
            </p>

            <ul className="flex flex-col gap-2">
              {points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <CheckCircle2 size={20} className="shrink-0 text-green800 mt-0.5" />
                  <span className="text-grey200 text-sm md:text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>

            <div className="pt-2">
              <Link
                to="/cost-calculator"
                className="inline-flex items-center gap-2 landing-primary text-white font-bold px-6 py-3 rounded-full hover:bg-green-900 transition-colors duration-200 text-sm md:text-base"
              >
                Calculate Delivery Cost
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhatIsGosendeet;
