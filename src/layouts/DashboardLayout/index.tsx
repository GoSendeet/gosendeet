import { useState } from "react";
import DashboardNavbar from "@/components/DashboardNavbar";
import DashboardFooter from "@/components/DashboardFooter";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [activeTab, setActiveTab] = useState<string>(
    () => sessionStorage.getItem("dashboardTab") || "overview",
  );

  const handleTabChange = (tab: string) => {
    sessionStorage.setItem("dashboardTab", tab);
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50">
        <DashboardNavbar activeTab={activeTab} onTabChange={handleTabChange} />
      </header>
      <main className="flex-grow bg-neutral100 pt-18 lg:pt-20">
        <Outlet context={{ activeTab, onTabChange: handleTabChange }} />
      </main>
      <footer>
        <DashboardFooter />
      </footer>
    </div>
  );
};

export default DashboardLayout;
