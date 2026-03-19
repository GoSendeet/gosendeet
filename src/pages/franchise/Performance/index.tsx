import OntimeDelivery from "./Statistics/OntimeDelivery";
import AverageRating from "./Statistics/AverageRating";
import Complaints from "./Statistics/Complaints";
import PerformanceInsights from "./PerformanceInsights";

const Performance = () => {
  return (
    <>
      <div
        className="w-full h-36 max-w-328 lg:min-h-28 rounded-2xl p-6 pb-0 opacity-100 flex flex-col gap-2"
        style={{
          background: "linear-gradient(90deg, #ECFDF5 0%, #FFFFFF 100%)",
        }}
      >
        <h1 className="text-sm lg:text-xl font-bold text-brand">Performance</h1>
        <p className="text-gray-600 mt-2">
          Your delivery quality metrics and trends
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-3 mt-6">
        <OntimeDelivery />
        <AverageRating />
        <Complaints />
      </div>

      <div className="mt-5">
        <PerformanceInsights />
      </div>
    </>
  );
};

export default Performance;
