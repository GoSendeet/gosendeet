import Navbar from "@/components/Navbar";
import DashboardFooter from "@/components/DashboardFooter";

import { Outlet } from "react-router-dom";

const FranchiseLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <Navbar />
      </header>
      <main className="flex-grow bg-neutral100">
        <Outlet />
      </main>
      <footer>
        <DashboardFooter />
      </footer>
    </div>
  );
};

export default FranchiseLayout;
