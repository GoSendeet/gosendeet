import { UpdateProgressModal } from "@/pages/admin/Orders/modals/UpdateProgressModal";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import {
  useGetAllBookings,
  useGetBookingsStats,
} from "@/queries/user/useGetUserBookings";
import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";
import { Spinner } from "@/components/Spinner";
import { cn, formatDateTime, formatStatus } from "@/lib/utils";
import { statusClasses } from "@/constants";
import { PaginationComponent } from "@/components/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRangePicker } from "@/components/DateRangePicker.tsx";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import MobileCard from "@/components/MobileCard";

const Orders = ({ userId }: { userId: any }) => {
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);
  const [bookingStatus, setBookingStatus] = useState("");
  const [packageTypeId, setPackageTypeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const { data: bookingStats } = useGetBookingsStats({ senderId: userId });
  const { data: packageTypes } = useGetPackageType({ minimize: true });
  const packages = packageTypes?.data;

  const [range, setRange] = useState<DateRange | undefined>();
  const startStr = range?.from ? format(range.from, "yyyy-MM-dd") : null;
  const endStr = range?.to ? format(range.to, "yyyy-MM-dd") : null;

  // Reset pagination when status changes
  useEffect(() => {
    updatePage(1); // Reset to page 1
  }, [bookingStatus, debouncedSearchTerm, startStr, endStr]); // Reset when filters change

  const { data, isLoading, isSuccess, isError } = useGetAllBookings({
    page: currentPage,
    senderId: userId,
    bookingStatus,
    search: debouncedSearchTerm,
    packageTypeId,
    startDate: startStr || "",
    endDate: endStr || "",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 1 second after user stops typing

    return () => {
      clearTimeout(handler); // cancel timeout if user types again
    };
  }, [searchTerm]);

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages]);
  const [bookingData, setBookingData] = useState({});
  const [bookingId, setBookingId] = useState("");
  const [orderProgress, setOrderProgress] = useState("");
  const [orderStatus, setOrderStatus] = useState("");

  const [activeStatusTab, setActiveStatusTab] = useState("All");
  const [open, setOpen] = useState(false);

  const statusTabs = [
    { label: "All", status: "", count: bookingStats?.data?.totalBookings ?? 0 },
    {
      label: "Active",
      status: "PENDING",
      count: bookingStats?.data?.activeBookings ?? 0,
    },
    {
      label: "Completed",
      status: "DELIVERED",
      count: bookingStats?.data?.deliveredBookings ?? 0,
    },
    {
      label: "Cancelled",
      status: "CANCELLED",
      count: bookingStats?.data?.cancelledBookings ?? 0,
    },
  ];

  // Popover is now uncontrolled; no need for activeModalId

  return (
    <div>
      <div className="flex xl:flex-row flex-col justify-between xl:items-center gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setActiveStatusTab(tab.label);
                setBookingStatus(tab.status);
              }}
              className={`rounded-full px-4 py-2 text-sm transition-colors font-medium cursor-pointer ${
                activeStatusTab === tab.label
                  ? "bg-neutral300 text-neutral800 "
                  : "bg-neutral200 text-neutral500"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 border-2 rounded-lg h-[40px] px-2 py-2">
            <IoSearchOutline className="text-neutral500" />
            <input
              type="text"
              role="search"
              className="border-0 outline-0 w-[150px] text-sm text-neutral600"
              placeholder="Search order"
              onChange={(e: any) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <div>
            {/* Select options */}
            <Select
              onValueChange={(value) =>
                value === "all" ? setPackageTypeId("") : setPackageTypeId(value)
              }
            >
              <SelectTrigger className="h-[40px] rounded-lg border-2 min-w-[150px] max-w-[300px]">
                <SelectValue placeholder="Package Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {packages?.map((item: any) => (
                  <SelectItem value={item.id} key={item.id}>
                    {item?.name} ({item?.maxWeight} {item?.weightUnit})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DateRangePicker value={range} onChange={setRange} />
        </div>
      </div>

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

      {!isLoading && isSuccess && data && data?.data?.content?.length > 0 && (
        <div className="overflow-x-auto">
          {/* mobile card layout */}
          <div className="md:hidden">
            {data?.data?.content?.map((item: any, index: number) => (
              <MobileCard key={index}>
                <div className="flex justify-end mb-1">
                  <Popover
                    onOpenChange={(open) => open && setBookingData(item)}
                  >
                    <PopoverTrigger asChild>
                      <button className="border p-1 rounded-md border-neutral200">
                        <BsThreeDotsVertical
                          size={20}
                          className="p-1 cursor-pointer"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-1">
                      <Link
                        to={`/admin-dashboard/order/${index}`}
                        state={{ bookingData: bookingData }}
                      >
                        <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                          View full details
                        </p>
                      </Link>
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => {
                          setOpen(true);
                          setBookingId(item?.id);
                          setOrderProgress(item?.currentProgress);
                          setOrderStatus(item.status);
                        }}
                      >
                        Update progress
                      </p>
                      <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                        Refund
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Tracking #
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.trackingNumber}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Courier
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.companyName}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Category
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.packageType}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Parcel Weight
                  </span>
                  <span className="truncate ml-2 text-sm">{`${item?.weight} ${item?.weightUnit} | ${item?.length}x${item?.width}x${item?.height} ${item?.dimensionsUnit}`}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Pickup Created
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {formatDateTime(item?.bookingDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    {" "}
                    Status
                  </span>
                  <span
                    className={cn(
                      statusClasses[item?.status] ??
                        "bg-gray-100 text-gray-800", // fallback if status not found
                      "px-2 py-1 w-fit font-medium rounded-2xl text-xs",
                    )}
                  >
                    {formatStatus(item?.status)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-brand text-sm">
                    {" "}
                    Progress
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.currentProgress}
                  </span>
                </div>
              </MobileCard>
            ))}
          </div>

          {/* Desktop view */}
          <div className="hidden md:block min-w-[1100px] w-full relative">
            <div className="flex justify-between text-left px-3 xl:px-4 py-4 text-md font-inter font-semibold bg-brand-light w-full">
              <span className="w-[1%] mr-4">
                <input type="checkbox" name="" id="" className="mt-[2px]" />
              </span>
              <span className="flex-1">Tracking Number</span>
              <span className="flex-1">Courier</span>
              <span className="flex-1">Category</span>
              <span className="flex-1">Parcel Weight</span>
              <span className="flex-1">Pickup Created</span>
              <span className="w-[10%]">Status</span>
              <span className="w-[10%]">Progress</span>
              <span className="w-[2%]"></span>
            </div>

            {data?.data?.content?.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative h-[60px] bg-white px-3 xl:px-4 text-sm flex items-center border-b border-b-neutral300 
                    hover:bg-brand-light`}
                >
                  <span className="w-[1%] mr-4">
                    <input type="checkbox" name="" id="" className="mt-1" />
                  </span>
                  <div className="flex-1">
                    <p>{item?.trackingNumber}</p>
                  </div>
                  <div className="flex-1">
                    <p>{item?.companyName}</p>
                  </div>
                  <div className="flex-1">
                    <p>{item?.packageType}</p>
                  </div>
                  <div className="flex-1">
                    <p>{`${item?.weight} ${item?.weightUnit} | ${item?.length}x${item?.width}x${item?.height} ${item?.dimensionsUnit}`}</p>
                  </div>
                  <div className="flex-1">
                    <p>{formatDateTime(item?.bookingDate)} </p>
                  </div>
                  <div className="w-[10%]">
                    <p
                      className={cn(
                        statusClasses[item?.status] ??
                          "bg-gray-100 text-gray-800", // fallback if status not found
                        "px-2 py-1 w-fit font-medium rounded-2xl text-xs",
                      )}
                    >
                      {formatStatus(item?.status)}
                    </p>
                  </div>
                  <div className="w-[10%]">{item?.currentProgress}</div>

                  <Popover
                    onOpenChange={(open) => open && setBookingData(item)}
                  >
                    <PopoverTrigger asChild>
                      <button className="border p-1 rounded-md border-neutral200">
                        <BsThreeDotsVertical
                          size={20}
                          className="p-1 cursor-pointer"
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-fit p-1">
                      <Link
                        to={`/admin-dashboard/order/${item?.id}`}
                        state={{ bookingData: bookingData }}
                      >
                        <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                          View full details
                        </p>
                      </Link>
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => {
                          setOpen(true);
                          setBookingId(item?.id);
                          setOrderProgress(item?.currentProgress);
                          setOrderStatus(item.status);
                        }}
                      >
                        Update progress
                      </p>
                      <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                        Refund
                      </p>
                    </PopoverContent>
                  </Popover>
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

      {data && data?.data?.content?.length === 0 && !isLoading && isSuccess && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There are no results
          </p>
        </div>
      )}

      <UpdateProgressModal
        open={open}
        setOpen={setOpen}
        bookingId={bookingId}
        progress={orderProgress}
        status={orderStatus}
      />
    </div>
  );
};

export default Orders;
