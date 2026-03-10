import { Truck } from 'lucide-react';

const ActiveDeliveries = () => {
  return (
    <>
      <div className="flex font-inter items-start justify-between w-full max-w-328 min-h-28 rounded-2xl shadow-sm p-3 md:p-6 bg-white">
        <div className="flex flex-col gap-3 md:gap-1">
          <span className="text-frch-text-gray font-light text-xs md:text-sm">Active Deliveries</span>
          <span className="text-[#101828] font-bold text-sm md:text-lg">3</span>
        </div>
        <div className="bg-[#EFF6FF] p-1.5 md:p-2 rounded-md">
          <Truck size={13} color="#155DFC" className="md:hidden" />
          <Truck size={20} color="#155DFC" className="hidden md:block" />

        </div>
      </div>
    </>
  )
}

export default ActiveDeliveries