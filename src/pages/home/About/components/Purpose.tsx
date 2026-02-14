import { Flag, Eye, CheckCircle2 } from "lucide-react";

const Purpose = () => {
  return (
    <div className="bg-white md:px-20 px-6 md:py-20 py-10 mt-20 md:mt-0">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            {/* Badge */}
            <div>
              <p className="text-green800 font-bold text-xs uppercase tracking-wider mb-4">
                Our Purpose
              </p>
            {/* Main Heading */}
            <h2 className="font-extrabold text-blue100 lg:text-5xl md:text-4xl text-3xl leading-tight">
              Rewriting the narrative of African logistics.
            </h2>
            </div>


            {/* Description */}
            <div className="space-y-6">
              <p className="text-grey300 md:text-xl leading-relaxed">
                The logistics sector in Nigeria has long been plagued by
                mistrust, theft, and delays. We founded Gosendeet to rewrite
                this narrative, proving that African logistics can be
                world-class.
              </p>

              <p className="text-grey300 md:text-xl leading-relaxed">
                Our goal isn't just to move boxes; it's to move the economy
                forward by creating a layer of trust that businesses and
                individuals can build upon.
              </p>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="text-blue100" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-blue100 mb-1">
                    Absolute Transparency
                  </h4>
                  <p className="text-grey300 text-sm">
                    Real-time tracking for peace of mind.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle2 className="text-blue100" size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-blue100 mb-1">
                    Vetted Personnel
                  </h4>
                  <p className="text-grey300 text-sm">
                    Every rider is background checked.
                  </p>
                </div>
              </div>
            </div>
          </div>

            {/* Right Column */}
          <div className="relative ">
            {/* back card */}
            <div className="absolute inset-0 hidden md:block translate-x-4 translate-y-4 rounded-3xl bg-emerald-100" />

            {/* front card */}
            <div className="relative rounded-3xl border border-slate-200 bg-white py-9 pl-9 pr-12 shadow-sm">
              {/* Mission */}
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Flag className="text-green800" size={24} />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  Our Mission
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  To solve the trust and reliability crisis in Nigerian package
                  delivery through absolute transparency, vetted personnel, and
                  cutting-edge technology.
                </p>
              </div>

              <div className="my-6 h-px bg-slate-100" />

              {/* Vision */}
              <div className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                  <Eye className="text-green800" size={24} />
                </div>

                <h3 className="text-xl font-semibold text-slate-900">
                  Our Vision
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  To become the operating system for African commerce, creating
                  a continent where anyone can send anything, anywhere, with
                  zero anxiety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Purpose;
