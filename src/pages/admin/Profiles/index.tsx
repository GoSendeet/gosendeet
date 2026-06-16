import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { DateRange } from "react-day-picker";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { UserCheck, Users, UserX, X } from "lucide-react";

import { DateRangePicker } from "@/components/DateRangePicker.tsx";
import { PaginationComponent } from "@/components/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AdminDataTable,
  type AdminDataTableColumn,
} from "@/pages/admin/components/AdminDataTable";
import {
  StatusSummaryCards,
  type StatusSummaryCardItem,
} from "@/pages/admin/components/StatusSummaryCards";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { cn, formatTimestampToReadable, timeAgo } from "@/lib/utils";
import {
  useGetProfiles,
  useGetProfileStats,
} from "@/queries/admin/useGetAdminProfiles";

import UpdateUserStatusModal from "./modals/UpdateUserStatusModal";

type ProfileStatusKey = "All" | "Active" | "Inactive";

const STATUS_BY_KEY: Record<ProfileStatusKey, string> = {
  All: "",
  Active: "active",
  Inactive: "inactive",
};

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      status === "active"
        ? "bg-green100 text-white"
        : "bg-[#FEF2F2] text-[#EC2D30]",
      "inline-flex w-fit rounded-2xl px-4 py-1 font-medium capitalize",
    )}
  >
    {status}
  </span>
);

const Profiles = () => {
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [singleUserStatus, setSingleUserStatus] = useState("");

  const savedStatus = sessionStorage.getItem("savedStatus") || "";
  const [userStatus, setUserStatus] = useState(savedStatus);
  const savedLabel =
    (sessionStorage.getItem("savedLabel") as ProfileStatusKey | null) || "All";
  const [activeStatusTab, setActiveStatusTab] =
    useState<ProfileStatusKey>(savedLabel);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedProfileSearchTerm, setDebouncedProfileSearchTerm] =
    useState("");

  const size = 10;
  const role = "";
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);
  const { data: profileStats } = useGetProfileStats();
  const [range, setRange] = useState<DateRange | undefined>();
  const startStr = range?.from ? format(range.from, "yyyy-MM-dd") : null;
  const endStr = range?.to ? format(range.to, "yyyy-MM-dd") : null;

  useEffect(() => {
    updatePage(1);
  }, [userStatus, debouncedProfileSearchTerm, startStr, endStr, updatePage]);

  const { data, isLoading, isSuccess, isError } = useGetProfiles(
    currentPage,
    size,
    userStatus,
    role,
    debouncedProfileSearchTerm,
    startStr || "",
    endStr || "",
  );

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages, lastPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProfileSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const profiles = data?.data.content ?? [];
  const hasActiveFilters =
    Boolean(userStatus) || Boolean(searchTerm.trim()) || Boolean(range?.from);

  const statusCards = useMemo<StatusSummaryCardItem<ProfileStatusKey>[]>(
    () => [
      {
        key: "All",
        title: "All Profiles",
        count: profileStats?.data?.totalUsers ?? 0,
        icon: <Users size={20} className="text-brand" />,
      },
      {
        key: "Active",
        title: "Active Profiles",
        count: profileStats?.data?.activeUsers ?? 0,
        icon: <UserCheck size={20} className="text-green-700" />,
      },
      {
        key: "Inactive",
        title: "Inactive Profiles",
        count: profileStats?.data?.inactiveUsers ?? 0,
        icon: <UserX size={20} className="text-red-700" />,
      },
    ],
    [profileStats?.data],
  );

  const handleStatusChange = (key: ProfileStatusKey) => {
    setActiveStatusTab(key);
    setUserStatus(STATUS_BY_KEY[key]);
    sessionStorage.setItem("savedLabel", key);
    sessionStorage.setItem("savedStatus", STATUS_BY_KEY[key]);
  };

  const clearFilters = () => {
    setActiveStatusTab("All");
    setUserStatus("");
    setSearchTerm("");
    setDebouncedProfileSearchTerm("");
    setRange(undefined);
    sessionStorage.removeItem("savedLabel");
    sessionStorage.removeItem("savedStatus");
  };

  const openStatusModal = (item: any) => {
    setUsername(item.username);
    setUserId(item.id);
    setOpenUpdateStatus(true);
    setSingleUserStatus(item.status);
  };

  const columns: AdminDataTableColumn<any>[] = [
    {
      key: "customer",
      header: "Customer",
      render: (item) => <p className="font-medium">{item.username}</p>,
    },
    {
      key: "email",
      header: "Email",
      render: (item) => <p className="break-words">{item.email}</p>,
    },
    {
      key: "created",
      header: "Date Created",
      render: (item) => (
        <p>{formatTimestampToReadable(item.createdAt)}</p>
      ),
    },
    {
      key: "lastLogin",
      header: "Last Login time",
      render: (item) => <p>{item.lastLogin ? timeAgo(item.lastLogin) : "N/A"}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "actions",
      header: "Actions",
      className: "80px",
      render: (item) => (
        <Popover onOpenChange={(open) => open && setUsername(item.username)}>
          <PopoverTrigger asChild>
            <button className="rounded-md border border-neutral200 p-1">
              <BsThreeDotsVertical size={20} className="p-1 cursor-pointer" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-1">
            <Link to={`/admin-dashboard/user/${item.id}`} state={{ id: item.id }}>
              <p className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 hover:bg-brand-light">
                View Profile
              </p>
            </Link>
            <p
              className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 hover:bg-brand-light"
              onClick={() => openStatusModal(item)}
            >
              Update status
            </p>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="mb-2 font-inter text-[20px] font-semibold text-brand">
          Profiles
        </h2>
        <p className="text-sm text-neutral600">
          This contains all registered profiles
        </p>
      </div>

      <StatusSummaryCards
        items={statusCards}
        activeKey={activeStatusTab}
        onChange={handleStatusChange}
        className="mb-8 md:grid-cols-3"
      />

      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold text-brand">Profile list</p>
          <p className="text-xs text-neutral500">
            Showing {activeStatusTab.toLowerCase()} profiles
          </p>
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex h-[40px] items-center gap-2 rounded-lg border-2 px-2 py-2">
            <IoSearchOutline className="text-neutral500" />
            <input
              type="text"
              role="search"
              value={searchTerm}
              className="w-[220px] border-0 text-sm text-neutral600 outline-0"
              placeholder="Search profile by name"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <DateRangePicker value={range} onChange={setRange} />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="flex h-10 items-center gap-2 rounded-lg border border-brand/20 bg-brand-light px-3 text-sm font-semibold text-brand transition-colors hover:bg-[#DCFCE7]"
            >
              <X size={16} />
              Clear filters
            </button>
          )}
        </div>
      </div>

      <AdminDataTable
        rows={profiles}
        columns={columns}
        getRowKey={(item) => item.id}
        isLoading={isLoading && !isSuccess}
        isError={isError && !isLoading}
        emptyMessage="There are no results"
        errorMessage="There was an error getting the data"
      />

      {profiles.length > 0 && isSuccess && (
        <PaginationComponent
          lastPage={data?.data?.page?.totalPages}
          currentPage={currentPage}
          handlePageChange={updatePage}
        />
      )}

      <UpdateUserStatusModal
        openUpdateStatus={openUpdateStatus}
        setOpenUpdateStatus={setOpenUpdateStatus}
        username={username}
        userId={userId}
        userStatus={singleUserStatus}
      />
    </div>
  );
};

export default Profiles;
