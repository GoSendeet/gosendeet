import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/images/logo-green.png";
import { HiBars3 } from "react-icons/hi2";
import { GoX } from "react-icons/go";
import { PiSignOutBold } from "react-icons/pi";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { logout } from "@/services/auth";
import { toast } from "sonner";
import { clearAuthSession } from "@/lib/authSession";
import { resetUser } from "@/lib/analytics";
import { useGetUserDetails } from "@/queries/user/useGetUserDetails";
import { cn } from "@/lib/utils";

const MAIN_TABS = [
  { key: "profiles", label: "Profiles" },
  { key: "orders", label: "Orders" },
  { key: "companies", label: "Companies" },
  { key: "approved-clients", label: "Approved Clients" },
  { key: "reports", label: "Reports" },
];

const MORE_TABS = [
  { key: "credentials", label: "Credentials" },
  { key: "notifications", label: "Notifications" },
  { key: "settings", label: "Settings" },
];

const ALL_TABS = [...MAIN_TABS, ...MORE_TABS];

const clearAdminListFilters = () => {
  sessionStorage.removeItem("savedStatus");
  sessionStorage.removeItem("savedLabel");
};

interface AdminNavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminNavbar = ({ activeTab, onTabChange }: AdminNavbarProps) => {
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [hasAvatarError, setHasAvatarError] = useState(false);
  const moreRef = useRef<HTMLLIElement>(null);

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

  useEffect(() => {
    if (userId) refetchUserData();
  }, [userId]);

  useEffect(() => {
    setHasAvatarError(false);
  }, [profileImage]);

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
    return <span>{letter || "A"}</span>;
  };

  const isMoreActive = MORE_TABS.some((t) => t.key === activeTab);

  // Close "More" dropdown when clicking outside
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

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
    clearAdminListFilters();
    onTabChange(key);
    navigate("/admin-dashboard");
    setNavOpen(false);
    setMoreOpen(false);
  };

  return (
    <nav className="w-full">
      <div className="flex justify-between items-center lg:py-5 py-4 xl:px-30 md:px-20 px-6 bg-white border-b border-b-neutral300">
        {/* Logo */}
        <div className="shrink-0">
          <Link to="/admin-dashboard">
            <img src={logo} alt="logo" className="h-8 md:h-9 w-auto" />
          </Link>
        </div>

        {/* Desktop: tab links */}
        <ul className="hidden lg:flex xl:space-x-8 lg:space-x-4 items-center">
          {MAIN_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <li key={tab.key}>
                <button
                  onClick={() => handleTabClick(tab.key)}
                  className={cn(
                    "py-2 text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "border-b-2 border-darkGreen text-[#064E3B]"
                      : "text-neutral600 hover:border-b-2 hover:border-darkGreen",
                  )}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}

          {/* More dropdown */}
          <li ref={moreRef} className="relative">
            <button
              onClick={() => setMoreOpen((o) => !o)}
              className={cn(
                "flex items-center gap-1 py-2 text-sm font-medium transition-colors",
                isMoreActive
                  ? "border-b-2 border-darkGreen text-[#064E3B]"
                  : "text-neutral600 hover:border-b-2 hover:border-darkGreen",
              )}
            >
              More
              <ChevronDown
                size={14}
                className={cn(
                  "transition-transform duration-200",
                  moreOpen && "rotate-180",
                )}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-neutral200 shadow-lg z-50 py-1">
                {MORE_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => handleTabClick(tab.key)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors hover:bg-neutral100",
                      activeTab === tab.key ? "text-[#064E3B]" : "text-neutral600",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </li>
        </ul>

        {/* Desktop: avatar + logout */}
        <div className="hidden lg:flex items-center gap-2">
          <div className="w-10 h-10 flex justify-center items-center font-bold text-md rounded-full text-white bg-brand overflow-hidden">
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

        {/* Mobile: avatar + hamburger */}
        <div className="lg:hidden flex items-center gap-4">
          <div className="w-10 h-10 flex justify-center items-center font-bold text-md rounded-full text-white bg-brand overflow-hidden">
            {renderAvatar()}
          </div>
          <button onClick={() => setNavOpen(!navOpen)}>
            <HiBars3 size={24} />
          </button>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {navOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setNavOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 h-full w-72 z-40 bg-white py-6 px-6 transition-transform duration-300 shadow-xl",
          navOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex justify-between items-center mb-6">
          <Link to="/admin-dashboard" onClick={() => setNavOpen(false)}>
            <img src={logo} alt="logo" className="h-7 w-auto" />
          </Link>
          <button onClick={() => setNavOpen(false)}>
            <GoX size={24} />
          </button>
        </div>

        {/* Avatar in sidebar */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral100">
          <div className="w-10 h-10 flex justify-center items-center font-bold text-md rounded-full text-white bg-brand overflow-hidden shrink-0">
            {renderAvatar()}
          </div>
          {username && (
            <span className="text-sm font-semibold text-neutral700 truncate">
              {username}
            </span>
          )}
        </div>

        <p className="text-xs font-semibold tracking-widest uppercase text-neutral400 mb-3">
          Navigation
        </p>

        <ul className="flex flex-col">
          {ALL_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <li
                key={tab.key}
                onClick={() => handleTabClick(tab.key)}
                className={cn(
                  "w-full cursor-pointer py-3 text-sm font-medium border-b border-neutral100",
                  isActive ? "text-[#064E3B] font-semibold" : "text-neutral600",
                )}
              >
                {tab.label}
              </li>
            );
          })}
        </ul>

        <div className="mt-8">
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

export default AdminNavbar;
