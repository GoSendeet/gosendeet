import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface ServicePageHeroProps {
  id: string;
  pill: string;
  h1: string;
  h1Accent: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel: string;
  secondaryTo?: string;
}

export default function ServicePageHero({
  id,
  pill,
  h1,
  h1Accent,
  subtitle,
  primaryLabel,
  secondaryLabel,
  secondaryTo = "/track",
}: ServicePageHeroProps) {
  return (
    <section
      className="bg-[#173c33] text-white py-20 md:py-28 px-6"
      aria-labelledby={id}
    >
      <div className="max-w-4xl mx-auto text-center">
        <p className="inline-block bg-white/10 text-[#1fe99b] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-6">
          {pill}
        </p>
        <h1
          id={id}
          className="font-extrabold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-tight mb-6"
          style={{ letterSpacing: "-2px" }}
        >
          {h1}
          <br className="hidden sm:block" />{" "}
          <span className="text-[#1fe99b]">{h1Accent}</span>
        </h1>
        <p className="text-[#eef4f1] text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
          {subtitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/cost-calculator"
            className="inline-flex items-center justify-center gap-2 bg-[#1fe99b] text-[#0a2a1e] font-bold px-7 py-4 rounded-full hover:bg-[#17d48a] transition-colors duration-200 text-base"
          >
            {primaryLabel}
            <ArrowRight size={18} />
          </Link>
          <Link
            to={secondaryTo}
            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-7 py-4 rounded-full hover:bg-white/20 transition-colors duration-200 text-base border border-white/20"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
