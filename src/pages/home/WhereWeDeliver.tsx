import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";

const cities = [
  {
    name: "Lagos",
    tagline: "Full coverage across the city",
    areas: [
      "Victoria Island",
      "Lekki",
      "Ikoyi",
      "Surulere",
      "Yaba",
      "Ikeja",
      "Lagos Island",
      "Ajah",
      "Gbagada",
      "Magodo",
      "Maryland",
      "Ojota",
    ],
    accent: "bg-green-100 text-green800",
    border: "border-green-200",
    dot: "bg-green500",
  },
  {
    name: "Ibadan",
    tagline: "Major zones covered",
    areas: [
      "Bodija",
      "Ring Road",
      "Challenge",
      "Dugbe",
      "Agodi",
      "Eleiyele",
      "Sango",
      "Ojoo",
    ],
    accent: "bg-green-100 text-green800",
    border: "border-green-200",
    dot: "bg-green500",
  },
];

const WhereWeDeliver = () => {
  return (
    <section
      aria-labelledby="where-we-deliver-heading"
      className="bg-[#F8FAFC] md:px-20 px-6 md:py-20 py-14 font-arial"
    >
      <div className="max-w-5xl mx-auto">
        {/* Label */}
        <p className="text-center text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-inter font-bold text-xs mx-auto uppercase tracking-wider mb-6">
          Gosendeet Delivery Coverage
        </p>

        {/* Heading */}
        <h2
          id="where-we-deliver-heading"
          className="text-center font-extrabold lg:text-5xl md:text-4xl text-3xl tracking-tight text-blue100 mb-5 leading-tight"
        >
          We Deliver Across <br className="hidden md:block" />
          Lagos &amp; Ibadan
        </h2>

        <p className="text-center text-grey200 text-base md:text-lg max-w-2xl mx-auto mb-12">
          GoSendeet currently operates in Lagos and Ibadan, with more cities
          coming soon. Enter your address in the quote form to confirm coverage
          for your specific area.
        </p>

        {/* City cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {cities.map(({ name, tagline, areas, accent, border, dot }) => (
            <div
              key={name}
              className={`rounded-2xl border ${border} bg-white p-6 flex flex-col gap-5`}
            >
              {/* City header */}
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${accent}`}>
                  <MapPin size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-blue100 text-xl">{name}</h3>
                  <p className="text-grey200 text-xs">{tagline}</p>
                </div>
              </div>

              {/* Area chips */}
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-grey300"
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${dot} shrink-0`} />
                    {area}
                  </span>
                ))}
                <span className="inline-flex items-center rounded-full border border-dashed border-gray-300 bg-transparent px-3 py-1 text-xs text-grey200">
                  + more areas
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Expansion note + CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl bg-white border border-gray-100 px-6 py-5">
          <p className="text-sm text-grey200 text-center sm:text-left">
            <span className="font-semibold text-blue100">More cities coming soon.</span>{" "}
            Abuja, Port Harcourt and Kano are next on our expansion roadmap.
          </p>
          <Link
            to="/cost-calculator"
            className="inline-flex shrink-0 items-center gap-2 bg-brand text-white font-bold px-5 py-2.5 rounded-full text-sm hover:bg-green-900 transition-colors duration-200"
          >
            Check My Area
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WhereWeDeliver;
