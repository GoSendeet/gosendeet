import bell from "@/assets/images/no-notifications-empty-state.png";
import { Button } from "@/components/ui/button";
import { useGetAllNotifications } from "@/queries/user/useGetUserNotifications";
import { Spinner } from "@/components/Spinner";
import { cn, timeAgo } from "@/lib/utils";
import { LuMailCheck, LuTrash } from "react-icons/lu";
import { useEffect, useState } from "react";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { PaginationComponent } from "@/components/Pagination";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteNotifications,
  updateNotificationStatus,
} from "@/services/notifications";
import { toast } from "sonner";
import SupportPanel from "@/components/SupportPanel";

type DashboardNotification = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  status?: string;
};

const isUnreadNotification = (status?: string) =>
  status?.toLowerCase() === "unread";

const Notifications = ({ setActiveTab }: any) => {
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);
  const { data, isLoading, isSuccess, isError } =
    useGetAllNotifications(currentPage);

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages]);
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: updateNotificationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const update = (id: string) => {
    mutate({ ids: [id] });
  };

  const notifications: DashboardNotification[] = data?.data?.content ?? [];
  const allIds = notifications.map((item) => item.id);
  const unreadIds = notifications
    .filter((item) => isUnreadNotification(item.status))
    .map((item) => item.id);

  const markAllAsRead = () => {
    if (!unreadIds.length) return;
    mutate({ ids: unreadIds });
  };

  const { mutate: deleteFn } = useMutation({
    mutationFn: deleteNotifications,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["notifications"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const deleteAction = (id: string) => {
    deleteFn({ ids: [id] });
  };

  const deleteAll = () => {
    deleteFn({ ids: allIds });
  };

  return (
    <div>
      <div className="flex justify-between md:items-center mb-4 md:px-4">
        <h2 className="font-clash font-semibold text-brand text-[20px]">Notifications</h2>
      </div>

      <div className="flex lg:flex-row flex-col gap-8 mb-10">
        {isLoading && !isSuccess && (
          <div className="h-[50vh] w-full flex items-center justify-center">
            <Spinner />
          </div>
        )}

        {isError && !isLoading && (
          <div className="h-[50vh] w-full flex justify-center flex-col items-center">
            <p className="font-semibold font-inter text-xl text-center">
              There was an error getting the data
            </p>
          </div>
        )}

        {!isLoading && isSuccess && data && (
          <div className="lg:w-[60%] min-h-[370px] bg-white xl:p-10 py-6 px-2 rounded-3xl">
            {notifications.length > 0 ? (
              <div className="flex flex-col gap-6 text-sm ">
                <div className="flex justify-end gap-4 mb-4">
                  <button
                    type="button"
                    disabled={!unreadIds.length}
                    className="text-sm font-medium text-brand hover:font-semibold text-right cursor-pointer disabled:cursor-not-allowed disabled:text-neutral400"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </button>
                  <button
                    type="button"
                    className="text-sm font-medium text-red-500 hover:font-semibold text-right cursor-pointer"
                    onClick={deleteAll}
                  >
                    Delete all
                  </button>
                </div>
                {notifications.map((item) => {
                  const isUnread = isUnreadNotification(item.status);

                  return (
                  <div className="flex flex-col gap-1" key={item.id}>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-clash font-semibold">{item.title}</h3>
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                          isUnread
                            ? "bg-brand-light text-brand"
                            : "bg-neutral100 text-neutral500",
                        )}
                      >
                        {isUnread ? "Unread" : "Read"}
                      </span>
                    </div>
                    <p className="text-neutral500 mr-2">
                      {timeAgo(item.createdAt)}
                    </p>
                    <div
                      className={cn(
                        isUnread
                          ? "border-l-brand bg-brand-light"
                          : "border-l-neutral300 bg-white",
                        "px-4 py-3 flex items-center gap-4 justify-between border-l-3 rounded"
                      )}
                    >
                      <p className="text-neutral600">{item.message}</p>
                      <p className="flex items-center gap-2 cursor-pointer">
                        {isUnread && (
                          <LuMailCheck
                            size={18}
                            className="text-purple500"
                            onClick={() => update(item.id)}
                          />
                        )}
                        <LuTrash
                          size={18}
                          className="text-red-500"
                          onClick={() => deleteAction(item.id)}
                        />
                      </p>
                    </div>
                  </div>
                  );
                })}

                <PaginationComponent
                  lastPage={data?.data?.page?.totalPages}
                  currentPage={currentPage}
                  handlePageChange={updatePage}
                />
              </div>
            ) : (
              <div className="flex flex-col justify-center items-center text-center">
                <img src={bell} alt="bell" className="w-[200px]" />
                <p className="font-clash font-semibold text-md my-6">
                  You have no notifications yet!
                </p>
                <p className="text-neutral600 text-sm mb-1">
                  Looks like you're all caught up.
                </p>
                <p className="text-neutral600 text-sm mb-1">
                  Check back later for new notifications
                </p>
                <hr className="border border-neutral200 my-8 w-full" />

                <p className="text-neutral600 text-sm mb-4">
                  Ready to send something special or track a delivery?
                </p>
                <Button onClick={() => setActiveTab("overview")} className="bg-brand">
                  Book a delivery
                </Button>
              </div>
            )}
          </div>
        )}

        <SupportPanel />
      </div>
    </div>
  );
};

export default Notifications;
