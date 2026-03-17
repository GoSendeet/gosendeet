import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
// import { Check } from "lucide-react";
// import blue from "@/assets/icons/blue-checkmark.png";
// import orange from "@/assets/icons/orange-checkmark.png";
import CoverSheet from "./components/CoverSheet";
import Orders from "./components/Orders";
import Ratings from "./components/Ratings";
import {
  useGetCompanyServices,
  useGetSingleCompany,
} from "@/queries/admin/useGetAdminCompanies";
import Routes from "./components/Routes";
import { Spinner } from "@/components/Spinner";
import { BiEditAlt } from "react-icons/bi";
import UpdateCompanyStatusModal from "../modals/UpdateCompanyStatusModal";

const CompanyDetails = () => {
  const navigate = useNavigate();
  const [openStatus, setOpenStatus] = useState(false);

  const initialTab = sessionStorage.getItem("companyTab");
  const [activeTab, setActiveTab] = useState(initialTab || "cover");
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const companyId: string = useParams().id || "";
  const { data, isLoading, isSuccess, isError } =
    useGetSingleCompany(companyId);
  const { data: company_services } = useGetCompanyServices(companyId);
  const companyServices = company_services?.data || [];

  const tabs = [
    { key: "cover", label: "Cover Sheet" },
    { key: "orders", label: "Orders" },
    { key: "rating", label: "Ratings" },
    { key: "routes", label: "Routes" },
  ];

  const updateUnderline = (index: number) => {
    const tab = tabRefs.current[index];
    if (tab) {
      setUnderlineLeft(tab.offsetLeft);
      setUnderlineWidth(tab.offsetWidth);
    }
  };

  useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => tab.key === activeTab);
    updateUnderline(currentIndex);
  }, [activeTab]);


  return (
    <>
      {isLoading && !isSuccess && (
        <div className="h-[80vh] w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <div className="h-[80vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There was an error getting the data
          </p>
        </div>
      )}

      {!isLoading && isSuccess && data && (
        <div className="md:px-20 px-6 py-8 bg-neutral100">
          <div className="flex justify-between items-center mb-8">
            <Button
              variant={"ghost"}
              size={"ghost"}
              className=""
              onClick={() => navigate("/admin-dashboard")}
            >
              <FaArrowLeft />
              Back
            </Button>

            <Button
              variant={"secondary"}
              className="md:text-base text-sm bg-brand"
              onClick={() => setOpenStatus(true)}
            >
              <BiEditAlt />
              Update Status
            </Button>

            <UpdateCompanyStatusModal
              openStatus={openStatus}
              setOpenStatus={setOpenStatus}
              companyName={data?.data?.name}
              companyId={companyId}
              companyStatus={data?.data?.status}
            />
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 md:gap-6 gap-6 mb-4">
            <div>
              <p className="text-neutral600 text-sm mb-2">COMPANY NAME</p>
              <p className="text-brand lg:text-[20px] md:text-base font-inter font-semibold mb-2">
                {data?.data?.name ?? ""}
              </p>
            </div>
            <div>
              <p className="text-neutral600 text-sm mb-2">STATUS</p>
              <p className="text-brand lg:text-[20px] md:text-base font-inter font-semibold break-all capitalize">
                {data?.data?.status ?? ""}
              </p>
            </div>
            <div>
            </div>
          </div>

          <div>
            {/* Tab Buttons */}
            <div className="w-full border-b border-b-neutral300 md:h-[40px] h-[60px] flex md:gap-4 mt-6 relative overflow-auto">
              {tabs.map((tab, index) => (
                <button
                  key={tab.key}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  className={`relative z-10 px-4 font-medium md:text-base text-nowrap text-sm outline-white transition-colors duration-300 cursor-pointer ${
                    activeTab === tab.key ? "text-brand" : "text-black"
                  }`}
                  // onMouseEnter={() => {
                  //   updateUnderline(index);
                  //   setActiveTab(tab.key);
                  //   sessionStorage.setItem("companyTab", tab.key);
                  // }}
                  onClick={() => {
                    sessionStorage.setItem("companyTab", tab.key);
                    setActiveTab(tab.key);
                    updateUnderline(index);
                  }}
                >
                  {tab.label}
                </button>
              ))}

              {/* Active underline */}
              <div
                className="absolute bottom-0 h-[1px] bg-brand transition-all duration-300 rounded-full"
                style={{
                  left: underlineLeft,
                  width: underlineWidth,
                }}
              />
            </div>

            {/* Tab Content */}
            <div className="mt-4">
              {activeTab === "cover" && <CoverSheet data={data?.data} />}
              {activeTab === "orders" && <Orders companyId={companyId} />}
              {activeTab === "rating" && <Ratings companyId={companyId}/>}
              {activeTab === "routes" && (
                <Routes
                  companyId={companyId}
                  companyServices={companyServices}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CompanyDetails;
