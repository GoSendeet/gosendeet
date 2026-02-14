import { cn } from "@/lib/utils";

type JourneyItem = {
  label: string; // e.g. "2019" / "Today"
  title: string;
  description: string;
  active?: boolean; // the "Today" one
};

const journey: JourneyItem[] = [
  {
    label: "2019",
    title: "The Spark",
    description:
      "Our founders lost a critical shipment of medical supplies due to an untraceable dispatch rider. They realized the existing system was fundamentally broken and needed a technology-first approach.",
  },
  {
    label: "2021",
    title: "The Launch",
    description:
      "Gosendeet was born in Yaba, Lagos. We built a proprietary tracking algorithm and established the strictest rider vetting process in the industry.",
  },
  {
    label: "Today",
    title: "Scaling Trust",
    description:
      "We now operate across 12 cities with a fleet of over 500 verified partners, guaranteeing delivery or 100% money back. We are just getting started.",
    active: true,
  },
];

function TimelineDot({ active }: { active?: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      {/* outer ring */}
      <div
        className={cn(
          "h-5 w-5 rounded-full border",
          active ? "border-emerald-600" : "border-slate-300",
        )}
      />
      {/* inner fill (active only) */}
      <div className={cn(active ? 'bg-green-600' : 'bg-gray-500', "absolute h-2 w-2 rounded-full")} />
    </div>
  );
}

export default function Journey() {
  return (
    <section className="w-full md:px-20 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        {/* Outer rounded container */}
        <div className="rounded-3xl border border-slate-200 bg-white p-10 shadow-[0_1px_0_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            {/* Left block */}
            <div className="md:col-span-4">
              <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
                Our Journey
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                From a personal frustration to a national solution. Here is how
                Gosendeet came to be.
              </p>
            </div>

            {/* Right timeline */}
            <div className="relative md:col-span-8">
              {/* Vertical line */}
              <div className="absolute left-[11px] top-2 h-[calc(100%-8px)] w-px bg-slate-200" />

              <div className="flex flex-col gap-14">
                {journey.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-[24px_1fr] gap-6">
                    {/* Dot column */}
                    <div className="pt-1">
                      <TimelineDot active={item.active} />
                    </div>

                    {/* Content */}
                    <div>
                      <div className="flex items-center gap-3">
                        <span
                          className={cn(
                            "text-xs font-semibold",
                            item.active ? "text-emerald-600" : "text-emerald-600",
                          )}
                        >
                          {item.label}
                        </span>
                      </div>

                      <h3 className="mt-1 text-xl font-semibold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-[560px] text-sm leading-6 text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
