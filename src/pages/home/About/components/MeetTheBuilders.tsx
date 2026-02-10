import person from "@/assets/images/avatar-profile.jpg";

type Builder = {
  name: string;
  role: string;
  blurb: string;
  avatar: string;
};

const builders: Builder[] = [
  {
    name: "Adewale Okafor",
    role: "CO-FOUNDER & CEO",
    blurb: "Ex-logistics manager aiming\nto digitize the last mile.",
    avatar: person,
  },
  {
    name: "Chioma Nnadi",
    role: "CO-FOUNDER & CTO",
    blurb: "Software engineer obsessed\nwith route optimization.",
    avatar: person,
  },
  {
    name: "Tunde Bakare",
    role: "HEAD OF OPERATIONS",
    blurb: "Ensures every package\nmoves smoothly from A to B.",
    avatar: person,
  },
  {
    name: "Zainab Yusuf",
    role: "CUSTOMER SUCCESS",
    blurb: "The friendly voice that keeps\nour customers smiling.",
    avatar: person,
  },
];

export default function MeetTheBuilders() {
  return (
    <section className="w-full bg-white px-4 py-20">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Meet the Builders
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500">
            A diverse team of engineers, logistics experts, and customer success
            specialists united by <br className="hidden sm:block" />a single
            mission.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-16 grid grid-cols-1 gap-14 sm:grid-cols-2 xl:grid-cols-4">
          {builders.map((b) => (
            <div
              key={b.name}
              className="flex flex-col items-center text-center"
            >
              {/* Avatar Image */}
              <img
                src={b.avatar}
                alt={b.name}
                className="h-[150px] w-[150px] rounded-full object-cover shadow-[0_14px_30px_rgba(15,23,42,0.10)] ring-4 ring-white"
              />

              {/* Name */}
              <h3 className="mt-6 text-base font-bold text-slate-900">
                {b.name}
              </h3>

              {/* Role */}
              <p className="mt-1 text-xs font-bold tracking-[0.14em] text-emerald-600">
                {b.role}
              </p>

              {/* Blurb */}
              <p className="mt-3 whitespace-pre-line text-xs leading-5 text-slate-500">
                {b.blurb}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
