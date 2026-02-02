import { useState } from "react";
import FormHorizontalBar from "./components/FormHorizontalBar";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import dhl from "@/assets/images/dhl.png";
import fedex from "@/assets/images/fedex.png";
import gig from "@/assets/images/gig.png";
import ups from "@/assets/images/ups.png";
import Marquee from "react-fast-marquee";
import { PiQuotesFill } from "react-icons/pi";

const Header = () => {
  const [formMode, setFormMode] = useState<FormMode>("gosendeet");
  const logos = [
    { src: dhl, alt: "DHL" },
    { src: fedex, alt: "FedEx" },
    { src: gig, alt: "GIG" },
    { src: ups, alt: "UPS" },
  ];

  const stats = [
    { value: "99.8%", label: "Delivery Success Rate" },
    { value: "15k+", label: "Active Users Monthly" },
    { value: "45m", label: "Avg. Local Delivery" },
    { value: "24/7", label: "Live Human Support" },
  ];

  return (
    <>
      <div className="min-h-[100vh] bg-white flex flex-col justify-between md:px-20 px-6 pt-6 md:pt-10 lg:pt-12 pb-8 md:pb-10 lg:pb-12 relative overflow-hidden bg-hero">
        <p className="bg-green300 border border-green600 w-fit mx-auto px-6 py-2 flex items-center gap-2 rounded-full md:text-sm text-xs font-bold my-10 shadow-md relative z-10">
          <span className="w-2.5 h-2.5 bg-green700 rounded-full"></span>
          <span className="uppercase text-green800 font-inter md:block hidden">
            Nigeria's Most Trusted Logistics Network
          </span>
          <span className="uppercase text-green800 font-inter md:hidden block">
            Nigeria's Top Logistics
          </span>
        </p>
        <h1 className="xl:text-8xl lg:text-7xl md:text-6xl text-4xl font-inter font-extrabold text-center tracking-[-2.4px] mb-5">
          <span className="text-blue100">Deliver with</span> <br />
          <span
            className="text-transparent bg-clip-text 
           bg-[linear-gradient(90deg,#00A651_0%,#00C389_55%,#00D1C1_100%)]"
          >
            absolute certainty.
          </span>
        </h1>

        <p className="text-grey300 text-center text-md md:w-[500px] mx-auto mb-5">
          The only platform combining direct franchise reliability with
          marketplace flexibility.
        </p>

        <p className="w-fit text-center mx-auto mb-8 px-4 py-2 text-md font-bold bg-neutral200 rounded-full">
          Secure. Fast. Verified.
        </p>

        <div className="flex justify-center mb-8">
          <ModeSwitcher
            mode={formMode}
            onModeChange={setFormMode}
            variant="pill"
          />
        </div>
        <div className="p-4 mb-8">
          <FormHorizontalBar variant="minimal" activeMode={formMode} />
        </div>
      </div>
      <div className="bg-white flex flex-col justify-between md:px-20 px-6 pt-6 md:pt-10 lg:pt-12 pb-8 md:pb-10 lg:pb-12 relative overflow-hidden">
        <div className="flex md:flex-row flex-col gap-8 mt-10">
          <div className="md:w-1/2 space-y-6 overflow-hidden py-10">
            <Marquee speed={40} pauseOnHover gradient gradientWidth={80}>
              {logos.map((l) => (
                <img
                  key={`top-${l.alt}`}
                  src={l.src}
                  alt={l.alt}
                  className="mx-10 h-8 opacity-70"
                  draggable={false}
                />
              ))}
            </Marquee>

            <Marquee
              speed={40}
              direction="right"
              pauseOnHover
              gradient
              gradientWidth={80}
            >
              {logos
                .slice()
                .reverse()
                .map((l) => (
                  <img
                    key={`bottom-${l.alt}`}
                    src={l.src}
                    alt={l.alt}
                    className="mx-10 h-8 opacity-70"
                    draggable={false}
                  />
                ))}
            </Marquee>
          </div>

          <div className="md:w-1/2 relative">
            <p className="absolute xl:left-28 lg:left-20 md:-left-5 -top-4 text-xl text-white bg-green100 h-12 w-12 flex justify-center items-center rounded-xl">
              <PiQuotesFill />
            </p>

            <div className="bg-white lg:w-[400px] md:w-[300px] w-full p-8 rounded-lg  mx-auto shadow-md space-y-6">
              <p className="w-fit">
                "The most reliable delivery partner we have found in Nigeria."
              </p>
              <div className="flex items-center gap-2 w-fit">
                <p className="w-10 h-10 bg-neutral300 rounded-full"></p>
                <p>— CEO, Market day</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mt-16 pt-10">
          {stats.map((stat, index) => (
            <div
              key={index}
              className=" flex flex-col gap-2 justify-center items-center text-center bg-grey400 p-4 rounded-2xl"
            >
              <p className="text-3xl md:text-4xl font-inter font-bold text-green100 mb-2">
                {stat.value}
              </p>
              <p className="text-xs md:text-sm font-inter font-semibold text-grey200 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Header;
