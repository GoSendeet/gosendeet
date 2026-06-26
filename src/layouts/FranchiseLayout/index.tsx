import { useState } from "react";
import { franchiseDashboardTab } from "@/constants";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardFooter from "@/components/DashboardFooter";

import { Outlet } from "react-router-dom";

const STORAGE_KEY = "franchiseDashboardTab";

const FranchiseLayout = () => {
  const [activeTab, setActiveTab] = useState<string>(
    () => sessionStorage.getItem(STORAGE_KEY) || franchiseDashboardTab[0].key,
  );

  const handleTabChange = (tab: string) => {
    sessionStorage.setItem(STORAGE_KEY, tab);
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <DashboardNavbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={franchiseDashboardTab}
          showDesktopTabs={false}
        />
      </header>
      <main className="flex-grow bg-neutral100">
        <Outlet context={{ activeTab, onTabChange: handleTabChange }} />
      </main>
      <footer>
        <DashboardFooter />
      </footer>
    </div>
  );
};

export default FranchiseLayout;
