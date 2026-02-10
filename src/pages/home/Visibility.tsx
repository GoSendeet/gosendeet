import phone from "@/assets/images/phone.png";
import {
  FileText,
  ShieldCheck,
  CircleCheckBig,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Visibility = () => {
  return (
    <>
      <div className="relative w-full bg-white md:px-20 px-6 md:py-20 py-10 font-arial">
        <div className="flex flex-col gap-2 mb-12">
          <p className="text-center text-green800 font-bold text-xs uppercase tracking-wider">
            Proprietary Technology
          </p>
          <p className="font-extrabold text-center text-blue100 tracking-tighter lg:text-[48px] md:text-4xl text-3xl">
            Radical Visibility.
          </p>
          <p className="text-grey200 text-xl text-center">
            We built the OS for Nigerian logistics. Track, chat, and pay
            securely.
          </p>
        </div>

        {/* Features Grid with Phone */}
        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8 items-center">
            {/* Left Column - Features */}
            <div className="flex flex-col gap-12 lg:order-1 order-2">
              {/* Live Map */}
              <div className="flex flex-col gap-3 lg:text-right text-left lg:items-end items-start">
                <h3 className="md:text-2xl text-xl font-bold text-blue100">Live Map</h3>
                <p className="text-grey300 md:text-base text-sm max-w-xs">
                  Real-time GPS tracking. Watch your package move street by
                  street.
                </p>
              </div>

              {/* Private Chat */}
              <div className="flex flex-col gap-3 lg:text-right text-left lg:items-end items-start">
                <h3 className="md:text-2xl text-xl font-bold text-blue100">
                  Private Chat
                </h3>
                <p className="text-grey300 md:text-base text-sm max-w-xs">
                  Communicate with riders without revealing your phone number.
                </p>
              </div>
            </div>

            {/* Center Column - Phone */}
            <div className="lg:flex hidden justify-center items-center lg:order-2 order-1 mt-4">
              <div className="relative">
                <img
                  src={phone}
                  alt="GoSendeet App Interface"
                  className="w-full max-w-[300px] md:max-w-[350px] h-auto drop-shadow-2xl"
                />
                {/* Optional: Add overlay content on phone if needed */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {/* This is where the phone screen content would go if you want to customize it */}
                </div>
              </div>
            </div>

            {/* Right Column - Features */}
            <div className="flex flex-col gap-12 lg:order-3 order-3">
              {/* OTP Security */}
              <div className="flex flex-col gap-3 lg:text-left text-left lg:items-start items-start">
                <h3 className="md:text-2xl text-xl font-bold text-blue100">
                  OTP Security
                </h3>
                <p className="text-grey300 md:text-base text-sm max-w-xs">
                  Delivery isn't complete until you share your unique 4-digit
                  code.
                </p>
              </div>

              {/* Escrow Pay */}
              <div className="flex flex-col gap-3 lg:text-left text-left lg:items-start items-start">
                <h3 className="md:text-2xl text-xl font-bold text-blue100">Escrow Pay</h3>
                <p className="text-grey300 md:text-base text-sm max-w-xs">
                  We hold your funds securely. Carrier gets paid only after
                  success.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Steps to Ship Section */}
      <div className="bg-grey400 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-center font-extrabold text-blue100 tracking-tighter md:text-4xl text-3xl mb-16">
            Simple Steps to Ship
          </h2>

          <div className="grid md:grid-cols-3 grid-cols-1 gap-12 md:gap-4 items-start relative">
            {/* Connecting Lines - Hidden on mobile */}
            <div className="hidden md:block xl:w-[800px] lg:w-[700px] md:w-[500px] absolute top-[40px] left-[15%] right-[5%] h-[2px] bg-gray-200 z-10"></div>

            {/* Step 1: Book */}
            <div className="flex flex-col items-center text-center gap-4 z-20">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-2">
                <FileText
                  className="text-grey500"
                  size={36}
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-xl font-bold text-blue100">1. Book</h3>
              <p className="text-grey300 text-sm max-w-[200px]">
                Enter details and choose between Direct or Compare.
              </p>
            </div>

            {/* Step 2: Verify */}
            <div className="flex flex-col items-center text-center gap-4 z-20">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-2">
                <ShieldCheck
                  className="text-grey500"
                  size={36}
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-xl font-bold text-blue100">2. Verify</h3>
              <p className="text-grey300 text-sm max-w-[200px]">
                Receive OTP. Rider arrives for pickup.
              </p>
            </div>

            {/* Step 3: Delivered */}
            <div className="flex flex-col items-center text-center gap-4 z-20">
              <div className="w-20 h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center mb-2">
                <CircleCheckBig
                  className="text-grey500"
                  size={36}
                  strokeWidth={1.5}
                />
              </div>
              <h3 className="text-xl font-bold text-blue100">3. Delivered</h3>
              <p className="text-grey300 text-sm max-w-[200px]">
                Track until safe arrival. Confirm via app.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section - Ready to move it */}
      <div className="bg-white md:px-20 px-6 md:py-20 py-10">
        <div className="max-w-5xl mx-auto btn-gradient rounded-[32px] md:px-16 px-8 md:py-16 py-12 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-6">
            <h2 className="font-extrabold text-white tracking-tight lg:text-5xl md:text-4xl text-3xl">
              Ready to move it?
            </h2>
            <p className="text-green-100 text-base max-w-2xl">
              Join thousands of businesses and individuals who have switched to
              the most trusted network in Nigeria.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Button className="bg-white text-black">
                Get Started Now
                <ArrowRight size={20} />
              </Button>
              <Button
                variant="outline"
                className="text-white hover:text-white bg-transparent hover:bg-transparent"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Visibility;
