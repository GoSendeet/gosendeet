import { Button } from "@/components/ui/button";
import { Badge, CircleCheckBig, Diamond, ShieldCheck } from "lucide-react";
import coverage from "@/assets/images/coverage.png";
import verified from "@/assets/images/verified2.png";
const Services = () => {
  return (
    <>
      <div className="font-arial bg-[#F8FAFC] md:px-20 px-6 md:py-20 py-10">
        {/* Subheading */}
        <p className="text-center text-green2000 bg-green300 w-fit px-3 py-1 rounded-full font-inter font-bold text-xs mx-auto uppercase tracking-wider mb-6 md:mb-8">
          Our Services
        </p>

        {/* Main Heading */}
        <h2 className="text-center text-3xl font-arial md:text-6xl lg:text-6xl tracking-[-1.5px] font-[900] text-blue100 mb-6 md:mb-8 leading-tight">
          One Platform. <br />
          Two Powerful Ways to Ship.
        </h2>

        {/* Description */}
        <p className="text-center text-grey300 text-base md:text-lg max-w-2xl mx-auto">
          We've engineered distinct solutions for every type of sender. Whether
          you need white-glove security or market-beating prices, we have you
          covered.
        </p>
      </div>
      <div className="relative min-h-[100vh] w-full bg-service bg-green1000 md:px-20 px-6 md:py-20 py-10">
        <div className="flex lg:flex-row lg:gap-0 gap-12 flex-col justify-between items-center">
          <div className="lg:w-1/2 w-full flex flex-col items-center">
            <div className="flex flex-col gap-8 mx-auto xl:w-[500px]">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-green2000 shadow-2xl text-white">
                  <Diamond />
                </span>

                <p className="text-green2000 font-bold text-sm ">
                  PREMIUM SERVICE
                </p>
              </div>
              <p className="font-extrabold md:text-6xl text-3xl">
                <span className="text-white">Gosendeet</span>
                <br />
                <span className="text-green2000">Direct</span>
              </p>
              <p className="text-green-100 xl:w-4/5 ">
                The gold standard for high-value logistics. Operated exclusively
                by our verified franchise partners for guaranteed speed and
                safety.
              </p>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white text-md">
                  <span className="text-green500">
                    <CircleCheckBig />
                  </span>
                  Full Insurance Coverage
                </li>
                <li className="flex items-center gap-3 text-white text-md">
                  <span className="text-green500">
                    <CircleCheckBig />
                  </span>
                  Uniformed & Trained Pros
                </li>
                <li className="flex items-center gap-3 text-white text-md">
                  <span className="text-green500">
                    <CircleCheckBig />
                  </span>
                  Dedicated Support Line
                </li>
              </ul>

              <Button className="bg-white w-fit font-bold text-blue100 shadow-[0px_0px_30px_-5px_#FFFFFF4D]">
                Book Premium Direct
              </Button>
            </div>
          </div>

          <div className="lg:w-1/2 w-full flex flex-col items-center justify-center gap-8">
            <div className="lg:w-fit w-full p-8 bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-2xl flex flex-col gap-12">
              <p className="text-3xl font-bold font-arial flex justify-between items-center">
                <span className="text-white">100% Liability</span>{" "}
                <ShieldCheck size={36} className="text-[#FFFFFF4D]" />
              </p>
              <img
                src={coverage}
                alt="coverage"
                className="lg:w-[400px] w-full"
              />
            </div>
            <div className="lg:w-fit w-full p-8 bg-[#FFFFFF0D] border border-[#FFFFFF1A] rounded-2xl flex flex-col gap-12">
              <p className="text-3xl font-bold font-arial flex justify-between items-center">
                <span className="text-white">Vetted Pros</span>{" "}
                <Badge size={36} className="text-[#FFFFFF4D]" />
              </p>
              <img
                src={verified}
                alt="Verified"
                className="lg:w-[400px] w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
