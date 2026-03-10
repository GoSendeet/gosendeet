import { Clock } from "lucide-react";

const CompletionsRate = () => {
  return (
    <>
      <div className="flex font-inter items-start justify-between w-full max-w-328 max-h-28 rounded-2xl shadow-sm p-3 md:p-6 bg-white">
        <div className="flex flex-col gap-2 md:gap-1">
          <span className="text-frch-text-gray font-light text-xs md:text-sm">Completions Rate</span>
          <span className="text-[#101828] font-bold text-sm md:text-lg">85%</span>
          <p className="text-frch-text-gray font-light text-xs md:text-sm">This Week</p>
        </div>
        <div className="bg-[#ECFDF5] p-1.5 md:p-2 rounded-md">
          <Clock size={13} color="#009966" className="md:hidden" />
          <Clock size={20} color="#009966" className="hidden md:block" />
        </div>
      </div>
    </>
  );
};

export default CompletionsRate;
