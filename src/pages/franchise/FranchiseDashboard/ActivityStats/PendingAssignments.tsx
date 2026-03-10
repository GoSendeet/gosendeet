import { Clock } from 'lucide-react'

const PendingAssignments = () => {
  return (
    <>
      <div className="flex font-inter items-start justify-between w-full max-w-328 min-h-28 rounded-2xl shadow-sm p-3 md:p-6 bg-white">
        <div className="flex flex-col gap-3 md:gap-1">
          <span className="text-frch-text-gray font-light text-xs md:text-sm">Pending Assignments</span>
          <span className="text-[#101828] font-bold text-sm md:text-lg">5</span>
        </div>
        <div className="bg-[#FFFBEB] p-1.5 md:p-2 rounded-md">
          <Clock size={13} color="#E17100" className="md:hidden" />
          <Clock size={20} color="#E17100" className="hidden md:block" />
        </div>
      </div>
    </>
  )
}

export default PendingAssignments