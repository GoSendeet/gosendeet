import { User, CreditCard, Truck, Bell } from "lucide-react";
import { useState } from "react";
import ProfileTab, { ProfileData, MOCK_PROFILE } from "./ProfileTab";
import CusstomerSupportCard from "@/components/ui/CusstomerSupportCard";
import BankTab from "./BankTab";
import VehicleTab from "./VehicleTab";
import AlertTab from "./AlertTab";

type Tab = "profile" | "bank" | "vehicle" | "alerts";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "bank", label: "Bank", icon: CreditCard },
  { key: "vehicle", label: "Vehicle", icon: Truck },
  { key: "alerts", label: "Alerts", icon: Bell },
];

type SettingsPageProps = {
  profile?: ProfileData | {
    id?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    email?: string;
    address?: string;
    partnerId?: string;
    franchiseId?: string;
    status?: string;
  };
};

const FranchiseSettings = ({ profile = MOCK_PROFILE }: SettingsPageProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("profile");
  return (
    <>
      <div
        className="w-full h-36 max-w-328 lg:min-h-28 rounded-2xl p-6 pb-0 opacity-100 flex flex-col"
        style={{
          background: "linear-gradient(90deg, #ECFDF5 0%, #FFFFFF 100%)",
        }}
      >
        <h1 className="text-sm lg:text-xl font-bold text-brand">
          Profile & Settings
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your account and preferences
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mt-6">

        <div className="flex flex-col gap-4 w-full max-w-2xl">
          {/* Tab bar */}
          <div className="flex items-center gap-1 bg-gray-100/80 rounded-2xl p-1">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center gap-1.5 flex-1 justify-center px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  activeTab === key
                    ? "bg-white text-gray-800 shadow-sm border border-gray-200"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <Icon size={14} />
                <span className="hidden xs:inline sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Panel */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            {activeTab === "profile" && <ProfileTab data={profile} />}
            {activeTab === "bank" && <BankTab /> }
            {activeTab === "vehicle" && <VehicleTab />}
            {activeTab === "alerts" && <AlertTab />}
          </div>
        </div>

        <CusstomerSupportCard />
      </div>
    </>
  );
};

export default FranchiseSettings;
