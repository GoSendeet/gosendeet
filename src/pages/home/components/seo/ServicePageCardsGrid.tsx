import type { LucideProps } from "lucide-react";

interface CardItem {
  icon: React.ComponentType<LucideProps>;
  title: string;
  description: string;
}

interface ServicePageCardsGridProps {
  id: string;
  pill: string;
  heading: string;
  items: CardItem[];
}

export default function ServicePageCardsGrid({ id, pill, heading, items }: ServicePageCardsGridProps) {
  return (
    <section
      className="bg-[#F8FAFC] py-16 md:py-20 px-6"
      aria-labelledby={id}
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wider mx-auto mb-4">
            {pill}
          </p>
          <h2
            id={id}
            className="font-extrabold text-3xl md:text-4xl text-blue100 tracking-tight"
            style={{ letterSpacing: "-1px" }}
          >
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200"
            >
              <span className="inline-flex w-11 h-11 items-center justify-center rounded-xl bg-green-100 text-green800">
                <Icon size={22} />
              </span>
              <h3 className="font-bold text-blue100 text-base leading-snug">{title}</h3>
              <p className="text-grey200 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
