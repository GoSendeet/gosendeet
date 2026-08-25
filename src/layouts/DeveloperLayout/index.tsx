import DashboardFooter from "@/components/DashboardFooter";
import DashboardNavbar from "@/components/DashboardNavbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

const DEVELOPER_TABS = [
  { key: "overview", label: "Overview" },
  { key: "documentation", label: "Documentation" },
];

const DEVELOPER_TAB_KEYS = new Set(DEVELOPER_TABS.map((tab) => tab.key));

const DeveloperLayout = () => {
  const [activeTab, setActiveTab] = useState<string>(
    () => {
      const storedTab = sessionStorage.getItem("developerTab") || "overview";
      return DEVELOPER_TAB_KEYS.has(storedTab) ? storedTab : "overview";
    },
  );

  const handleTabChange = (tab: string) => {
    if (!DEVELOPER_TAB_KEYS.has(tab)) {
      sessionStorage.setItem("developerTab", "overview");
      setActiveTab("overview");
      return;
    }

    sessionStorage.setItem("developerTab", tab);
    setActiveTab(tab);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full z-50">
        <DashboardNavbar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={DEVELOPER_TABS}
        />
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

export default DeveloperLayout;
