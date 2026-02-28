// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { cn, formatTimestampToReadable, timeAgo } from "@/lib/utils";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import UpdateUserStatusModal from "./modals/UpdateUserStatusModal";
import { Link } from "react-router-dom";
import {
  useGetProfiles,
  useGetProfileStats,
} from "@/queries/admin/useGetAdminProfiles";
import { Spinner } from "@/components/Spinner";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import { PaginationComponent } from "@/components/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MobileCard from "@/components/MobileCard";
import { DateRangePicker } from "@/components/DateRangePicker.tsx";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

const Profiles = () => {
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [singleUserStatus, setSingleUserStatus] = useState("");

  const savedStatus = sessionStorage.getItem("savedStatus") || "";
  const [userStatus, setUserStatus] = useState(savedStatus);
  const savedLabel = sessionStorage.getItem("savedLabel") || "All";
  const [activeStatusTab, setActiveStatusTab] = useState(savedLabel);
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

  // Reset pagination when status changes
  useEffect(() => {
    updatePage(1); // Reset to page 1
  }, [userStatus, debouncedProfileSearchTerm, startStr, endStr]); // Reset when filters change

  const { data, isLoading, isSuccess, isError } = useGetProfiles(
    currentPage, // 👈 Always fetch page 1 during status change
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
  }, [data?.data?.page?.totalPages]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedProfileSearchTerm(searchTerm);
    }, 1000); // 1 second after user stops typing

    return () => {
      clearTimeout(handler); // cancel timeout if user types again
    };
  }, [searchTerm]);

  const profiles = data?.data.content;

  // const filteredData = profiles?.filter((item: any) =>
  //   userStatus ? item.status === userStatus : true
  // );

  const statusTabs = [
    {
      label: "All",
      status: "",
      count: profileStats?.data?.totalUsers ?? 0,
    },
    {
      label: "Active",
      status: "active",
      count: profileStats?.data?.activeUsers ?? 0,
    },
    {
      label: "Inactive",
      status: "inactive",
      count: profileStats?.data?.inactiveUsers ?? 0,
    },
  ];

  // popover no longer needs explicit open state

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-inter font-semibold text-[20px] mb-2 text-brand">
          Profiles
        </h2>
        <p className="text-sm text-neutral600">
          This contains all registered profiles
        </p>
      </div>
      <div className="w-full bg-neutral200 p-4 md:flex items-center rounded-2xl mb-8">
        <div className="w-full flex flex-col gap-4 justify-between py-2">
          <p className="text-neutral500 text-sm">All Profiles</p>
          <p className="text-[20px] font-inter font-semibold md:mb-6 text-brand">
            {profileStats?.data?.totalUsers ?? 0}
          </p>
          {/* <hr className="border-neutral700" />
          <div className="flex justify-between items-center py-2">
            <Select>
              <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent text-xs text-grey500 w-[120px] p-0">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">This month</SelectItem>
                <SelectItem value="2">This week</SelectItem>
              </SelectContent>
            </Select>
            <p className="font-inter font-semibold text-green400">9.12%</p>
          </div> */}
        </div>

        <p className="h-[1px] w-full my-4 mx-0 bg-neutral700 sm:h-[120px] sm:w-[1px] sm:mx-4 sm:my-0"></p>

        <div className="w-full flex flex-col gap-4 justify-between py-2">
          <p className="text-neutral500 text-sm">Active Profiles</p>
          <p className="text-[20px] font-inter font-semibold md:mb-6 text-brand">
            {profileStats?.data?.activeUsers ?? 0}
          </p>
          {/* <hr className="border-neutral700" />
          <div className="flex justify-between items-center py-2">
            <Select>
              <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent text-xs text-grey500 w-[120px] p-0">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">This month</SelectItem>
                <SelectItem value="2">This week</SelectItem>
              </SelectContent>
            </Select>
            <p className="font-inter font-semibold text-green400">9.12%</p>
          </div> */}
        </div>

        <p className="h-[1px] w-full my-4 mx-0 bg-neutral700 sm:h-[120px] sm:w-[1px] sm:mx-4 sm:my-0"></p>

        <div className="w-full flex flex-col gap-4 justify-between py-2">
          <p className="text-neutral500 text-sm">Inactive Profiles</p>
          <p className="text-[20px] font-inter font-semibold md:mb-6 text-brand">
            {profileStats?.data?.inactiveUsers ?? 0}
          </p>
          {/* <hr className="border-neutral700" />
          <div className="flex justify-between items-center py-2">
            <Select>
              <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent text-xs text-grey500 w-[120px] p-0">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">This month</SelectItem>
                <SelectItem value="2">This week</SelectItem>
              </SelectContent>
            </Select>
            <p className="font-inter font-semibold text-neutral500">0%</p>
          </div> */}
        </div>
      </div>
      <div className="flex md:flex-row flex-col justify-between lg:items-center gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setActiveStatusTab(tab.label);
                setUserStatus(tab.status);
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
        <div className="flex xl:flex-row flex-col xl:items-center gap-4">
          <div className="flex items-center gap-2 border-2 rounded-lg h-[40px] px-2 py-2">
            <IoSearchOutline className="text-neutral500" />
            <input
              type="text"
              role="search"
              className="border-0 outline-0 w-[220px] text-sm text-neutral600"
              placeholder="Search profile by name"
              onChange={(e: any) => {
                setSearchTerm(e.target.value);
              }}
            />
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

      {!isLoading && isSuccess && data && profiles?.length > 0 && (
        <>
          <div className="overflow-x-auto">
            {/* mobile card layout */}
            <div className="md:hidden">
              {profiles?.map((item: any, index: number) => (
                <MobileCard key={index}>
                  <div className="flex justify-end mb-1">
                    <Popover
                      onOpenChange={(open) =>
                        open && setUsername(item.username)
                      }
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
                          to={`/admin-dashboard/user/${item.id}`}
                          state={{ id: item.id }}
                        >
                          <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                            View Profile
                          </p>
                        </Link>
                        <p
                          className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                          onClick={() => {
                            setUsername(item.username);
                            setUserId(item.id);
                            setOpenUpdateStatus(true);
                            setSingleUserStatus(item.status);
                          }}
                        >
                          Update status
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-brand">Customer</span>
                    <span className="truncate ml-2">{item.username}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-brand">Email</span>
                    <span className="truncate ml-2">{item.email}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-brand">Created</span>
                    <span className="ml-2">
                      {formatTimestampToReadable(item.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-brand">Last login</span>
                    <span className="ml-2">
                      {item.lastLogin ? timeAgo(item.lastLogin) : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-brand">Status</span>
                    <p
                      className={cn(
                        item.status === "active"
                          ? "bg-green100 text-white"
                          : "bg-[#FEF2F2] text-[#EC2D30]",
                        "px-4 py-1 w-fit font-medium rounded-2xl capitalize",
                      )}
                    >
                      {item.status}
                    </p>
                  </div>
                </MobileCard>
              ))}
            </div>
            {/* For desktop and large screen view */}
            <div className="hidden md:block min-w-[1100px] w-full relative">
              <div className="flex justify-between text-left px-3 xl:px-4 py-4 text-md text-brand font-inter font-semibold bg-brand-light w-full">
                <span className="w-[1%] mr-4">
                  <input type="checkbox" name="" id="" className="mt-[2px]" />
                </span>
                <span className="flex-1">Customer</span>
                <span className="flex-1">Email</span>
                <span className="flex-1">Date Created</span>
                <span className="flex-1">Last Login time</span>
                <span className="flex-1">Status</span>
                <span className="w-[2%]"></span>
              </div>

              {profiles?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative h-[60px] bg-white px-3 xl:px-4 text-sm flex items-center ${
                      index === 0
                        ? "border-b-0"
                        : "border-b border-b-neutral300"
                    } hover:bg-brand-light`}
                  >
                    <span className="w-[1%] mr-4">
                      <input type="checkbox" name="" id="" className="mt-1" />
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{item.username}</p>
                    </div>
                    <div className="flex-1">
                      <p>{item.email}</p>
                    </div>
                    <div className="flex-1">
                      <p>{formatTimestampToReadable(item.createdAt)}</p>
                    </div>
                    <div className="flex-1">
                      {item.lastLogin ? timeAgo(item.lastLogin) : "N/A"}
                    </div>

                    <div className="flex-1">
                      <p
                        className={cn(
                          item.status === "active"
                            ? "bg-green100 text-white"
                            : "bg-[#FEF2F2] text-[#EC2D30]",
                          "px-4 py-1 w-fit font-medium rounded-2xl capitalize",
                        )}
                      >
                        {item.status}
                      </p>
                    </div>

                    <Popover
                      onOpenChange={(open) =>
                        open && setUsername(item.username)
                      }
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
                          to={`/admin-dashboard/user/${item.id}`}
                          state={{ id: item.id }}
                        >
                          <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                            View Profile
                          </p>
                        </Link>
                        <p
                          className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                          onClick={() => {
                            setUsername(item.username);
                            setUserId(item.id);
                            setOpenUpdateStatus(true);
                            setSingleUserStatus(item.status);
                          }}
                        >
                          Update status
                        </p>
                      </PopoverContent>
                    </Popover>
                  </div>
                );
              })}
            </div>
          </div>
          <PaginationComponent
            lastPage={data?.data?.page?.totalPages}
            currentPage={currentPage}
            handlePageChange={updatePage}
          />
        </>
      )}
      {data && profiles?.length === 0 && !isLoading && isSuccess && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There are no results
          </p>
        </div>
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
