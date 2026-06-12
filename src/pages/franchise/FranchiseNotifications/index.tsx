import { CheckCheck } from "lucide-react";
import NotificationFeed from "./NotificationFeed";
import { type Notification } from "./NotificationRow";
import {
  useGetFranchiseNotifications,
  useMarkAllFranchiseNotificationsRead,
  useMarkFranchiseNotificationRead,
} from "@/queries/franchise/useFranchiseNotifications";
import type { FranchiseNotification } from "@/services/franchise";
import SupportPanel from "@/components/SupportPanel";

const formatNotificationTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const diffMs = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diffMs < minute) return "Just now";
  if (diffMs < hour) return `${Math.floor(diffMs / minute)}m ago`;
  if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;
  if (diffMs < 2 * day) return "Yesterday";

  return date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
};

const mapNotification = (item: FranchiseNotification): Notification => ({
  id: item.id,
  type: item.type,
  title: item.title,
  message: item.body,
  time: formatNotificationTime(item.createdAt),
  isUnread: item.unread,
  actionLabel: item.actionLabel,
  actionUrl: item.actionUrl,
});

const FranchiseNotifications = () => {
  const page = 1;
  const size = 20;
  const { data: notificationPage, isLoading } = useGetFranchiseNotifications(page, size);
  const { mutate: markAllRead, isPending: isMarkingAllRead } =
    useMarkAllFranchiseNotificationsRead(page, size);
  const { mutate: markRead } = useMarkFranchiseNotificationRead(page, size);

  const notifications = notificationPage?.content.map(mapNotification) ?? [];
  const unreadCount = notifications.filter((n) => n.isUnread).length;

  return (
    <>
      <div
        className="w-full h-36 max-w-328 lg:min-h-28 rounded-2xl p-6 pb-0 opacity-100 flex items-center justify-between"
        style={{
          background: "linear-gradient(90deg, #ECFDF5 0%, #FFFFFF 100%)",
        }}
      >
        <div className="flex flex-col items-start">
          <h1 className="text-sm lg:text-xl font-bold text-brand">
            Notifications
          </h1>
          <p className="text-gray-600 mt-2">
            {unreadCount > 0 ? (
              <>
                <span className="font-bold">{unreadCount} </span>
                {`unread notification${unreadCount > 1 ? "s" : ""}`}
              </>
            ) : (
              "No unread notifications"
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllRead()}
            disabled={isMarkingAllRead}
            className="flex items-center justify-between gap-3 cursor-pointer bg-white border border-gray-200 w-fit px-3 py-2 rounded-2xl hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <CheckCheck size={15} />
            <span className="text-sm text-frch-text-gray font-semibold flex items-center justify-between">
              {isMarkingAllRead ? "Marking..." : "Mark all read"}
            </span>
          </button>
        )}
      </div>

      <div className="mt-6 flex flex-col lg:flex-row item-center gap-4">
        <NotificationFeed
          notifications={isLoading ? [] : notifications}
          onMarkRead={(id) => markRead(id)}
        />

       <SupportPanel />
      </div>
    </>
  );
};

export default FranchiseNotifications;
