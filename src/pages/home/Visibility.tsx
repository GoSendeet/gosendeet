import {
  FileText,
  UserCheck,
  PackageCheck,
} from "lucide-react";

const steps = [
  {
    icon: FileText,
    number: "1",
    title: "Get a Quote",
    description:
      "Enter your parcel details and instantly compare delivery prices from verified couriers.",
  },
  {
    icon: UserCheck,
    number: "2",
    title: "Create an Account",
    description:
      "Sign up and verify your account. Once confirmed, complete and place your delivery order.",
  },
  {
    icon: PackageCheck,
    number: "3",
    title: "Book & Track",
    description:
      "Confirm order, complete payment, and track your package from pickup to successful delivery.",
  },
];

const Visibility = () => {
  return (
    <>
      {/* Proprietary Technology / Radical Visibility section — commented out pending update
      <div className="relative w-full bg-white md:px-20 px-6 md:py-20 py-10 font-arial">
        ...phone + features grid...
      </div>
      */}

      {/* Simple Steps to Ship */}
      <section
        aria-labelledby="steps-heading"
        className="bg-[#F8FAFC] md:px-20 px-6 md:py-20 py-14 font-arial"
      >
        <div className="max-w-5xl mx-auto">
          {/* Label */}
          <p className="text-center text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-inter font-bold text-xs mx-auto uppercase tracking-wider mb-6">
            How Gosendeet Works
          </p>

          <h2
            id="steps-heading"
            className="text-center font-extrabold text-blue100 tracking-tight lg:text-5xl md:text-4xl text-3xl mb-4 leading-tight"
          >
            Ship in 3 Simple Steps
          </h2>
          <p className="text-center text-grey200 text-base md:text-lg max-w-xl mx-auto mb-16">
            From quote to delivery, the whole process takes just minutes.
          </p>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-8 items-start relative">
            {/* Connector line — desktop only */}
            <div
              aria-hidden="true"
              className="hidden md:block absolute top-10 left-[20%] right-[20%] h-[2px] bg-gradient-to-r from-green-200 via-green-300 to-green-200 z-0"
            />

            {steps.map(({ icon: Icon, number, title, description }) => (
              <div key={number} className="flex flex-col items-center text-center gap-4 z-10">
                {/* Icon box */}
                <div className="relative w-20 h-20 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center mb-2">
                  <Icon size={32} className="text-green500" strokeWidth={1.5} />
                  <span className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-brand text-white text-[11px] font-bold flex items-center justify-center shadow-sm">
                    {number}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-blue100">{title}</h3>
                <p className="text-grey300 text-sm leading-relaxed max-w-[220px]">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      
    </>
  );
};

export default Visibility;
