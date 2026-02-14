import compareImg from "@/assets/images/compare.png";
import { Button } from "@/components/ui/button";
import { ArrowRight, BadgeCheck, DollarSign, Zap } from "lucide-react";
const Compare = () => {
  return (
    <div className="relative w-full bg-grey400 border border-[#F1F5F9] md:px-20 px-6 md:py-20 py-10 font-arial">
      <div className="flex lg:flex-row lg:gap-0 gap-12 flex-col justify-between items-center">
        <div className="lg:w-1/2 w-full flex flex-col items-center justify-center gap-8">
          <img
            src={compareImg}
            alt="compare"
            className="lg:w-[400px] xl:w-full"
          />
        </div>

        <div className="lg:w-1/2 w-full flex flex-col items-center">
          <div className="flex flex-col gap-8 mx-auto xl:w-[450px]">
            <p className="font-extrabold lg:text-6xl md:text-4xl text-3xl">
              <span className="text-blue100">Gosendeet</span>
              <br />
              <span className="text-blue100">Compare</span>
            </p>
            <p className="text-grey200 text-xl">
              Stop overpaying for deliveries. Compare multiple carriers in one
              view and pick the service that fits your budget and timeline.{" "}
            </p>

            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white text-md">
                <span className="text-green500 w-12 h-12 p-4 rounded-full flex justify-center items-center bg-green-100">
                  <DollarSign size={20} />
                </span>
                <div>
                  <p className="text-blue100 font-bold text-md">
                    Best Rate Guarantee
                  </p>
                  <span className="text-grey200 text-sm">
                    Save up to 40% on delivery costs by comparing real-time
                    quotes from local and international carriers.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white text-md">
                <span className="text-green500 w-12 h-12 p-4 rounded-full flex justify-center items-center bg-green-100">
                  <Zap size={20} />
                </span>
                <div>
                  <p className="text-blue100 font-bold text-md">
                    Instant Selection
                  </p>
                  <span className="text-grey200 text-sm">
                    Filter by speed, price, or rating. Book your preferred
                    carrier in under 60 seconds with one-tap payment.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white text-md">
                <span className="text-green500 w-12 h-12 p-4 rounded-full flex justify-center items-center bg-green-100">
                  <BadgeCheck size={20} />
                </span>
                <div>
                  <p className="text-blue100 font-bold text-md">
                    Verified Reliability
                  </p>
                  <span className="text-grey200 text-sm">
                    Every carrier on our platform is vetted for security and
                    performance. Read real reviews from actual customers.
                  </span>
                </div>
              </li>
            </ul>

            <Button className="bg-green1000 rounded-xl w-fit font-bold text-white shadow-[0px 25px 50px -12px #0D542B33]">
              Get Started Now <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compare;
