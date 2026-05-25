import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo-green.png";
import { HiBars3 } from "react-icons/hi2";
import { GoX } from "react-icons/go";
import { useGetUserDetails } from "@/queries/user/useGetUserDetails";
import { PiSignOutBold } from "react-icons/pi";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth";
import { toast } from "sonner";
import { clearAuthSession } from "@/lib/authSession";
import { resetUser } from "@/lib/analytics";

const DASHBOARD_TABS = [
  { key: "overview", label: "Overview" },
  { key: "notifications", label: "Notifications" },
  { key: "bookings", label: "Bookings" },
  { key: "settings", label: "Profile Settings" },
  { key: "security", label: "Security" },
];

interface DashboardNavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const DashboardNavbar = ({ activeTab, onTabChange }: DashboardNavbarProps) => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [hasAvatarError, setHasAvatarError] = useState(false);

  const userId = sessionStorage.getItem("userId") || "";
  const storedProfileImage = sessionStorage.getItem("profileImage") || "";
  const { data: userData, refetchUserData } = useGetUserDetails(userId);

  const profile = userData?.data;
  const username = profile?.username;
  const letter = username?.charAt(0).toUpperCase();
  const profileImage =
    profile?.profilePicture ||
    profile?.profileImage ||
    profile?.avatar ||
    profile?.imageUrl ||
    profile?.picture ||
    profile?.photoUrl ||
    profile?.photo ||
    storedProfileImage;

  const renderAvatar = () => {
    if (profileImage && !hasAvatarError) {
      return (
        <img
          src={profileImage}
          alt={username ? `${username}'s profile picture` : "Profile picture"}
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          onError={() => setHasAvatarError(true)}
        />
      );
    }
    return <span>{letter || "U"}</span>;
  };

  useEffect(() => {
    if (userId) refetchUserData();
  }, [userId]);

  useEffect(() => {
    setHasAvatarError(false);
  }, [profileImage]);

  const { mutate, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      resetUser();
      clearAuthSession();
      navigate("/signin");
    },
    onError: (error: any) => {
      toast.error(error?.error);
    },
  });

  const handleTabClick = (key: string) => {
    onTabChange?.(key);
    setNavOpen(false);
  };

  return (
    <nav className="w-full">
      <div className="flex justify-between items-center lg:py-5 py-4 xl:px-30 md:px-20 px-6 bg-white border-b border-b-neutral300">
        {/* Logo */}
        <div>
          <Link to="/dashboard">
            <img src={logo} alt="logo" className="h-8 md:h-9 w-auto" />
          </Link>
        </div>

        {/* Mobile: avatar + hamburger */}
        <div className="lg:hidden flex items-center gap-4">
          <div className="w-10 h-10 flex justify-center items-center font-bold text-md rounded-full text-white bg-brand">
            {renderAvatar()}
          </div>
          <button onClick={() => setNavOpen(!navOpen)}>
            <HiBars3 size={24} />
          </button>
        </div>

        {/* Desktop: tab links */}
        {onTabChange && (
          <ul className="hidden lg:flex xl:space-x-10 lg:space-x-5">
            {DASHBOARD_TABS.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <li key={tab.key} className="text-center cursor-pointer">
                  <button
                    onClick={() => handleTabClick(tab.key)}
                    className={`block py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "border-b-2 border-darkGreen text-[#064E3B]"
                        : "text-neutral600 hover:border-b-2 hover:border-darkGreen"
                    }`}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {/* Desktop: avatar + logout */}
        <div className="hidden lg:flex lg:flex-row items-center gap-2">
          <div className="w-10 h-10 flex justify-center items-center font-bold text-md rounded-full text-white bg-brand">
            {renderAvatar()}
          </div>
          <Button
            variant="ghost"
            className="h-10"
            loading={isPending}
            onClick={() => mutate()}
          >
            Log out <PiSignOutBold />
          </Button>
        </div>

        {/* Mobile sidebar */}
        <div
          className={`lg:hidden absolute top-0 left-0 w-full h-[70vh] z-20 bg-white py-6 md:px-20 px-10 transition-transform duration-300 ${
            navOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-sm tracking-widest uppercase text-neutral500">
              Menu
            </p>
            <button onClick={() => setNavOpen(false)}>
              <GoX size={26} />
            </button>
          </div>

          {onTabChange && (
            <ul className="flex flex-col my-10">
              {DASHBOARD_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <li
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={`w-full cursor-pointer py-3 text-base font-medium border-b border-neutral100 ${
                      isActive ? "text-[#064E3B]" : "text-neutral600"
                    }`}
                  >
                    {tab.label}
                  </li>
                );
              })}
            </ul>
          )}

          <Button
            className="border-2 w-full font-semibold px-4 py-4 bg-black text-white rounded"
            loading={isPending}
            onClick={() => mutate()}
          >
            Log Out
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
