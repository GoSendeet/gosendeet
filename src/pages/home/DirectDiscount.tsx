import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const perks = [
  "Save time and money on sending packages",
  "Discounted rates with premium carriers",
  "Instant shipping quotes, no account needed",
  "Dedicated pickup, no drop-off queues",
];

const DirectDiscount = () => {
  return (
    <section
      aria-labelledby="direct-discount-heading"
      className="bg-[#F0FDF4] md:px-20 px-6 md:py-20 py-14 font-arial"
    >
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

        {/* Left — image (shown second on mobile, first on desktop) */}
        <div className="lg:w-1/2 w-full flex-shrink-0 flex items-center justify-center order-2 lg:order-1">
          <img
            src="/parcel.png"
            alt="GoSendeet Direct parcel delivery"
            className="w-full max-w-md lg:max-w-full object-contain drop-shadow-lg"
            draggable={false}
          />
        </div>

        {/* Right — content (shown first on mobile, second on desktop) */}
        <div className="lg:w-1/2 w-full flex flex-col gap-7 order-1 lg:order-2">
          {/* Label */}
          <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-inter font-bold text-xs uppercase tracking-wider">
            GoSendeet Direct®
          </p>

          {/* Heading */}
          <h2
            id="direct-discount-heading"
            className="font-extrabold lg:text-5xl md:text-4xl text-3xl tracking-tight text-blue100 leading-tight"
          >
            Discounts off Gosendeet&nbsp;Direct<sup className="text-xl">®</sup> services
          </h2>

          {/* Perks list */}
          <ul className="flex flex-col gap-4">
            {perks.map((perk) => (
              <li key={perk} className="flex items-start gap-3">
                <CheckCircle2
                  size={20}
                  className="text-green500 shrink-0 mt-0.5"
                />
                <span className="text-grey300 text-base leading-snug">{perk}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            to="/cost-calculator"
            className="inline-flex w-fit items-center gap-2 bg-brand text-white font-bold px-6 py-3 rounded-full hover:bg-green-900 transition-colors duration-200 text-sm"
          >
            Book Direct Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DirectDiscount;
