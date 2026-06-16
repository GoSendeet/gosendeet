import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import { IoSearchOutline } from "react-icons/io5";
import { Archive, Building2, CheckCircle2, FileText, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  useGetCompanyList,
  useGetCompanyStats,
} from "@/queries/admin/useGetAdminCompanies";

import { UpdateCompanyModal } from "./modals/UpdateCompanyModal";
import UpdateCompanyStatusModal from "./modals/UpdateCompanyStatusModal";

type CompanyStatusKey = "All" | "Active" | "Draft" | "Archived";

const STATUS_BY_KEY: Record<CompanyStatusKey, string> = {
  All: "",
  Active: "published",
  Draft: "draft",
  Archived: "archived",
};

const Companies = () => {
  const [activeStatusTab, setActiveStatusTab] =
    useState<CompanyStatusKey>("All");
  const [companyStatus, setCompanyStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({});
  const [companyName, setCompanyName] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [singleCompanyStatus, setSingleCompanyStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  const size = 10;
  const serviceLevelId = "";
  const [lastPage, setLastPage] = useState(1);
  const { currentPage, updatePage } = usePaginationSync(lastPage);
  const { data: stats } = useGetCompanyStats();
  const companyStats = stats?.data ?? {};

  useEffect(() => {
    updatePage(1);
  }, [companyStatus, serviceLevelId, debouncedSearchTerm, updatePage]);

  const { data, isLoading, isSuccess, isError } = useGetCompanyList(
    currentPage,
    size,
    companyStatus,
    serviceLevelId,
    debouncedSearchTerm,
  );

  useEffect(() => {
    const totalPages = data?.data?.page?.totalPages;
    if (totalPages && totalPages !== lastPage) {
      setLastPage(totalPages);
    }
  }, [data?.data?.page?.totalPages, lastPage]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const companies = data?.data?.content ?? [];
  const hasActiveFilters = Boolean(companyStatus) || Boolean(searchTerm.trim());

  const statusCards = useMemo<StatusSummaryCardItem<CompanyStatusKey>[]>(
    () => [
      {
        key: "All",
        title: "All Companies",
        count: companyStats?.totalCompanies ?? 0,
        icon: <Building2 size={20} className="text-brand" />,
      },
      {
        key: "Active",
        title: "Active Companies",
        count: companyStats?.activeCompanies ?? 0,
        icon: <CheckCircle2 size={20} className="text-green-700" />,
      },
      {
        key: "Draft",
        title: "Draft Companies",
        count: companyStats?.inactiveCompanies ?? 0,
        icon: <FileText size={20} className="text-amber-700" />,
      },
      {
        key: "Archived",
        title: "Archived Companies",
        count: companyStats?.archivedCompanies ?? 0,
        icon: <Archive size={20} className="text-red-700" />,
      },
    ],
    [companyStats],
  );

  const handleStatusChange = (key: CompanyStatusKey) => {
    setActiveStatusTab(key);
    setCompanyStatus(STATUS_BY_KEY[key]);
  };

  const clearFilters = () => {
    setActiveStatusTab("All");
    setCompanyStatus("");
    setSearchTerm("");
    setDebouncedSearchTerm("");
  };

  const openStatusModal = (item: any) => {
    setCompanyName(item.name);
    setCompanyId(item.id);
    setOpenStatus(true);
    setSingleCompanyStatus(item.status);
  };

  const columns: AdminDataTableColumn<any>[] = [
    {
      key: "name",
      header: "Company Name",
      render: (item) => <p className="font-medium">{item.name}</p>,
    },
    {
      key: "email",
      header: "Email",
      render: (item) => <p className="break-words">{item.email}</p>,
    },
    {
      key: "contact",
      header: "Contact",
      render: (item) => <p>{item.phone}</p>,
    },
    {
      key: "status",
      header: "Status",
      render: (item) => <p className="capitalize">{item.status}</p>,
    },
    {
      key: "actions",
      header: "Actions",
      className: "90px",
      render: (item) => (
        <Popover onOpenChange={(open) => open && setCompanyInfo(item)}>
          <PopoverTrigger asChild>
            <button className="rounded-md border border-neutral200 p-1">
              <BsThreeDotsVertical size={20} className="p-1 cursor-pointer" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-fit p-1">
            <Link to={`/admin-dashboard/company/${item.id}`} state={{ id: item.id }}>
              <p className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 hover:bg-brand-light">
                View full details
              </p>
            </Link>
            <p
              className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 hover:bg-brand-light"
              onClick={() => {
                setCompanyInfo(item);
                setOpen(true);
              }}
            >
              Update info
            </p>
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
          Companies
        </h2>
        <p className="text-sm text-neutral600">
          This contains all partnered companies
        </p>
      </div>

      <StatusSummaryCards
        items={statusCards}
        activeKey={activeStatusTab}
        onChange={handleStatusChange}
        className="mb-8"
      />

      <div className="mb-6 flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div>
          <p className="text-sm font-semibold text-brand">Company list</p>
          <p className="text-xs text-neutral500">
            Showing {activeStatusTab.toLowerCase()} companies
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-[40px] items-center gap-2 rounded-lg border-2 px-2 py-2">
            <IoSearchOutline className="text-neutral500" />
            <input
              type="text"
              role="search"
              value={searchTerm}
              className="w-[150px] border-0 text-sm text-neutral600 outline-0"
              placeholder="Search company"
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
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
          <Link to="companies/add-company">
            <Button variant="secondary" className="h-[42px] bg-brand">
              <Plus /> Add new company
            </Button>
          </Link>
        </div>
      </div>

      <AdminDataTable
        rows={companies}
        columns={columns}
        getRowKey={(item) => item.id}
        isLoading={isLoading && !isSuccess}
        isError={isError && !isLoading}
        emptyMessage="There are no results"
        errorMessage="There was an error getting the data"
      />

      {companies.length > 0 && isSuccess && (
        <PaginationComponent
          lastPage={data?.data?.page?.totalPages}
          currentPage={currentPage}
          handlePageChange={updatePage}
        />
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
