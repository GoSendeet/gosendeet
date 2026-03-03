import { useEffect, useRef, useState } from "react";
import Profiles from "./Profiles";
import Orders from "./Orders";
import Companies from "./Companies";
import Reports from "./Reports";
import Settings from "./Settings";
import { toast } from "sonner";
import Notifications from "../dashboard/Notifications";
// import ViewIcon from "@/assets/icons/view.svg";

const AdminDashboard = () => {
  const initialTab = sessionStorage.getItem("adminTab");
  const [activeTab, setActiveTab] = useState(initialTab || "profiles");
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs = [
    { key: "profiles", label: "Profiles" },
    { key: "orders", label: "Orders" },
    { key: "companies", label: "Companies" },
    { key: "reports", label: "Reports" },
    { key: "notifications", label: "Notifications" },
    { key: "settings", label: "Settings" },
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

  useEffect(() => {
    const sessionExpired = sessionStorage.getItem("sessionExpired");
    if (sessionExpired === "true") {
      toast.error("User session expired");
    }
  }, []);
  return (
    <div className="md:px-20 px-6 py-10 bg-neutral100">
      <div className="flex xl:flex-row flex-col gap-2 justify-between xl:items-center">
        <h1 className="lg:text-[40px] text-[30px] font-arial font-bold text-brand">
          Dashboard
        </h1>

        {/* Tab Buttons */}
        <div className="overflow-x-auto">
          <div className="min-w-[635px] w-full">
            <div className="w-fit border-b border-b-neutral300 h-[60px] flex md:gap-4 relative overflow-hidden">
              {tabs.map((tab, index) => (
                <button
                  key={tab.key}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  className={`relative px-4 font-medium md:text-base text-sm outline-white transition-colors duration-300 cursor-pointer ${
                    activeTab === tab.key ? "text-brand" : "text-neutral500"
                  }`}
                  // onMouseEnter={() => {
                  //   updateUnderline(index);
                  //   setActiveTab(tab.key);
                  //   sessionStorage.setItem("adminTab", tab.key);
                  // }}
                  onClick={() => {
                    updateUnderline(index);
                    setActiveTab(tab.key);
                    sessionStorage.setItem("adminTab", tab.key);
                  }}
                >
                  {/* <ViewIcon/> */}
                  {tab.label}
                </button>
              ))}

              {/* Active underline */}
              <div
                className="absolute bottom-0 h-[2.5px] bg-brand transition-all duration-300 rounded-full"
                style={{
                  left: underlineLeft,
                  width: underlineWidth,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "profiles" && <Profiles />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "companies" && <Companies />}
        {activeTab === "reports" && <Reports  setActiveTab={setActiveTab}/>}
        {activeTab === "notifications" && <Notifications />}
        {activeTab === "settings" && <Settings />}
      </div>
    </div>
  );
};

export default AdminDashboard;
