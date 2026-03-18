import { Truck, DollarSign, XCircle, TriangleAlert, Settings } from "lucide-react";


export type NotificationType =
  | "new_assignment"
  | "settlement_ready"
  | "decline_confirmed"
  | "quality_flag"
  | "payment_received"
  | "system_update";

export type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  isUnread?: boolean;
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "new_assignment",
    title: "New Assignment",
    message: "New delivery assignment GS-NJ75ZDW from Lekki to Ikeja. Pickup by 10:00 AM.",
    time: "3h ago",
    isUnread: true,
  },
  {
    id: "n2",
    type: "new_assignment",
    title: "New Assignment",
    message: "New delivery assignment GS-KL92MXP from Lagos Island to Ikeja. Pickup by 11:00 AM.",
    time: "2h ago",
    isUnread: true,
  },
  {
    id: "n3",
    type: "settlement_ready",
    title: "Settlement Ready",
    message: "Week 8 settlement of ₦103,800 is pending approval. Review your statement.",
    time: "4d ago",
    isUnread: true,
  },
  {
    id: "n4",
    type: "decline_confirmed",
    title: "Decline Confirmed",
    message: "You declined dispatch GS-STU901 (reason: Vehicle too small). No penalty applied.",
    time: "19h ago",
    isUnread: false,
  },
  {
    id: "n5",
    type: "quality_flag",
    title: "Quality Flag",
    message: "Delivery GS-LMN222 received a low rating (2/5). Please review and improve.",
    time: "Yesterday",
    isUnread: false,
  },
  {
    id: "n6",
    type: "payment_received",
    title: "Payment Received",
    message: "Week 7 payout of ₦92,800 has been credited to your bank account.",
    time: "18 Feb",
    isUnread: false,
  },
  {
    id: "n7",
    type: "system_update",
    title: "System Update",
    message: "GoSendeet app updated to v2.5. New features: photo proof improvements, faster navigation.",
    time: "15 Feb",
    isUnread: false,
  },
];

const typeConfig: Record <NotificationType, { icon: React.ElementType; iconColor: string; iconBg: string }> = {
  new_assignment:   { icon: Truck,          iconColor: "text-blue-500",    iconBg: "bg-blue-50" },
  settlement_ready: { icon: DollarSign,     iconColor: "text-emerald-500", iconBg: "bg-emerald-50" },
  decline_confirmed:{ icon: XCircle,        iconColor: "text-red-400",     iconBg: "bg-red-50" },
  quality_flag:     { icon: TriangleAlert,  iconColor: "text-amber-500",   iconBg: "bg-amber-50" },
  payment_received: { icon: DollarSign,     iconColor: "text-emerald-500", iconBg: "bg-emerald-50" },
  system_update:    { icon: Settings,       iconColor: "text-gray-400",    iconBg: "bg-gray-100" },
};

type Props = {
    item?: Notification;
}


const NotificationRow = ({ item = MOCK_NOTIFICATIONS[0] }: Props) => {
     const { icon: Icon, iconColor, iconBg } = typeConfig[item.type];
  return (
    <div className={`flex items-start gap-3.5 px-4 py-4 transition-colors hover:bg-gray-50/70 ${item.isUnread ? "bg-brand-light" : "bg-white"}`}>
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
        <Icon size={16} className={iconColor} />
      </div>

      {/* Body */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0 ">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-gray-800 truncate">{item.title}</p>
          {item.isUnread && (
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
          )}
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{item.message}</p>
      </div>

      {/* Time */}
      <span className="text-xs text-gray-400 whitespace-nowrap shrink-0 pt-0.5">{item.time}</span>
    </div>
  )
}

export default NotificationRow