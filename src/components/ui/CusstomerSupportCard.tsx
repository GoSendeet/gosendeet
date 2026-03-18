import { RxExternalLink } from "react-icons/rx";

const CusstomerSupportCard = () => {
  return (
    <div className="lg:w-full bg-white xl:p-10 py-6 px-4 border border-gray-100 shadow-sm rounded-3xl">
      <h3 className="text-md font-clash font-semibold text-brand">
        Customer Support
      </h3>
      <p className="my-6 text-sm text-neutral600">
        Need help with your shipment, costing or anything at all?
      </p>

      <div className="mb-4">
        <button className="flex items-center gap-2 cursor-pointer font-medium bg-brand border border-neutral300 rounded-full px-4 py-3 outline-neutral300">
          <RxExternalLink className="text-white text-xl" />
          <span className="text-white">Browse our FAQs</span>
        </button>
      </div>
      <div>
        <button className="flex items-center gap-2 cursor-pointer font-medium bg-brand border border-neutral300 rounded-full px-4 py-3 outline-neutral300">
          <RxExternalLink className="text-white text-xl" />
          <span className="text-white">Contact our support</span>
        </button>
      </div>
    </div>
  );
};

export default CusstomerSupportCard;
