import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

const Header = () => {
  const stats = [
    { value: "50k+", label: "Packages Delivered" },
    { value: "99.8%", label: "Reliability Rate" },
    { value: "12", label: "Cities Covered" },
    { value: "24/7", label: "Support Active" },
  ];

  return (
    <>
      <div className="relative min-h-[100vh] bg-about md:px-20 px-6 py-20 flex flex-col justify-between">
        <div className="absolute inset-0 about-gradient z-10"></div>
        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center max-w-4xl relative z-20">
          {/* Badge */}
          <div className="flex items-center gap-2 text-white  mb-8 bg-white/10 px-4 py-1 border rounded-full w-fit">
            <ShieldCheck size={20} />
            <span className="text-sm font-semibold uppercase tracking-wider">
              Trusted by 50k+ Nigerians
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="font-extrabold text-white lg:text-[64px] md:text-5xl text-4xl leading-[110%] mb-6">
            Logistics built on <br />
            <span className="text-green-400">Trust.</span>
          </h1>

          {/* Description */}
          <p className="text-green-100 text-lg md:text-xl leading-relaxed mb-8 max-w-xl">
            We are solving the reliability crisis in African logistics.
            Gosendeet combines technology with integrity to ensure your package
            arrives, every time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button className="bg-green3000 text-white md:w-fit w-full hover:bg-green300 font-semibold rounded-2xl">
              Join Our Network

              <ArrowRight size={20} />  
            </Button>
            <Button
              className="bg-white text-green100 md:w-fit w-full hover:bg-white/90 font-semibold rounded-2xl"
            >
              Read Our Story
            </Button>
          </div>
        </div>
      </div>
      {/* Stats Section */}
      <div className="mt-[-50px] bg-white rounded-3xl shadow-2xl relative z-20 md:mx-20 mx-6">
        <div className="grid md:grid-cols-4 grid-cols-2 gap-8 md:gap-4 px-8 py-10">
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <h3 className="text-green3000 font-bold text-3xl md:text-4xl mb-2">
                {stat.value}
              </h3>
              <p className="text-grey300 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
