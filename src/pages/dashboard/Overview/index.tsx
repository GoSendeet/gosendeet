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
      <div className="flex justify-between md:items-center lg:mb-8 mb-16 md:px-4">
        <h2 className="font-clash font-semibold text-[20px] text-brand">
          Hello {username},
        </h2>

        <p
          className={cn(
            userStatus === "active"
              ? "bg-green900 text-white"
              : "bg-[#FEF2F2] text-[#EC2D30]",
            "px-4 py-1 w-fit font-medium font-clash rounded-2xl capitalize"
          )}
        >
          {userStatus}
        </p>
      </div>

      <div className="flex lg:flex-row flex-col gap-8 mb-10">
        <div className="lg:w-[60%] rounded-3xl text-sm">
          {/* <h3 className="text-md font-clash font-semibold lg:mb-8 mb-12 py-6 px-4">
            Add New Shipment
          </h3> */}
          <FormHorizontalBar />
        </div>
       
        <SupportPanel/>

      </div>

      <Bookings />
    </div>
  );
};

export default Overview;
