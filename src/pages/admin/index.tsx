import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import ApprovedClients from "./ApprovedClients";
import Profiles from "./Profiles";
import Orders from "./Orders";
import Companies from "./Companies";
import Credentials from "./Credentials";
import Reports from "./Reports";
import Settings from "./Settings";
import { toast } from "sonner";
import Notifications from "../dashboard/Notifications";

interface AdminContext {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminDashboard = () => {
  const { activeTab, onTabChange } = useOutletContext<AdminContext>();

  useEffect(() => {
    const sessionExpired = sessionStorage.getItem("sessionExpired");
    if (sessionExpired === "true") {
      toast.error("User session expired");
    }
  }, []);

  return (
    <div className="md:px-20 px-6 py-10 bg-neutral100 min-h-screen">
      {activeTab === "profiles" && <Profiles />}
      {activeTab === "orders" && <Orders />}
      {activeTab === "companies" && <Companies />}
      {activeTab === "approved-clients" && <ApprovedClients />}
      {activeTab === "credentials" && <Credentials />}
      {activeTab === "reports" && <Reports setActiveTab={onTabChange} />}
      {activeTab === "notifications" && <Notifications />}
      {activeTab === "settings" && <Settings />}
    </div>
  );
};

export default AdminDashboard;
