import { TrendingUp } from "lucide-react";

const TodayEarnings = () => {
  return (
    <>
      <div className="flex font-inter items-start justify-between w-full max-w-328 min-h-28 rounded-2xl shadow-sm p-3 md:p-6 bg-white">
        <div className="flex flex-col gap-3 md:gap-1">
          <span className="text-frch-text-gray font-light text-xs md:text-sm">Today's Earnings</span>
          <span className="text-[#101828] font-bold text-sm md:text-lg">#45,200</span>
        </div>
        <div className="bg-[#ECFDF5] p-1.5 md:p-2 rounded-md">
          <TrendingUp size={13} color="#009966" className="md:hidden" />
          <TrendingUp size={20} color="#009966" className="hidden md:block" />
        </div>
      </div>
    </>
  );
};

export default TodayEarnings;
