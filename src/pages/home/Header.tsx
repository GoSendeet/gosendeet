import { useState } from "react";
import FormHorizontalBar from "./components/FormHorizontalBar";
import ModeSwitcher, { FormMode } from "@/components/ModeSwitcher";
import heroDeliveryIllustration from "../../../hero-image-with-logo.png";

const Header = () => {
  const [formMode, setFormMode] = useState<FormMode>("compare");

  return (
    <>
      <div className="min-h-[92vh] bg-white flex flex-col items-center md:px-20 px-6 pt-6 md:pt-8 lg:pt-6 pb-8 md:pb-10 lg:pb-12 relative overflow-hidden bg-hero">
        {/* Top-right gradient blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-[600px] h-[200px] lg:h-[500px] rounded-full bg-[linear-gradient(135deg,#A4F4CF_0%,#DCFCE7_50%,#CBFBF1_100%)] blur-[80px] opacity-30 z-0"
        />
        {/* Bottom-left gradient blob */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 w-[400px] h-[200px] rounded-full bg-[linear-gradient(315deg,#A4F4CF_0%,#DCFCE7_50%,#CBFBF1_100%)] blur-[80px] opacity-4 z-0"
        />
        <p className="bg-green300 border border-green600 w-fit h-8.5 mx-auto px-4 py-2 flex items-center gap-2 rounded-full md:text-xs text-xs font-bold mt-5 mb-6 lg:mt-8 lg:mb-7 shadow-md relative z-10">
          <span className="uppercase text-green800 font-inter md:block hidden">
            Smart, Secure & Insured Logistics Network
          </span>
          <span className="uppercase text-green800 font-inter md:hidden block">
            Nigeria's Secure Logistics
          </span>
        </p>
        <div className="relative z-10 text-center mx-auto font-sans font-black text-[36px] leading-[34.2px] lg:font-inter lg:font-black lg:text-[86px] lg:leading-[82px] mb-4">
          <span className="block text-blue100 -mb-7 lg:mb-0">Deliver with</span> <br />
          <span className="block lg:-mt-24 text-transparent bg-clip-text bg-[linear-gradient(90deg,#009966_0%,#00A63E_50%,#00BBA7_100%)]">
            absolute certainty.
          </span>
        </div>

        <p className="relative z-10 text-[#45556C] font-sans font-normal text-[16px] leading-6.5 text-center md:font-inter md:text-md md:leading-[26.3px] md:w-125 mx-auto mb-5">
          The only platform combining direct franchise reliability with
          marketplace flexibility.
        </p>

        <div className="relative z-20 flex justify-center items-center flex-col w-[386px] lg:w-[1120px]">
          <ModeSwitcher
            mode={formMode}
            onModeChange={setFormMode}
            variant="pill"
            animate
          />
          <div className="w-96.75 lg:w-[1120px] px-2 py-3">
            <FormHorizontalBar
              variant="minimal"
              activeMode={formMode}
              autoFocusPickup
            />
          </div>
        </div>

        <p className="relative z-10 w-fit text-center mx-auto mt-5 px-4 py-2 text-sm lg:text-md font-bold bg-neutral200 rounded-full">
          Secure. Fast. Verified.
        </p>

        <div className="hero-delivery-flow" aria-hidden="true">
          <img
            src={heroDeliveryIllustration}
            alt=""
            className="hero-delivery-illustration"
            draggable={false}
          />
        </div>
      </div>
    </>
  );
};

export default Header;
