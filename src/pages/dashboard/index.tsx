import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Overview from "./Overview";
import Notifications from "./Notifications";
import Bookings from "./Bookings";
import ProfileSettings from "./ProfileSettings";
import Security from "./Security";
import { useGetUserDetails } from "@/queries/user/useGetUserDetails";

interface DashboardContext {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Dashboard = () => {
  const { activeTab, onTabChange } = useOutletContext<DashboardContext>();

  const userId = sessionStorage.getItem("userId") || "";
  const { data: userData, refetchUserData } = useGetUserDetails(userId);

  useEffect(() => {
    if (userId) refetchUserData();
  }, [userId, refetchUserData]);

  useEffect(() => {
    const hasPendingQuote =
      sessionStorage.getItem("preSigninMode") &&
      sessionStorage.getItem("preSigninResults");

    if (hasPendingQuote && activeTab !== "overview") {
      onTabChange("overview");
    }
  }, [activeTab, onTabChange]);

  return (
    <div className="md:px-20 px-6 py-10 bg-neutral100 min-h-screen">
      {activeTab === "overview" && <Overview data={userData} />}
      {activeTab === "notifications" && (
        <Notifications setActiveTab={onTabChange} />
      )}
      {activeTab === "bookings" && <Bookings />}
      {activeTab === "settings" && <ProfileSettings data={userData} />}
      {activeTab === "security" && <Security data={userData} />}
    </div>
  );
};

export default Dashboard;
