import { useEffect, useRef, useState } from "react";
import { franchiseDashboardTab } from "@/constants";
import FranchiseDashboard from "./FranchiseDashboard";
import Deliveries from "./Deliveries";
import Earnings from "./Earnings";
import Performance from "./Performance";
import FranchiseNotifications from "./FranchiseNotifications";
import FranchiseSettings from "./FranchiseSettings";

const STORAGE_KEY = "franchiseDashboardTab";

const Franchise = () => {
  const initialTab = sessionStorage.getItem(STORAGE_KEY) || franchiseDashboardTab[0].key;
  const [activeTab, setActiveTab] = useState(initialTab);
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
  };

  return (
    <div className="md:px-20 px-6 py-10 bg-neutral100">
      <div className="flex xl:flex-row flex-col gap-2 justify-between xl:items-center">
        <h1 className="lg:text-[40px] text-[30px] font-clash text-brand font-semibold">
          {franchiseDashboardTab.find((tab) => tab.key === activeTab)?.label}
        </h1>

        {/* Tab Buttons */}
        <div className="overflow-x-auto">
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
      <div className="mt-6">
        {activeTab === "dashboard" && <FranchiseDashboard />}
        {activeTab === "deliveries" && <Deliveries />}
        {activeTab === "earnings" && <Earnings />}
        {activeTab === "performance" && <Performance />}
        {activeTab === "notifications" && <FranchiseNotifications />}
        {activeTab === "settings" && <FranchiseSettings />}
      </div>
    </div>
  );
};

export default Franchise;
