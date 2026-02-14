import { Zap, Users, ShieldCheck } from "lucide-react";

const Values = () => {
  const values = [
    {
      icon: ShieldCheck,
      title: "Uncompromised Trust",
      description:
        "We verify every rider, track every mile, and insure every item. Trust isn't given; it's engineered into our process.",
    },
    {
      icon: Zap,
      title: "Radical Speed",
      description:
        "Time is money. Our proprietary algorithms optimize routes in real-time to beat traffic and deliver faster.",
    },
    {
      icon: Users,
      title: "People First",
      description:
        "We empower our riders with fair wages and safety gear. Happy, safe riders mean better service for you.",
    },
  ];

  return (
    <div className="bg-white md:px-20 px-6 md:py-20 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-green800 font-bold text-xs uppercase tracking-wider mb-4">
            Our DNA
          </p>
          <h2 className="font-extrabold text-blue100 lg:text-5xl md:text-4xl text-3xl leading-tight mb-6">
            Values that drive us
          </h2>
          <p className="text-grey300 text-lg max-w-2xl mx-auto">
            We don't just deliver packages; we deliver on our promises. These
            core values guide every decision we make.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-8">
          {values.map((value, index) => {
            const IconComponent = value.icon;
            return (
              <div
                key={index}
                className="bg-white border border-grey100 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                {/* Icon */}
                <div className="lg:w-16 lg:h-16 w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mb-6">
                  <IconComponent
                    className="text-green800 lg:text-3xl text-xl"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Title */}
                <h3 className="font-bold text-blue100 text-xl mb-4">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-grey300 text-base leading-relaxed">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Values;
