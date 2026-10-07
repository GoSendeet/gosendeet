import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const SHARED_ROUTES = [
  { label: "Lagos to Ibadan", pickup: "Lagos", destination: "Ibadan" },
  { label: "Ibadan to Lagos", pickup: "Ibadan", destination: "Lagos" },
  { label: "Ikeja to Lekki", pickup: "Ikeja", destination: "Lekki" },
  { label: "Yaba to Victoria Island", pickup: "Yaba", destination: "Victoria Island" },
  { label: "Lekki to Ikeja", pickup: "Lekki", destination: "Ikeja" },
  { label: "Victoria Island to Yaba", pickup: "Victoria Island", destination: "Yaba" },
];

interface ServicePageRoutesCardProps {
  heading?: string;
  subheading?: string;
  ctaLabel?: string;
  bg?: string;
}

export default function ServicePageRoutesCard({
  heading = "Popular delivery routes",
  subheading,
  ctaLabel = "Get a free quote",
  bg = "bg-white",
}: ServicePageRoutesCardProps) {
  return (
    <div className={`${bg} rounded-2xl border border-gray-100 p-6 md:p-8 shadow-sm`}>
      <p className="font-bold text-blue100 text-base mb-1">{heading}</p>
      {subheading && <p className="text-grey200 text-xs mb-5">{subheading}</p>}
      {!subheading && <div className="mb-5" />}
      <div className="flex flex-col divide-y divide-gray-100">
        {SHARED_ROUTES.map((route) => (
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
        {ctaLabel}
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
