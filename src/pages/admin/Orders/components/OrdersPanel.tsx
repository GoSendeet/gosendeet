import { useEffect, useMemo, useState } from "react";
import { Bell, BellDot } from "lucide-react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

import { PaginationComponent } from "@/components/Pagination";
import { Spinner } from "@/components/Spinner";
import bellComplete from "@/assets/icons/bell-complete.png";
import bellOff from "@/assets/icons/bell-off.png";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";
import {
  useGetAllBookings,
  useGetBookingsStats,
} from "@/queries/user/useGetUserBookings";
import {
  StatusSummaryCards,
  type StatusSummaryCardItem,
} from "@/pages/admin/components/StatusSummaryCards";

import { OrdersFilters } from "./OrdersFilters";
import { OrdersTable, type OrdersTableVariant } from "./OrdersTable";

type OrderStatusKey = "All" | "Active" | "Completed" | "Cancelled";

type OrdersPanelProps = {
  companyId?: string;
  senderId?: string;
  variant: OrdersTableVariant;
  showStatusCards?: boolean;
  persistStatus?: boolean;
};

const STATUS_BY_KEY: Record<OrderStatusKey, string> = {
  All: "",
  Active: "PENDING",
  Completed: "DELIVERED",
  Cancelled: "CANCELLED",
};

export function OrdersPanel({
  companyId,
  senderId,
  variant,
  showStatusCards = true,
  persistStatus = false,
}: OrdersPanelProps) {
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);
  const savedStatus = persistStatus ? sessionStorage.getItem("savedStatus") || "" : "";
  const savedLabel = persistStatus
    ? (sessionStorage.getItem("savedLabel") as OrderStatusKey | null) || "All"
    : "All";

  const [activeStatusTab, setActiveStatusTab] =
    useState<OrderStatusKey>(savedLabel);
  const [bookingStatus, setBookingStatus] = useState(savedStatus);
  const [packageTypeId, setPackageTypeId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [range, setRange] = useState<DateRange | undefined>();

  const { data: bookingStats } = useGetBookingsStats({
    companyId,
    senderId,
  });
  const { data: packageTypes } = useGetPackageType({ minimize: true });
  const packages = packageTypes?.data;
  const startStr = range?.from ? format(range.from, "yyyy-MM-dd") : "";
  const endStr = range?.to ? format(range.to, "yyyy-MM-dd") : "";

  useEffect(() => {
    updatePage(1);
  }, [bookingStatus, packageTypeId, debouncedSearchTerm, startStr, endStr]);

  const { data, isLoading, isSuccess, isError } = useGetAllBookings({
    page: currentPage,
    companyId,
    senderId,
    bookingStatus,
    search: debouncedSearchTerm,
    packageTypeId,
    startDate: startStr,
    endDate: endStr,
  });

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const statusCards = useMemo<StatusSummaryCardItem<OrderStatusKey>[]>(
    () => [
      {
        key: "All",
        title: "All Orders",
        count: bookingStats?.data?.totalBookings ?? 0,
        icon: <BellDot size={22} />,
      },
      {
        key: "Active",
        title: "Active Orders",
        count: bookingStats?.data?.activeBookings ?? 0,
        icon: <Bell size={23} className="text-brand" />,
      },
      {
        key: "Completed",
        title: "Completed Orders",
        count: bookingStats?.data?.deliveredBookings ?? 0,
        icon: <img src={bellComplete} alt="" className="h-6 w-6" />,
      },
      {
        key: "Cancelled",
        title: "Cancelled Orders",
        count: bookingStats?.data?.cancelledBookings ?? 0,
        icon: <img src={bellOff} alt="" className="h-6 w-6" />,
      },
    ],
    [bookingStats?.data],
  );

  const hasActiveFilters =
    Boolean(bookingStatus) ||
    Boolean(searchTerm.trim()) ||
    Boolean(packageTypeId) ||
    Boolean(range?.from);

  const handleStatusChange = (key: OrderStatusKey) => {
    setActiveStatusTab(key);
    setBookingStatus(STATUS_BY_KEY[key]);

    if (persistStatus) {
      sessionStorage.setItem("savedLabel", key);
      sessionStorage.setItem("savedStatus", STATUS_BY_KEY[key]);
    }
  };

  const clearFilters = () => {
    setActiveStatusTab("All");
    setBookingStatus("");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setPackageTypeId("");
    setRange(undefined);

    if (persistStatus) {
      sessionStorage.removeItem("savedLabel");
      sessionStorage.removeItem("savedStatus");
    }
  };

  return (
    <div>
      {showStatusCards && (
        <StatusSummaryCards
          items={statusCards}
          activeKey={activeStatusTab}
          onChange={handleStatusChange}
          className="mb-8"
        />
      )}

      <OrdersFilters
        activeStatusLabel={activeStatusTab}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        packageTypeId={packageTypeId}
        onPackageTypeChange={setPackageTypeId}
        packages={packages}
        range={range}
        onRangeChange={setRange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {isLoading && !isSuccess && (
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <p className="text-center font-inter text-xl font-semibold">
            There was an error getting the data
          </p>
        </div>
      )}

      {!isLoading && isSuccess && data && data?.data?.content?.length > 0 && (
        <div>
          <OrdersTable orders={data.data.content} variant={variant} />
          <PaginationComponent
            lastPage={data?.data?.page?.totalPages}
            currentPage={currentPage}
            handlePageChange={updatePage}
          />
        </div>
      )}

      {data && data?.data?.content?.length === 0 && !isLoading && isSuccess && (
        <div className="flex h-[50vh] w-full flex-col items-center justify-center">
          <p className="text-center font-inter text-xl font-semibold">
            There are no results
          </p>
        </div>
      )}
    </div>
  );
}
