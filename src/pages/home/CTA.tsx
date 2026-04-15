import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ContactSalesDialog from "@/components/ContactSalesDialog";

const CTA = () => {
  return (
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
            <Link
              to="/signup"
              className="bg-white py-2.5 px-5 rounded-full text-black md:w-fit w-full font-bold"
            >
              <p className="flex items-center justify-between gap-2">
                Get Started Now
                <ArrowRight size={20} />
              </p>
            </Link>
            <ContactSalesDialog
              triggerLabel="Contact Sales"
              triggerClassName="text-white hover:text-white font-bold bg-transparent border border-grey200 rounded-full px-5 py-2.5 md:w-fit w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTA;
