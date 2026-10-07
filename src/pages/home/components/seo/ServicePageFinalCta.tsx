import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ServicePageFinalCtaProps {
  heading: string;
  body: string;
  ctaLabel?: string;
}

export default function ServicePageFinalCta({
  heading,
  body,
  ctaLabel = "Get a free quote",
}: ServicePageFinalCtaProps) {
  return (
    <section className="bg-[#173c33] text-white py-16 md:py-20 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <h2
          className="font-extrabold text-3xl md:text-4xl tracking-tight mb-5"
          style={{ letterSpacing: "-1px" }}
        >
          {heading}
        </h2>
        <p className="text-[#eef4f1] text-lg leading-relaxed mb-8">{body}</p>
        <Link
          to="/cost-calculator"
          className="inline-flex items-center gap-2 bg-[#1fe99b] text-[#0a2a1e] font-bold px-7 py-4 rounded-full hover:bg-[#17d48a] transition-colors duration-200"
        >
          {ctaLabel}
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}
