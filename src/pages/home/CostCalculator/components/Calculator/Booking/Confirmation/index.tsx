import Layout from "@/layouts/HomePageLayout";
import { Button } from "@/components/ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetBookingsById } from "@/queries/user/useGetUserBookings";
import { Spinner } from "@/components/Spinner";
import { formatDate } from "@/lib/utils";
import { trackBookingsHandler } from "@/hooks/useTrackBookings";
import { Check } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { verifyBookingPayment } from "@/services/user";
import CurrencyFormatter from "@/components/CurrencyFormatter";
import openChatwootChat from "@/lib/openChatwootChat";

const Confirmation = () => {
  const [searchParams] = useSearchParams();
  const reference =
    searchParams.get("reference") || searchParams.get("trxref") || "";
  const [bookingId, setBookingId] = useState("");
  const [verificationComplete, setVerificationComplete] = useState(false);

  const { data, isLoading, isSuccess, isError } = useGetBookingsById(bookingId);

  const userId = sessionStorage.getItem("userId") || "";
  const navigate = useNavigate();

  useEffect(() => {
    // sessionStorage.setItem("bookingCompleted", "true");
    if (!userId) {
      toast.error("Please sign in to continue");
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    }
  }, [navigate, userId]);
  const [loading, setLoading] = useState(false);

  const { mutate: verifyPayment, isPending: isVerifyingPayment } = useMutation({
    mutationFn: verifyBookingPayment,
    onSuccess: (response: any) => {
      const paymentStatus = response?.data?.status;
      const verifiedBookingId = response?.data?.bookingId;

      if (paymentStatus !== "SUCCESS") {
        toast.error(response?.data?.message || "Payment was not successful.");
        navigate("/error-page", { replace: true });
        return;
      }

      if (!verifiedBookingId) {
        toast.error("Payment succeeded, but the order could not be created.");
        navigate("/error-page", { replace: true });
        return;
      }

      setBookingId(verifiedBookingId);
      setVerificationComplete(true);
      sessionStorage.setItem("bookingCompleted", "true");
    },
    onError: (error: any) => {
      toast.error(error?.message || "We could not verify your payment.");
      navigate("/error-page", { replace: true });
    },
  });

  useEffect(() => {
    if (!reference) {
      toast.error("Payment reference is missing.");
      navigate("/error-page", { replace: true });
      return;
    }

    verifyPayment(reference);
  }, [navigate, reference, verifyPayment]);

  useEffect(() => {
    const handleBack = () => {
      navigate("/", { replace: true });
    };

    // Only runs when user presses BACK
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  // useEffect(() => {
  //   // Step 1: Replace the checkout history entry with the success page
  //   window.history.replaceState(null, "", window.location.pathname);

  //   // Step 2: Push home onto history
  //   window.history.pushState(null, "", "/");

  //   // Step 3: Push the success page back on top
  //   window.history.pushState(null, "", window.location.pathname);

  //   // Step 4: Intercept the back button
  //   const handleBack = () => {
  //     navigate("/", { replace: true });
  //   };

  //   window.addEventListener("popstate", handleBack);

  //   return () => {
  //     window.removeEventListener("popstate", handleBack);
  //   };
  // }, [navigate]);

  const onSubmit = () => {
    trackBookingsHandler(data?.data?.trackingNumber, navigate, setLoading);
  };


  return (
    <Layout>
      {(isVerifyingPayment ||
        (verificationComplete && isLoading && !isSuccess)) && (
        <div className="h-[50vh] w-full flex items-center justify-center">
          <Spinner />
        </div>
      )}

      {verificationComplete && isError && !isLoading && (
        <div className="h-[50vh] w-full flex justify-center flex-col items-center">
          <p className="font-semibold font-inter text-xl text-center">
            There was an error getting the data
          </p>
        </div>
      )}

      {verificationComplete &&
        !isLoading &&
        isSuccess &&
        data &&
        data?.data && (
          <div className="py-10 xl:w-[70%] md:w-[80%] w-full mx-auto px-6 ">
            <div className="flex lg:flex-row flex-col gap-6 justify-between ">
              <div className="lg:w-[65%] flex flex-col gap-6">
                <div className="px-4 py-20 bg-neutral900 rounded-xl">
                  <div className="flex flex-col gap-2 justify-center items-center text-center">
                    <div className="w-[70px] h-[70px] rounded-full bg-green500 text-white flex justify-center items-center">
                      <Check size={50} />
                    </div>
                    <h2 className="font-clash font-semibold text-2xl mt-1">
                      Order Placed Successfully
                    </h2>

                    <div className="text-neutral600 md:w-[90%] mb-6">
                      <p>Sit back and relax. </p>
                      <p>
                        Your order is being processed and you will get a
                        response from us in approximately 15 minutes.
                      </p>
                    </div>
                    <Button
                      onClick={onSubmit}
                      loading={loading}
                      className=" bg-green500 hover:bg-green800 text-white"
                    >
                      Track Order Progress
                    </Button>
                  </div>

                  <div className="flex md:flex-row flex-col gap-4 items-center justify-center mt-20">
                    <p className="font-medium">Need help with delivery?</p>
                    <Button variant="secondary" onClick={openChatwootChat}>
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
              <div className="lg:w-[35%] flex">
                <div className="p-4 relative bg-neutral100 border border-neutral200 rounded-xl flex-1">
                  <h2 className="font-clash font-semibold text-md mt-1">
                    Summary
                  </h2>
                  <hr className="border-b border-b-neutral200 my-2" />

                  <div className="flex flex-col gap-6 mb-6">
                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">To</span>
                      <span className="text-right">
                        {data?.data?.receiver?.name}
                      </span>
                    </p>
                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">Phone Number</span>
                      <span className="text-right">
                        {data?.data?.receiver?.phoneNumber}
                      </span>
                    </p>
                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">Destination</span>
                      <span className="text-right">
                        {data?.data?.receiver?.address}
                      </span>
                    </p>
                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">Pickup Date</span>
                      <span className="text-right">
                        {formatDate(data?.data?.pickupDate)}
                      </span>
                    </p>
                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">Logistics</span>
                      <span className="text-right">
                        {data?.data?.company?.name}
                      </span>
                    </p>
                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">Delivery Date</span>
                      <span className="text-right">
                        {formatDate(data?.data?.estimatedDeliveryDate)}
                      </span>
                    </p>
                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">Tracking Number</span>
                      <span className="text-right font-semibold">
                        {data?.data?.trackingNumber}
                      </span>
                    </p>
                  </div>

                  <hr className="border-b border-b-neutral200 my-6" />

                  <h2 className="font-clash font-semibold text-md mt-1">
                    Price Details
                  </h2>
                  <hr className="border-b border-b-neutral200 my-2" />

                  <div className="flex flex-col gap-6">
                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">Subtotal</span>
                      <span className="text-right">
                        ₦ {CurrencyFormatter(data?.data?.cost?.subTotal)}
                      </span>
                    </p>

                    <p className="flex justify-between items-center font-medium text-sm">
                      <span className="text-neutral600">Tax</span>
                      <span className="text-right">
                        {data?.data?.cost?.tax
                          ? `₦${CurrencyFormatter(data?.data?.cost?.tax)}`
                          : "--"}
                      </span>
                    </p>
                  </div>

                  <hr className="border-b border-b-neutral200 my-4" />

                  <p className="flex justify-between items-center font-semibold">
                    <span className="text-neutral600">Total</span>
                    <span className="text-right">
                      ₦ {CurrencyFormatter(data?.data?.cost?.total)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      {verificationComplete &&
        data &&
        !data?.data &&
        !isLoading &&
        isSuccess && (
          <div className="h-[50vh] w-full flex justify-center flex-col items-center">
            <p className="font-semibold font-inter text-xl text-center">
              There are no results
            </p>
          </div>
        )}
    </Layout>
  );
};

export default Confirmation;
