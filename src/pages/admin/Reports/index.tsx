import { MdArrowForwardIos } from "react-icons/md";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { useGetProfileStats } from "@/queries/admin/useGetAdminProfiles";
import { useGetBookingsStats } from "@/queries/user/useGetUserBookings";
import { useGetCompanyStats } from "@/queries/admin/useGetAdminCompanies";
const Reports = ({ setActiveTab }: any) => {
  const { data: profileStats } = useGetProfileStats();
  const { data: bookingStats } = useGetBookingsStats();
  const { data: companyStats } = useGetCompanyStats();

  const reportTabs = [
    {
      title: "Total Users",
      label: "All",
      status: "",
      type: "profiles",
      count: profileStats?.data?.totalUsers ?? 0,
    },
    {
      title: "Active Users",
      label: "Active",
      status: "active",
      type: "profiles",
      count: profileStats?.data?.activeUsers ?? 0,
    },
    {
      title: "Inactive Users",
      label: "Inactive",
      status: "inactive",
      type: "profiles",
      count: profileStats?.data?.inactiveUsers ?? 0,
    },

    {
      title: "Total Orders",
      label: "All",
      status: "",
      type: "orders",
      count: bookingStats?.data?.totalBookings ?? 0,
    },
    {
      title: "Active Orders",
      label: "Active",
      status: "PENDING",
      type: "orders",
      count: bookingStats?.data?.activeBookings ?? 0,
    },
    {
      title: "Completed Orders",
      label: "Completed",
      status: "DELIVERED",
      type: "orders",
      count: bookingStats?.data?.deliveredBookings ?? 0,
    },
    {
      title: "Cancelled Orders",
      label: "Cancelled",
      status: "CANCELLED",
      type: "orders",
      count: bookingStats?.data?.cancelledBookings ?? 0,
    },

    {
      title: "Total Companies",
      label: "All",
      status: "",
      type: "companies",
      count: companyStats?.data?.totalCompanies ?? 0,
    },
    {
      title: "Active Companies",
      label: "Active",
      status: "published",
      type: "companies",
      count: companyStats?.data?.activeCompanies ?? 0,
    },
    {
      title: "Draft Companies",
      label: "Draft",
      status: "draft",
      type: "companies",
      count: companyStats?.data?.inactiveCompanies ?? 0,
    },
    {
      title: "Archived Companies",
      label: "Archived",
      status: "archived",
      type: "companies",
      count: companyStats?.data?.archivedCompanies,
    },
  ];
  
  return (
    <div>
      <div className="mb-4">
        <h2 className="font-inter font-semibold text-[20px] mb-2">Reports</h2>
        <p className="text-sm text-neutral600">This contains all reports</p>
      </div>
      <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-4 mt-2">
        {reportTabs.map((tab, index) => (
          <div
            className="p-4 bg-white border border-grey100 rounded-xl"
            key={index}
          >
            <p className=" text-sm text-brand font-medium">{tab.title}</p>

            <div className="flex justify-between items-center my-8">
              <p className="text-[20px] font-inter font-semibold">
                {tab.count}
              </p>
              <p
                className="cursor-pointer"
                onClick={() => {
                  sessionStorage.setItem("savedStatus", tab.status);
                  sessionStorage.setItem("savedLabel", tab.label);
                  setActiveTab(tab.type);

                  // Remove the stored values after navigation is handled
                  setTimeout(() => {
                    sessionStorage.removeItem("savedStatus");
                    sessionStorage.removeItem("savedLabel");
                  }, 500);
                }}
              >
                <MdArrowForwardIos className="text-brand" size={20} />
              </p>
            </div>
            <hr />
            <div className="flex justify-between items-center pt-3">
              {/* <Select>
                <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent text-xs text-grey500 w-[120px] px-0">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">This month</SelectItem>
                  <SelectItem value="2">This week</SelectItem>
                </SelectContent>
              </Select>
              <p className="font-inter font-semibold text-green400">9.12%</p> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
