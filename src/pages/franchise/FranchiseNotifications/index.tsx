import { useState } from "react";
import { CheckCheck } from "lucide-react";
import NotificationFeed from "./NotificationFeed";
import { type Notification, MOCK_NOTIFICATIONS } from "./NotificationRow";
import CusstomerSupportCard from "@/components/ui/CusstomerSupportCard";

const FranchiseNotifications = () => {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => n.isUnread).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isUnread: false })));
  };

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
          <div
            onClick={handleMarkAllRead}
            className="flex items-center justify-between gap-3 cursor-pointer bg-white border border-gray-200 w-fit px-3 py-2 rounded-2xl hover:bg-gray-50"
          >
            <CheckCheck size={15} />
            <span className="text-sm text-frch-text-gray font-semibold flex items-center justify-between">
              Mark all read
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-col lg:flex-row item-center gap-4">
        <NotificationFeed notifications={notifications} />

        <CusstomerSupportCard />
      </div>
    </>
  );
};

export default FranchiseNotifications;
