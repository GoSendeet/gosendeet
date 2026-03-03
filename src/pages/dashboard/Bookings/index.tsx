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
import { LuDownload } from "react-icons/lu";
import { BookingDetails } from "./details";
import { useGetAllBookings } from "@/queries/user/useGetUserBookings";
import { Spinner } from "@/components/Spinner";
import { cn, formatDateTime, formatStatus } from "@/lib/utils";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { PaginationComponent } from "@/components/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MobileCard from "@/components/MobileCard";
import { statusClasses, statusOptions } from "@/constants";
import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";
import { DateRangePicker } from "@/components/DateRangePicker.tsx";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const Bookings = () => {
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);
  const [bookingStatus, setBookingStatus] = useState("");
  const [packageTypeId, setPackageTypeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { data: packageTypes } = useGetPackageType({ minimize: true });
  const packages = packageTypes?.data;
  const userId = sessionStorage.getItem("userId") || "";
  const [range, setRange] = useState<DateRange | undefined>();
  const startStr = range?.from ? format(range.from, "yyyy-MM-dd") : "";
  const endStr = range?.to ? format(range.to, "yyyy-MM-dd") : "";
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Reset pagination when status changes
  useEffect(() => {
    updatePage(1); // Reset to page 1
  }, [bookingStatus, packageTypeId, debouncedSearchTerm, startStr, endStr]); // Reset when filters change

  const { data, isLoading, isSuccess, isError } = useGetAllBookings({
    page: currentPage,
    bookingStatus,
    search: debouncedSearchTerm,
    packageTypeId,
    senderId: userId,
    startDate: startStr,
    endDate: endStr,
  });

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages]);
  const [bookingData, setBookingData] = useState({});
  // removed activeModalId state; popover is now uncontrolled
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 1 second after user stops typing

    return () => {
      clearTimeout(handler); // cancel timeout if user types again
    };
  }, [searchTerm]);

  return (
    <div className="md:px-4">
      <h2 className="font-clash font-semibold text-[20px] text-brand mb-4">
        Bookings
      </h2>
      <div className="flex lg:flex-row flex-col justify-between lg:items-center gap-4 mb-6">
        <p className="text-sm text-neutral600">
          This contains all your shipment orders
        </p>
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
                value === "all" ? setBookingStatus("") : setBookingStatus(value)
              }
            >
              <SelectTrigger className="bg-white h-[40px] rounded-lg border-2 min-w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {statusOptions?.map((item, index) => (
                  <SelectItem
                    value={item.value}
                    key={index}
                    className="focus:bg-brand-light"
                  >
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                  <SelectItem
                    value={item.id}
                    key={item.id}
                    className="focus:bg-brand-light"
                  >
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
      {/* The table section */}
      {!isLoading && isSuccess && data && data?.data?.content?.length > 0 && (
        <div className="overflow-x-auto">
          {/* Mobile card layout */}
          <div className="md:hidden">
            {data?.data?.content?.map((item: any, index: number) => (
              <MobileCard key={index}>
                <div className="flex justify-between items-center mb-2">
                  <p
                    className={cn(
                      statusClasses[item.status] ?? "bg-gray-100 text-gray-800",
                      "px-2 py-1 w-fit font-medium rounded-2xl text-xs",
                    )}
                  >
                    {formatStatus(item?.status)}
                  </p>
                  <Popover
                    onOpenChange={(open) => {
                      if (open) setBookingData(item);
                    }}
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
                      <BookingDetails
                        // setActiveModalId={setActiveModalId}
                        // setIsDialogOpen={setIsDialogOpen}
                        bookingData={bookingData}
                      />
                      <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                        <LuDownload size={18} /> Download{" "}
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
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-brand text-sm">
                    Courier
                  </span>
                  <span className="truncate ml-2 text-sm">
                    {item?.companyName}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-brand text-sm">
                    Category
                  </span>
                  <span className="ml-2 text-neutral600 text-sm">
                    {item?.packageType}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-brand text-sm">Weight</span>
                  <span className="ml-2 text-sm">{`${item.weight} ${item.weightUnit}`}</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-brand text-sm">
                    Dimensions
                  </span>
                  <span className="ml-2 text-sm">{`${item.length}x${item.width}x${item.height} ${item.dimensionsUnit}`}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Created
                  </span>
                  <span className="ml-2 text-sm">
                    {formatDateTime(item?.bookingDate)}
                  </span>
                </div>
              </MobileCard>
            ))}
          </div>

          {/* Desktop table layout */}
          <div className="hidden md:block">
            <div className="min-w-[1200px] w-full">
              <div className="flex justify-between text-brand text-left px-3 xl:px-4 py-4 text-md font-clash font-semibold bg-brand-light w-full">
                <span className="w-[1%] mr-4">
                  <input type="checkbox" name="" id="" className="mt-[2px]" />
                </span>
                <span className="flex-1 text-brand">Tracking Number</span>
                <span className="flex-1 text-brand">Courier</span>
                <span className="flex-1 text-brand">Category</span>
                <span className="flex-1 text-brand">Parcel Weight</span>
                <span className="flex-1 text-brand">Pickup Created</span>
                <span className="w-[9%] text-brand">Status</span>
                <span className="w-[2%] text-brand"></span>
              </div>
              {data?.data?.content?.map((item: any, index: number) => (
                <div
                  key={index}
                  className={`relative h-[60px] bg-white px-3 xl:px-4 text-sm flex items-center border-b border-b-neutral300 hover:bg-brand-light`}
                >
                  <span className="w-[1%] mr-4">
                    <input type="checkbox" name="" id="" className="mt-1" />
                  </span>
                  <div className="flex-1 text-left">
                    <p>{item?.trackingNumber}</p>
                  </div>
                  <div className="flex-1">
                    <p className="truncate">{item?.companyName}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-neutral600">{item?.packageType}</p>
                  </div>
                  <div className="flex-1">{`${item.weight} ${item.weightUnit} | ${item.length}x${item.width}x${item.height} ${item.dimensionsUnit}`}</div>
                  <div className="flex-1">
                    {formatDateTime(item?.bookingDate)}
                  </div>
                  <div className="w-[9%]">
                    <p
                      className={cn(
                        statusClasses[item.status] ??
                          "bg-gray-100 text-gray-800", // fallback if status not found
                        "px-2 py-1 w-fit font-medium rounded-2xl text-xs",
                      )}
                    >
                      {formatStatus(item?.status)}
                    </p>
                  </div>
                  <div className="w-[2%]">
                    <Popover
                      onOpenChange={(open) => {
                        if (open) setBookingData(item);
                      }}
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
                        <BookingDetails
                          // setActiveModalId={setActiveModalId}
                          // setIsDialogOpen={setIsDialogOpen}
                          bookingData={bookingData}
                        />
                        <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                          <LuDownload size={18} /> Download
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              ))}
            </div>
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
    </div>
  );
};

export default Bookings;
