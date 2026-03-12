import { Package, CheckCircle, ArrowRight, Clock } from "lucide-react";

const activities: {
  id: number;
  type: ActivityType;
  label: string;
  code: string;
  route: string | null;
  detail: string | null;
  time: string;
}[] = [
  {
    id: 1,
    type: "assignment",
    label: "New assignment",
    code: "GS-NJ75ZDW",
    route: "Lekki → Ikeju",
    detail: null,
    time: "2 min ago",
  },
  {
    id: 2,
    type: "assignment",
    label: "New assignment",
    code: "GS-KL92MXP",
    route: "Lagos Island → Ikeju",
    detail: null,
    time: "15 min ago",
  },
  {
    id: 3,
    type: "pickup",
    label: "Picked up",
    code: "GS-ABC123",
    route: "En route to Ikeju",
    detail: null,
    time: "1 hr ago",
  },
  {
    id: 4,
    type: "completed",
    label: "Completed",
    code: "GS-JKL012",
    route: null,
    detail: "₦3,200 earned",
    time: "Yesterday",
  },
  {
    id: 5,
    type: "completed",
    label: "Completed",
    code: "GS-MNO345",
    route: null,
    detail: "₦5,500 earned",
    time: "Yesterday",
  },
];

const iconConfig = {
  assignment: { icon: Package, bg: "bg-orange-100", color: "text-orange-500" },
  pickup: { icon: ArrowRight, bg: "bg-blue-100", color: "text-blue-500" },
  completed: { icon: CheckCircle, bg: "bg-green-100", color: "text-green-500" },
} satisfies Record<
  string,
  { icon: React.ElementType; bg: string; color: string }
>;

type ActivityType = keyof typeof iconConfig;

export default function RecentActivity() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-800">
          Recent Activity
        </h2>
        <button className="flex items-center gap-1 text-sm text-emerald-500 hover:text-emerald-600 font-medium transition-colors">
          View All <ArrowRight size={14} />
        </button>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-100">
        {activities.map((item) => {
          const { icon: Icon, bg, color } = iconConfig[item.type];
          return (
            <div
              key={item.id}
              className="flex items-center py-3 gap-1 justify-between"
            >
              {/* Icon + Label */}
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${bg}`}>
                  <Icon size={15} className={color} />
                </div>
              

                <div className="flex flex-col gap-1">
                    <span className="flex flex-col md:flex-row gap-2 text-xs font-semibold  md:text-sm text-gray-600">
                        {item.label}{" "}
                        <span className="text-emerald-500 font-medium">
                            {item.code}
                        </span>
                    </span>

                    {/* Route or Detail */}
                    <div className="flex item-center text-xs md:text-sm text-gray-500 text-center">
                    {item.route || item.detail || "—"}
                    </div>
                </div>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1 text-xs text-gray-400 min-w-17.5">
                <Clock size={11} />
                {item.time}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
