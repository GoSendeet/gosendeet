import { RxExternalLink } from "react-icons/rx";
import { Link } from "react-router-dom";
import openChatwootChat from "@/lib/openChatwootChat";

const SupportPanel = () => {
  
  return (
    <>
      <div className="lg:w-[40%] bg-white xl:p-10 py-6 px-2 rounded-3xl">
        <h3 className="text-md font-clash font-semibold text-brand">
          Customer Support
        </h3>
        <p className="my-6 text-sm text-neutral600">
          Need help with your shipment, costing or anything at all?
        </p>

        <div className="mb-4">
          <Link
            to="/faq"
            className="flex items-center gap-2 w-fit font-medium bg-brand border border-neutral300 rounded-full px-4 py-3 outline-neutral300"
          >
            <RxExternalLink className="text-white text-xl" />
            <span className="text-white">Browse our FAQs</span>
          </Link>
        </div>
        <div>
          <button
            className="flex items-center gap-2 font-medium cursor-pointer bg-brand border border-neutral300 rounded-full px-4 py-3 outline-neutral300"
            onClick={openChatwootChat}
          >
            <RxExternalLink className="text-white text-xl" />
            <span className="text-white">Contact our support</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SupportPanel;
