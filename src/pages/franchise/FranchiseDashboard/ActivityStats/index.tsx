import ActiveDeliveries from "./ActiveDeliveries"
import CompletionsRate from "./CompletionsRate"
import PendingAssignments from "./PendingAssignments"
import TodayEarnings from "./TodayEarnings"




// const activityStats = [
//     {
//         label: "Today's Earnings",
//         value: 45200,
//         icon: <TrendingUp size={20} color="#009966" />
//     },
//     {
//         label: "Active Deliveries",
//         value: 3,
//         icon: <Truck size={20} color="#155DFC" />
//     },
//     {
//         label: "Pending Assignments",
//         value: 2,
//         icon: <Clock size={20} color="#E17100" />
//     },
//     {
//         label: "Completion Rate",
//         value: "95% This Week",
//         icon: <Clock size={20} color="#009966" />
//     },
// ];

// const bgColorsMap = {
//     "Today's Earnings": "bg-[#ECFDF5]",
//     "Active Deliveries": "bg-[#EFF6FF]",
//     "Pending Assignments": "bg-[#FFFBEB]",
//     "Completion Rate": "bg-[#ECFDF5]"
// }

const index = () => {
  return (
    <div className='w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4'>
        <TodayEarnings />
        <ActiveDeliveries />
        <PendingAssignments />
        <CompletionsRate />
    </div>
  )
}

export default index