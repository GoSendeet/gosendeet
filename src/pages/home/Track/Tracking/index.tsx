import { Button } from "@/components/ui/button";
import Layout from "@/layouts/HomePageLayout";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import OrderHistory from "./components/OrderHistory";
import ItemDetails from "./components/ItemDetails";
import ReceiverDetails from "./components/ReceiverDetails";
import { cn, formatDateTime, formatStatus } from "@/lib/utils";
import { useGetTrackBookings } from "@/queries/user/useGetUserBookings";
import { statusClasses } from "@/constants";
import { Spinner } from "@/components/Spinner";
import RatingModal from "./components/RatingModal";

const Tracking = () => {
  const [activeTab, setActiveTab] = useState("history");
  const [underlineLeft, setUnderlineLeft] = useState(0);
  const [underlineWidth, setUnderlineWidth] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const location = useLocation();
  const { result } = location.state ?? {};
  const { data, isLoading, isSuccess, isError } = useGetTrackBookings(
    result?.data?.trackingNumber
  );

  const [openRatingModal, setOpenRatingModal] = useState(false);

  useEffect(() => {
    if (
      data?.data &&
      !data?.data?.hasRating &&
      data?.data?.status === "DELIVERED"
    ) {
      const timer = setTimeout(() => {
        setOpenRatingModal(true);
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [data?.data]); // Re-run when data changes

  const tabs = [
    { key: "history", label: "Order History" },
    { key: "order_details", label: "Order Details" },
    { key: "contact_details", label: "Contact Details" },
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

  return (
    <Layout>
      <div className="md:px-20 px-6 md:py-16 py-8">
        <div className="xl:w-[65%] md:w-[90%] mx-auto bg-neutral900 md:py-16 py-4 xl:px-24 md:px-10 px-4">
          {isLoading && !isSuccess && (
            <div className="h-[50vh] w-full flex items-center justify-center">
              <Spinner />
            </div>
          )}

          {isError && !isLoading && (
            <div className="h-[50vh] w-full flex justify-center flex-col items-center">
              <p className="font-semibold font-inter text-xl text-center">
                There was an error getting the data
              </p>
            </div>
          )}

          {!isLoading && isSuccess && data && data?.data?.length > 0 && (
            <>
              <div className="flex lg:flex-row flex-col lg:items-center gap-4 mb-6 lg:justify-between">
                <h1 className="lg:text-[40px] md:text-[30px] flex items-center md:gap-3 gap-2 text-2xl font-semibold font-inter tracking-tight">
                  Tracking <span>{data?.data?.trackingNumber}</span>
                </h1>

                <p
                  className={cn(
                    statusClasses[data?.data?.status] ??
                      "bg-gray-100 text-gray-800", // fallback if status not found
                    "px-2 py-1 w-fit font-medium rounded-2xl text-base"
                  )}
                >
                  {formatStatus(data?.data?.status)}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:text-base text-sm">
                <div className="flex flex-col gap-1">
                  <p className="text-md font-semibold font-inter tracking-tight">
                    Package Type
                  </p>
                  <p>{data?.data?.packageType?.name}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-md font-semibold font-inter tracking-tight">Weight</p>
                  <p>{`${data?.data?.maxWeight} ${data?.data?.weightUnit} | ${data?.data?.length}x${data?.data?.width}x${data?.data?.height} ${data?.data?.dimensionsUnit}`}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-md font-semibold font-inter tracking-tight">Courier</p>
                  <p>{data?.data?.company?.name}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-md font-semibold font-inter tracking-tight">
                    Pickup Created
                  </p>
                  <p>{formatDateTime(data?.data?.bookingDate)}</p>
                </div>
              </div>

              {/* Tab Buttons */}
              <div className="w-full border-b border-b-neutral300 md:h-[40px] h-[60px] flex md:gap-4 mt-6 relative overflow-hidden">
                {tabs.map((tab, index) => (
                  <button
                    key={tab.key}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    className={`relative z-10 px-4 font-medium md:text-base text-sm outline-white transition-colors duration-300 cursor-pointer ${
                      activeTab === tab.key ? "text-green500" : "text-black"
                    }`}
                    onClick={() => {
                      updateUnderline(index);
                      setActiveTab(tab.key);
                    }}
                  >
                    {tab.label}
                  </button>
                ))}

                {/* Active underline */}
                <div
                  className="absolute bottom-0 h-[1px] bg-green500 transition-all duration-300 rounded-full"
                  style={{
                    left: underlineLeft,
                    width: underlineWidth,
                  }}
                />
              </div>

              {/* Tab Content */}
              <div className="mt-4">
                {activeTab === "history" && (
                  <div className="md:text-base text-sm py-4">
                    <OrderHistory data={data} />
                  </div>
                )}
                {activeTab === "order_details" && <ItemDetails data={data} />}
                {activeTab === "contact_details" && (
                  <ReceiverDetails data={data} />
                )}
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center justify-center mt-5">
                <p className="font-medium">Need help with delivery</p>
                <Button variant="secondary">Contact Support</Button>
              </div>

              <RatingModal
                open={openRatingModal}
                onOpenRatingModal={setOpenRatingModal}
                bookingId={data?.data?.id}
              />
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Tracking;
