import { Settings } from "lucide-react";
import NotificationRow, { type Notification } from "./NotificationRow";

type NotificationFeedProps = {
  notifications?: Notification[];
};

const NotificationFeed = ({ notifications }: NotificationFeedProps) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm max-h-100 overflow-y-scroll w-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-emerald-600">
      {/* List */}
      <div className="divide-y divide-gray-100">
        {!notifications?.length ? (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Settings size={28} className="text-gray-200" />
            <p className="text-sm text-gray-400">No notifications yet</p>
          </div>
        ) : (
          notifications.map((item) => (
            <NotificationRow key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationFeed;
