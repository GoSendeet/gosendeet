import { useEffect, useRef, useState } from "react";
import Overview from "./Overview";
import Notifications from "./Notifications";
import Bookings from "./Bookings";
import ProfileSettings from "./ProfileSettings";
import Security from "./Security";
import { useGetUserDetails } from "@/queries/user/useGetUserDetails";
// import ViewIcon from "@/assets/icons/view.svg";

const Dashboard = () => {
  const initialTab = sessionStorage.getItem("dashboardTab");
  const [activeTab, setActiveTab] = useState(initialTab || "overview");
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "notifications", label: "Notifications" },
    { key: "bookings", label: "Bookings" },
    { key: "settings", label: "Profile Settings" },
    { key: "security", label: "Security" },
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

  const userId = sessionStorage.getItem("userId") || "";

  const { data: userData, refetchUserData } = useGetUserDetails(userId);

  useEffect(() => {
      if (userId) {
        refetchUserData();
      }
    }, [userId]);

  return (
    <div className="md:px-20 px-6 py-10 bg-neutral100">
      <div className="flex xl:flex-row flex-col gap-2 justify-between xl:items-center">
        <h1 className="lg:text-[40px] text-[30px] font-clash text-brand font-semibold">
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
                    activeTab === tab.key ? "text-[#064E3B]" : "text-neutral500"
                  }`}
                  // onMouseEnter={() => {
                  //   updateUnderline(index);
                  //   setActiveTab(tab.key);
                  //   sessionStorage.setItem("dashboardTab", tab.key);
                  // }}
                  onClick={() => {
                    updateUnderline(index);
                    setActiveTab(tab.key);
                    sessionStorage.setItem("dashboardTab", tab.key);
                  }}
                >
                  {/* <ViewIcon/> */}
                  {tab.label}
                </button>
              ))}

              {/* Active underline */}
              <div
                className="absolute bottom-0 h-[2.5px] bg-[#064E3B] transition-all duration-300 rounded-full"
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
        {activeTab === "overview" && <Overview data={userData}/>}
        {activeTab === "notifications" && (
          <Notifications setActiveTab={setActiveTab} />
        )}
        {activeTab === "bookings" && <Bookings />}
        {activeTab === "settings" && <ProfileSettings data={userData}/>}
        {activeTab === "security" && <Security data={userData}/>}
      </div>
    </div>
  );
};

export default Dashboard;
