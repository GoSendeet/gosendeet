import { useEffect, useRef, useState } from "react";
import { franchiseDashboardTab } from "@/constants";
import FranchiseDashboard from "./FranchiseDashboard";
import Deliveries from "./Deliveries";
import Earnings from "./Earnings";
import Performance from "./Performance";
import FranchiseNotifications from "./FranchiseNotifications";
import FranchiseSettings from "./FranchiseSettings";
import {
  LayoutDashboard,
  Truck,
  TrendingUp,
  BarChart2,
  Settings,
} from "lucide-react";

const mobileNavItems = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "deliveries", label: "Deliveries", icon: Truck },
  { key: "earnings", label: "Earnings", icon: TrendingUp },
  { key: "performance", label: "Performance", icon: BarChart2 },
  { key: "settings", label: "Settings", icon: Settings },
];

const STORAGE_KEY = "franchiseDashboardTab";

const Franchise = () => {
  const initialTab = sessionStorage.getItem(STORAGE_KEY) || franchiseDashboardTab[0].key;
  const [activeTab, setActiveTab] = useState(initialTab);
  const [deliveryStatusTab, setDeliveryStatusTab] = useState("All Status");
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const updateUnderline = (index: number) => {
    const tab = tabRefs.current[index];
    if (tab) {
      setUnderlineLeft(tab.offsetLeft);
      setUnderlineWidth(tab.offsetWidth);
    }
  };

  useEffect(() => {
    const currentIndex = franchiseDashboardTab.findIndex((tab) => tab.key === activeTab);
    updateUnderline(currentIndex);
  }, [activeTab]);

  const handleTabChange = (key: string, index: number) => {
    updateUnderline(index);
    setActiveTab(key);
    sessionStorage.setItem(STORAGE_KEY, key);
    if (key === "dashboard") setDeliveryStatusTab("All Status");
  };

  const navigateToDeliveries = (statusTab: string) => {
    const index = franchiseDashboardTab.findIndex((t) => t.key === "deliveries");
    handleTabChange("deliveries", index);
    setDeliveryStatusTab(statusTab);
  };

  return (
    <div className="md:px-20 px-6 py-10 bg-neutral100">
      <div className="flex xl:flex-row flex-col gap-2 justify-between xl:items-center">
        <h1 className="lg:text-[40px] text-[30px] font-clash text-brand font-semibold">
          {franchiseDashboardTab.find((tab) => tab.key === activeTab)?.label}
        </h1>

        {/* Tab Buttons */}
        <div className="hidden lg:block overflow-x-auto">
          <div className="min-w-max w-full">
            <div className="w-fit border-b border-b-neutral300 h-15 flex md:gap-4 relative overflow-hidden">
              {franchiseDashboardTab.map((tab, index) => (
                <button
                  key={tab.key}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  className={`relative px-4 font-medium md:text-base text-sm outline-white transition-colors duration-300 cursor-pointer whitespace-nowrap ${
                    activeTab === tab.key ? "text-brand" : "text-neutral500"
                  }`}
                  onClick={() => handleTabChange(tab.key, index)}
                >
                  {tab.label}
                </button>
              ))}

              {/* Active underline */}
              <div
                className="absolute bottom-0 h-[2.5px] bg-brand transition-all duration-300 rounded-full"
                style={{ left: underlineLeft, width: underlineWidth }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6 pb-20 md:pb-0">
        {activeTab === "dashboard" && <FranchiseDashboard onNavigateToDeliveries={navigateToDeliveries} />}
        {activeTab === "deliveries" && <Deliveries initialStatusTab={deliveryStatusTab} />}
        {activeTab === "earnings" && <Earnings />}
        {activeTab === "performance" && <Performance />}
        {activeTab === "notifications" && <FranchiseNotifications />}
        {activeTab === "settings" && <FranchiseSettings />}
      </div>

      {/* Mobile bottom nav — visible on small screens only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            const index = franchiseDashboardTab.findIndex((t) => t.key === item.key);
            return (
              <button
                key={item.key}
                onClick={() => handleTabChange(item.key, index)}
                className="flex flex-col items-center gap-1 flex-1 py-1 cursor-pointer"
              >
                <Icon
                  size={22}
                  className={`transition-colors duration-200 ${isActive ? "text-brand" : "text-gray-400"}`}
                />
                <span
                  className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? "text-brand" : "text-gray-400"}`}
                >
                  {item.label}
                </span>
                {/* {isActive && (
                  <span className="w-1 h-1 rounded-full bg-brand" />
                )} */}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Franchise;
