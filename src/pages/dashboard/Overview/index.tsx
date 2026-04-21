import { RxExternalLink } from "react-icons/rx";
import Bookings from "../Bookings";
import { cn } from "@/lib/utils";
// import CreateBooking from "@/components/CreateBooking";
import FormHorizontalBar from "@/pages/home/components/FormHorizontalBar";
import { useMutation } from "@tanstack/react-query";
import { resendVerification } from "@/services/auth";
import { toast } from "sonner";

const Overview = ({
  data,
  refetchUserData,
}: {
  data: any;
  refetchUserData?: () => void;
}) => {
  const username = data?.data?.username;
  const userStatus = data?.data?.status;
  const email = data?.data?.email;
  const isVerified = data?.data?.isVerified;

  const { mutate: resendVerificationEmail, isPending: isResending } =
    useMutation({
      mutationFn: resendVerification,
      onSuccess: (response) => {
        toast.success(response?.message || "Verification email sent.");
        refetchUserData?.();
      },
      onError: (error: { message?: string }) => {
        toast.error(error?.message || "Unable to resend verification email.");
      },
    });

  const handleResendVerification = () => {
    if (!email) {
      toast.error("We could not find an email address for this account.");
      return;
    }

    resendVerificationEmail(email);
  };

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

      {isVerified === false ? (
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-[#F59E0B] bg-[#FFFBEB] px-5 py-4 text-sm text-[#92400E] md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-clash text-base font-semibold text-[#78350F]">
              Verify your account to book shipments
            </h3>
            <p className="mt-1">
              You can get quotes now, but booking is available after email
              verification.
            </p>
          </div>
          <button
            type="button"
            onClick={handleResendVerification}
            disabled={isResending}
            className="w-full rounded-full bg-brand px-5 py-3 font-medium text-white transition hover:bg-green800 disabled:cursor-not-allowed disabled:opacity-70 md:w-fit"
          >
            {isResending ? "Sending..." : "Resend verification"}
          </button>
        </div>
      ) : null}

      <div className="flex lg:flex-row flex-col gap-8 mb-10">
        <div className="lg:w-[60%] rounded-3xl text-sm">
          {/* <h3 className="text-md font-clash font-semibold lg:mb-8 mb-12 py-6 px-4">
            Add New Shipment
          </h3> */}
          <FormHorizontalBar />
        </div>
        <div className="lg:w-[40%] bg-white xl:p-10 py-6 px-2 rounded-3xl">
          <h3 className="text-md font-clash font-semibold text-brand">Customer Support</h3>
          <p className="my-6 text-sm text-neutral600">
            Need help with your shipment, costing or anything at all?
          </p>

          <div className="mb-4">
            <button className="flex items-center gap-2 font-medium bg-brand border border-neutral300 rounded-full px-4 py-3 outline-neutral300">
              <RxExternalLink className="text-white text-xl" />
              <span className="text-white">Browse our FAQs</span>
            </button>
          </div>
          <div>
            <button className="flex items-center gap-2 font-medium bg-brand border border-neutral300 rounded-full px-4 py-3 outline-neutral300">
              <RxExternalLink className="text-white text-xl" />
              <span className="text-white">Contact our support</span>
            </button>
          </div>
        </div>
      </div>

      <Bookings />
    </div>
  );
};

export default Overview;
