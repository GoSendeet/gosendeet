// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// import purple from "@/assets/icons/purple-checkmark.png";
// import blue from "@/assets/icons/blue-checkmark.png";
// import orange from "@/assets/icons/orange-checkmark.png";
import {
  useGetCompanyList,
  useGetCompanyStats,
} from "@/queries/admin/useGetAdminCompanies";
import { Spinner } from "@/components/Spinner";
import { UpdateCompanyModal } from "./modals/UpdateCompanyModal";
import UpdateCompanyStatusModal from "./modals/UpdateCompanyStatusModal";
import { PaginationComponent } from "@/components/Pagination";
import { usePaginationSync } from "@/hooks/usePaginationSync";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import MobileCard from "@/components/MobileCard";

const Companies = () => {
  const savedLabel = sessionStorage.getItem("savedLabel") || "All";
  const [activeStatusTab, setActiveStatusTab] = useState(savedLabel);
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const [companyInfo, setCompanyInfo] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [singleCompanyStatus, setSingleCompanyStatus] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const savedStatus = sessionStorage.getItem("savedStatus") || "";
  const [companyStatus, setCompanyStatus] = useState(savedStatus);

  const size = 10;
  const serviceLevelId = "";
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);

  // Reset pagination when status changes
  useEffect(() => {
    updatePage(1); // Reset to page 1
  }, [companyStatus, serviceLevelId, debouncedSearchTerm]); // Reset when filters change

  const { data: stats } = useGetCompanyStats();
  const companyStats = stats?.data ?? {};

  // useEffect(() => {
  //   resetPageRef.current = true;
  //   setCurrentPage(1); // Triggers a rerender
  // }, [companyStatus]);

  const { data, isLoading, isSuccess, isError } = useGetCompanyList(
    currentPage, // 👈 Always fetch page 1 during status change
    size,
    companyStatus,
    serviceLevelId,
    debouncedSearchTerm,
    // {
    //   enabled: currentPage === 1 || resetPageRef.current, // 👈 Force run query if resetting
    //   queryKey: [
    //     "companies",
    //     resetPageRef.current ? 1 : currentPage,
    //     companyStatus,
    //     debouncedSearchTerm,
    //   ],
    // }
  );

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000); // 1 second after user stops typing

    return () => {
      clearTimeout(handler); // cancel timeout if user types again
    };
  }, [searchTerm]);

  // const filteredData = data?.data?.content?.filter((item: any) =>
  //   companyStatus ? item.status === companyStatus : true
  // );

  const [activeModalId, setActiveModalId] = useState<number | null>(null);

  const statusTabs = [
    {
      label: "All",
      status: "",
      count: companyStats?.totalCompanies ?? 0,
    },
    {
      label: "Active",
      status: "published",
      count: companyStats?.activeCompanies ?? 0,
    },
    {
      label: "Draft",
      status: "draft",
      count: companyStats?.inactiveCompanies ?? 0,
    },
    {
      label: "Archived",
      status: "archived",
      count: companyStats?.archivedCompanies,
    },
  ];

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-inter font-semibold text-[20px] mb-2 text-brand">Companies</h2>
        <p className="text-sm text-neutral600">
          This contains all partnered companies
        </p>
      </div>

      <div className="w-full h-full bg-neutral200 p-4 md:flex rounded-2xl mb-8">
        <div className="w-full flex flex-col gap-4 justify-between py-2">
          <p className="text-neutral500 text-sm">Active Companies</p>

          <p className="text-[20px] font-inter font-semibold md:mb-6">
            {companyStats?.activeCompanies ?? 0}
          </p>
          {/* <hr className="border-neutral700" />
          <div className="flex justify-between items-center py-2">
            <Select>
              <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent text-xs mr-1 text-grey500 w-[120px] p-0">
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

        <p className="h-[0.7px] w-full my-4 mx-0 bg-neutral700 sm:h-[120px] sm:w-[1px] sm:mx-4 sm:my-0"></p>

        <div className="w-full flex flex-col gap-4 justify-between py-2">
          <p className="text-neutral500 text-sm ">Draft Companies</p>
          <p className="text-[20px] font-inter font-semibold md:mb-6">
            {companyStats?.inactiveCompanies ?? 0}
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

        <p className="h-[1px] w-full my-4 mx-0 bg-neutral700 sm:h-[120px] sm:w-[1px] sm:mx-4 sm:my-0"></p>

        <div className="w-full flex flex-col gap-4 justify-between py-2">
          <p className="text-neutral500 text-sm ">Archived Companies</p>
          <p className="text-[20px] font-inter font-semibold md:mb-6">
            {companyStats?.archivedCompanies ?? 0}
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

      <div className="flex xl:flex-row flex-col justify-between xl:items-center gap-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          {statusTabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setActiveStatusTab(tab.label);
                setCompanyStatus(tab.status);
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
              placeholder="Search company"
              onChange={(e: any) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          {/* Select options */}
          {/* <div>
            <Select>
              <SelectTrigger className="h-[40px] rounded-lg border-2">
                <SelectValue placeholder="Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="51">All</SelectItem>
                <SelectItem value="1">Pickup</SelectItem>
                <SelectItem value="2">Delivery</SelectItem>
              </SelectContent>
            </Select>
          </div> */}
          <div>
            <Link to={"companies/add-company"}>
              <Button variant={"secondary"} className="h-[42px] bg-brand">
                <Plus /> Add new company
              </Button>
            </Link>
          </div>
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
        <>
          {/* Mobile card layout */}
          <div className="xl:hidden">
            {data?.data?.content?.map((item: any, index: number) => (
              <MobileCard key={index}>
                <div className="flex justify-end mb-2">
                  <Popover
                    onOpenChange={(open) => open && setCompanyInfo(item)}
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
                        to={`/admin-dashboard/company/${item.id}`}
                        state={{ id: item.id }}
                      >
                        <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                          View full details
                        </p>
                      </Link>
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => {
                          setCompanyInfo(item);
                          setOpen(true);
                        }}
                      >
                        Update info
                      </p>
                      <p
                        className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                        onClick={() => {
                          setCompanyName(item.name);
                          setCompanyId(item.id);
                          setOpenStatus(true);
                          setSingleCompanyStatus(item.status);
                        }}
                      >
                        Update status
                      </p>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Company Name
                  </span>
                  <span className="truncate ml-2 text-sm">{item.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">Email</span>
                  <span className="truncate ml-2 text-sm">{item.email}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">
                    Contact
                  </span>
                  <span className="truncate ml-2 text-sm">{item.phone}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-brand text-sm">Status</span>
                  <span className="capitalize ml-2 text-sm">{item.status}</span>
                </div>
               
              </MobileCard>
            ))}
          </div>

          
          {/* Table layout for desktop */}
          <div className="hidden xl:block overflow-x-auto">
            <div className="min-w-[1200px] w-full relative">
              <div className="flex justify-between text-brand text-left px-3 xl:px-4 py-4 text-md font-inter font-semibold bg-purple300 w-full">
                <span className="w-[1%] mr-4">
                  <input type="checkbox" name="" id="" className="mt-[2px]" />
                </span>
                <span className="flex-1">Company Name</span>
                <span className="flex-1">Email</span>
                <span className="flex-1">Contact</span>
                <span className="flex-1">Status</span>
                <span className="w-[2%]"></span>
              </div>
              {data?.data?.content?.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative min-h-[60px] bg-white py-2 px-3 xl:px-4 text-sm flex items-center ${
                      index === 0
                        ? "border-b-0"
                        : "border-b border-b-neutral300"
                    } hover:bg-brand-light`}
                  >
                    <span className="w-[1%] mr-4">
                      <input type="checkbox" name="" id="" className="mt-1" />
                    </span>
                    <div className="flex-1">
                      <p>{item.name}</p>
                    </div>
                    <div className="flex-1">
                      <p>{item.email}</p>
                    </div>
                    <div className="flex-1">
                      <p>{item.phone}</p>
                    </div>
                    <div className="flex-1">
                      <p className="capitalize">{item.status}</p>
                    </div>
                    <Popover
                      open={activeModalId === index}
                      onOpenChange={(open) =>
                        setActiveModalId(open ? index : null)
                      }
                    >
                      <PopoverTrigger asChild>
                        <button className="border p-1 rounded-md border-neutral200">
                          <BsThreeDotsVertical
                            size={20}
                            className="p-1 cursor-pointer"
                            onClick={() => {
                              setActiveModalId(index);
                            }}
                          />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit p-1">
                        <Link
                          to={`/admin-dashboard/company/${item.id}`}
                          state={{ id: item.id }}
                        >
                          <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
                            View full details
                          </p>
                        </Link>
                        <p
                          className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                          onClick={() => {
                            setCompanyInfo(item);
                            setOpen(true);
                          }}
                        >
                          Update info
                        </p>
                        <p
                          className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer"
                          onClick={() => {
                            setCompanyName(item.name);
                            setCompanyId(item.id);
                            setOpenStatus(true);
                            setSingleCompanyStatus(item.status);
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

      {data && data?.data?.content?.length === 0 && !isLoading && isSuccess && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There are no results
          </p>
        </div>
      )}
      <UpdateCompanyModal open={open} setOpen={setOpen} data={companyInfo} />

      <UpdateCompanyStatusModal
        openStatus={openStatus}
        setOpenStatus={setOpenStatus}
        companyName={companyName}
        companyId={companyId}
        companyStatus={singleCompanyStatus}
      />
    </div>
  );
};

export default Companies;
