import Bookings from "../Bookings";
import { cn } from "@/lib/utils";
// import CreateBooking from "@/components/CreateBooking";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import SupportPanel from "@/components/SupportPanel";

const Overview = ({ data }: { data: any }) => {
  const username = data?.data?.username;
  const userStatus = data?.data?.status;

  return (
    <div>
      <div className="flex items-center justify-between lg:-mt-6 lg:mb-10 mb-16 md:px-4 gap-3">
        <div className="hidden lg:block items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <p className="font-clash text-brand uppercase tracking-widest font-semibold">
              Dashboard Overview
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col min-w-0">
            <p className="text-xs text-grey200 uppercase tracking-widest font-medium">
              Welcome back
            </p>
            <h2 className="font-clash font-semibold text-[22px] text-brand truncate">
              {username}
            </h2>
          </div>
          <span
            className={cn(
              userStatus === "active"
                ? "bg-brabd-light2 text-brand"
                : "bg-[#FEF2F2] text-[#EC2D30]",
              "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize shrink-0",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                userStatus === "active" ? "bg-brand" : "bg-[#EC2D30]",
              )}
            />
            {userStatus}
          </span>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col gap-8 mb-10">
        <div className="lg:w-[60%] rounded-3xl text-sm">
          <FormHorizontalBar />
        </div>

        <SupportPanel />
      </div>

      <Bookings />
    </div>
  );
};

export default Overview;
