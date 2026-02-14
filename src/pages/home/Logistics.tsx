import enterprise from "@/assets/images/enterprise.png";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Headphones,
  Table,
  Wallet,
} from "lucide-react";
const Logistics = () => {
  return (
    <div className="relative w-full bg-white md:px-20 px-6 md:py-20 py-10 font-arial">
      <div className="flex lg:flex-row lg:gap-0 gap-12 flex-col justify-between items-center">
        <div className="lg:w-1/2 w-full flex flex-col">
          <div className="flex flex-col gap-8 mx-auto">
            <div className="flex md:flex-row flex-col justify-start items-center gap-4 mb-6 md:mb-8">
              <p className="text-center text-gray-500 bg-gray-100 w-fit px-3 py-1 rounded-full font-inter font-bold text-xs uppercase tracking-wider">
                TRUSTED BY 500+ BUSINESSES
              </p>
              <p className="text-center text-green800 bg-green-100 w-fit px-3 py-1 rounded-full font-inter font-bold text-xs uppercase tracking-wider">
                OPTIMIZED FOR BUSINESS
              </p>
            </div>
            <p className="font-extrabold font-arial lg:text-[60px] md:text-4xl text-3xl xl:w-[575px]">
              <span className="text-blue100 tracking-tighter">
                Logistics Infrastructure <br /> for Your Business
              </span>
            </p>
            <p className="text-grey200 text-xl xl:w-[500px]">
              Power your commerce with enterprise-grade delivery tools. From
              high-growth startups to established retailers, we provide the
              backbone for your operations.
            </p>

            <ul className="space-y-4 xl:w-[500px]">
              <li className="flex items-start gap-3 text-white text-md">
                <span className="text-gray-500 w-12 h-12 p-4 rounded-xl flex justify-center items-center bg-gray-100">
                  <Table size={20} />
                </span>
                <div>
                  <p className="text-blue100 font-bold text-md">
                    Bulk Order Management
                  </p>
                  <span className="text-grey200 text-sm">
                    Scale effortlessly. Upload thousands of deliveries via CSV
                    or connect directly through our robust API endpoints.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white text-md">
                <span className="text-gray-500 w-12 h-12 p-4 rounded-xl flex justify-center items-center bg-gray-100">
                  <Wallet size={20} />
                </span>
                <div>
                  <p className="text-blue100 font-bold text-md">
                    Business Wallet & Analytics
                  </p>
                  <span className="text-grey200 text-sm">
                    Consolidated billing with deep cost insights. Track spending
                    patterns and delivery performance in real-time.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-white text-md">
                <span className="text-gray-500 w-12 h-12 p-4 rounded-xl flex justify-center items-center bg-gray-100">
                  <Headphones size={20} />
                </span>
                <div>
                  <p className="text-blue100 font-bold text-md">
                    Dedicated Account Support
                  </p>
                  <span className="text-grey200 text-sm">
                    Direct access to logistics experts. We help you optimize
                    your supply chain and resolve issues before they arise.
                  </span>
                </div>
              </li>
            </ul>

            <Button className="bg-green1000 rounded-xl w-fit font-bold text-white shadow-[0px 25px 50px -12px #0D542B33]">
              Open a Business Account <ArrowRight />
            </Button>
          </div>
        </div>

        <div className="lg:w-1/2 w-full flex flex-col items-center justify-center gap-8">
          <img
            src={enterprise}
            alt="compare"
            className="lg:w-[400px] xl:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default Logistics;
