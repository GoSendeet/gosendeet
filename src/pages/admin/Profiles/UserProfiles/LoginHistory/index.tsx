import { useEffect, useState } from "react";
import { formatTimestampToReadable } from "@/lib/utils";
import { useGetLoginHistory } from "@/queries/admin/useGetAdminProfiles";
import { DateRangePicker } from "@/components/DateRangePicker.tsx";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { PaginationComponent } from "@/components/Pagination";
import MobileCard from "@/components/MobileCard";

const LoginHistory = ({ userId }: { userId: string }) => {
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);

  const [range, setRange] = useState<DateRange | undefined>();
  const startStr = range?.from ? format(range.from, "yyyy-MM-dd") : "";
  const endStr = range?.to ? format(range.to, "yyyy-MM-dd") : "";

  // Reset pagination when status changes
  useEffect(() => {
    updatePage(1); // Reset to page 1
  }, [startStr, endStr]); // Reset when filters change

  const { data } = useGetLoginHistory(userId, startStr, endStr, currentPage);

  const login = data?.data?.content;

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages]);
  return (
    <div>
      <div className="flex flex-row md:justify-end gap-4 mb-6">
        <DateRangePicker value={range} onChange={setRange} />
      </div>
      {login && login?.length > 0 && (
        <div className="overflow-x-auto">
          {/* mobile cards view */}
          <div className="md:hidden">
            {login?.map((item: any, index: number) => (
              <MobileCard key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Device #
                  </span>
                  <span className="truncate ml-2 text-sm">{item?.device}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Browser
                  </span>
                  <span className="truncate ml-2 text-sm">{item?.browser}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Date & Time
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {formatTimestampToReadable(item.createdAt)}
                  </span>
                </div>
              </MobileCard>
            ))}
          </div>
            {/* desktop table view */}
          <div className="hidden md:block min-w-[500px] w-full relative">
            <div className="flex justify-between text-left px-3 xl:px-4 py-4 text-md font-inter font-semibold bg-brand-light w-full">
              <span className="md:w-[50%] w-[40%]">Device</span>
              <span className="flex-1">Browser</span>
              <span className="flex-1">Date &Time</span>
            </div>

            {login?.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative h-[60px] bg-white px-3 xl:px-4 text-sm flex items-center ${
                    index === 0 ? "border-b-0" : "border-b border-b-neutral300"
                  } hover:bg-brand-light`}
                >
                  <div className="md:w-[50%] w-[40%]">
                    <p>{item.device}</p>
                  </div>
                  <div className="flex-1">
                    <p>{item.browser}</p>
                  </div>
                  <div className="flex-1">
                    <p>{formatTimestampToReadable(item.createdAt)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <PaginationComponent
            lastPage={data?.data?.page?.totalPages}
            currentPage={currentPage}
            handlePageChange={updatePage}
          />
        </div>
      )}

      {login && login?.length === 0 && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There are no results
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginHistory;
