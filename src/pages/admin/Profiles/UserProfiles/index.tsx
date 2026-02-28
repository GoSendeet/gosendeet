import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import Orders from "./Orders";
import LoginHistory from "./LoginHistory";
import { useGetSingleProfile } from "@/queries/admin/useGetAdminProfiles";
import { cn, formatTimestampToReadable, timeAgo } from "@/lib/utils";
import { Spinner } from "@/components/Spinner";
import { BiEditAlt } from "react-icons/bi";
import UpdateUserStatusModal from "../modals/UpdateUserStatusModal";
// import Settings from "./Settings";
const UserProfiles = () => {
  const navigate = useNavigate();
  const userId: string =  useParams().id || ""
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false);

  const { data, isLoading, isSuccess, isError } = useGetSingleProfile(userId);
  

  const userData = data?.data ?? {};

  const initialTab = sessionStorage.getItem("profileTab");
    const [activeTab, setActiveTab] = useState(initialTab || "orders");
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs = [
    { key: "orders", label: "Orders" },
    { key: "login", label: "Login History" },
    // { key: "settings", label: "Settings" },
  ];

//   useEffect(() => {
//   if (location.state?.id) {
//     sessionStorage.setItem("profileId", location.state.id);
//   }
// }, []);

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
  return (
    <>
      {isLoading && !isSuccess && (
        <div className="h-[80vh] w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {isError && !isLoading && (
        <div className="h-[80vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There was an error getting the data
          </p>
        </div>
      )}

      {!isLoading && isSuccess && data && (
        <div className="md:px-20 px-6 py-8 bg-neutral100">
          <div className="flex justify-between items-center mb-10">
            <Button
              variant={"ghost"}
              size={"ghost"}
              className=""
              onClick={() => navigate('/admin-dashboard')}
            >
              <FaArrowLeft />
              Back
            </Button>

            <Button
              variant={"secondary"}
              className="md:text-base text-sm bg-brand"
              onClick={() => setOpenUpdateStatus(true)}
            >
              <BiEditAlt />
              Update Status
            </Button>

            <UpdateUserStatusModal
              openUpdateStatus={openUpdateStatus}
              setOpenUpdateStatus={setOpenUpdateStatus}
              username={userData?.username}
              userId={userId}
              userStatus={userData?.status}
            />
          </div>

          <div className="grid xl:grid-cols-5 md:grid-cols-3 md:gap-6 gap-6 mb-8">
            <div>
              <p className="text-neutral600 text-sm mb-2">CONTACT</p>
              <p className="text-brand md:text-[20px] text-md font-inter font-semibold mb-2">
                {userData?.username ?? "--"}
              </p>
            </div>
            <div>
              <p className="text-neutral600 text-sm mb-2">EMAIL</p>
              <p className="text-brand md:text-[20px] text-md font-inter font-semibold ">
                {userData?.email ?? "--"}
              </p>
            </div>
            <div>
              <p className="text-neutral600 text-sm mb-2">PHONE</p>
              <p className="text-brand md:text-[20px] text-md font-inter font-semibold">
                {userData?.phone ?? "--"}
              </p>
            </div>
            <div>
              <p className="text-neutral600 text-sm mb-2">ACCOUNT CREATED</p>
              <p className="text-brand md:text-[20px] text-md font-inter font-semibold">
                {formatTimestampToReadable(userData.createdAt) ?? "--"}
              </p>
            </div>
            <div>
              <p className="text-neutral600 text-sm mb-2">ACCOUNT STATUS</p>
              <p
                className={cn(
                  userData.status === "active"
                    ? "bg-green100 text-white"
                    : "bg-[#FEF2F2] text-[#EC2D30]",
                  "px-4 py-1 w-fit font-medium rounded-2xl capitalize"
                )}
              >
                {userData.status}
              </p>
              <p className=" text-sm mt-2">
                {userData.lastLogin
                  ? `Logged in ${timeAgo(userData.lastLogin)}`
                  : "Never logged in"}
              </p>
            </div>
          </div>

          {/* Tab buttons */}
          <div className="overflow-x-auto">
            <div className="min-w-[635px] w-full">
              <div className="w-full border-b border-b-neutral300 h-[60px] flex md:gap-4 relative overflow-hidden">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.key}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    className={`relative px-4 font-medium md:text-base text-sm outline-white transition-colors duration-300 cursor-pointer ${
                      activeTab === tab.key
                        ? "text-brand"
                        : "text-brand"
                    }`}
                    // onMouseEnter={() => {
                    //   updateUnderline(index);
                    //   setActiveTab(tab.key);
                    //   sessionStorage.setItem("profileTab", tab.key);
                    // }}
                    onClick={() =>  {
                      updateUnderline(index);
                      setActiveTab(tab.key);
                      sessionStorage.setItem("profileTab", tab.key);
                    }}
                  >
                    {/* <ViewIcon/> */}
                    {tab.label}
                  </button>
                ))}

                {/* Active underline */}
                <div
                  className="absolute bottom-0 h-[2.5px] bg-brand transition-all duration-300 rounded-full"
                  style={{
                    left: underlineLeft,
                    width: underlineWidth,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
          {activeTab === "orders" && <Orders userId={userId} />}
            {activeTab === "login" && <LoginHistory userId={userId}/>}
            {/* {activeTab === "settings" && <Settings />} */}
          </div>
        </div>
      )}
    </>
  );
};

export default UserProfiles;
