import { Button } from "@/components/ui/button";
import Layout from "@/layouts/HomePageLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { payForBooking } from "@/services/user";
import { APP_BASE_URL } from "@/services/axios";
const Checkout = () => {
  const userId = sessionStorage.getItem("userId") || "";
  const location = useLocation();

  const { bookingId, bookingData } = location?.state || {};
  const successUrl = `${APP_BASE_URL}/success-page?bookingId=${bookingId}`;
  const errorUrl = `${APP_BASE_URL}/error-page?bookingId=${bookingId}`;

  const [isChecked, setIsChecked] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      toast.error("Please sign in to continue");
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    }
  }, [userId]);

    useEffect(() => {
    // If user somehow lands here after finishing a booking, redirect
    const bookingCompleted = sessionStorage.getItem("bookingCompleted");
    if (bookingCompleted) {
      navigate("/", { replace: true });
    }

    // Hard replace checkout history entry with "/" so back button never returns here
    window.history.replaceState(null, "", "/");
    sessionStorage.removeItem("bookingCompleted")

  }, []);

  const total = Number(bookingData?.tax) + Number(bookingData?.courierCost);

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      bookingId,
      successUrl,
      errorUrl,
    }: {
      bookingId: string;
      successUrl: string;
      errorUrl: string;
    }) => payForBooking(bookingId, successUrl, errorUrl),
    onSuccess: (data: any) => {
      toast.success("Successful");
      window.location.href = data?.data?.authorizationUrl;
    },
    onError: (data: any) => {
      toast.error(data?.message);
    },
  });

  const submit = () => {
    mutate({ bookingId, successUrl, errorUrl });
  };

  return (
    <Layout>
      <div className="py-10 xl:w-[70%] md:w-[80%] w-full mx-auto px-6 ">
        <p className="text-neutral600 font-medium leading-140 mb-2">Step 2/3</p>
        <h1 className="font-clash font-semibold text-2xl leading-130 mb-2">
          Checkout
        </h1>
        <p className="mb-4 text-neutral600">
          Your booking is on pending until payment is made here
        </p>

        <div className="flex md:flex-row flex-col gap-6 justify-between">
          <div className="lg:w-[65%] flex flex-col gap-6">
            <div className="p-4 relative bg-neutral100 border border-neutral200 rounded-xl">
              <h2 className="font-clash font-semibold text-md mt-1">
                Sender Details
              </h2>
              <hr className="border-b border-b-neutral200 my-4" />

              <div className="flex md:flex-row flex-col gap-6">
                <div className="md:w-1/2">
                  <p className="font-clash font-semibold mb-2">From</p>
                  <p className="font-medium text-sm">
                    {bookingData?.senderName}
                  </p>
                </div>
                <div className="md:w-1/2">
                  <p className="font-clash font-semibold mb-2">Phone Number</p>
                  <p className="font-medium text-sm">
                    {bookingData?.senderPhone}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <div className="p-4 relative bg-neutral100 border border-neutral200 rounded-xl">
                <h2 className="font-clash font-semibold text-md mt-1">
                  Receiver Details
                </h2>
                <hr className="border-b border-b-neutral200 mt-4 mb-6" />

                <div className="flex md:flex-row flex-col gap-6">
                  <div className="md:w-1/2">
                    <p className="font-clash font-semibold mb-2">To</p>
                    <p className="font-medium text-sm">
                      {bookingData?.receiverName}
                    </p>
                  </div>
                  <div className="md:w-1/2">
                    <p className="font-clash font-semibold mb-2">
                      Phone Number
                    </p>
                    <p className="font-medium text-sm">
                      {bookingData?.receiverPhone}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 relative bg-neutral100 border border-neutral200 rounded-xl">
                <h2 className="font-clash font-semibold text-md mt-1">
                  Payment Details
                </h2>
                <hr className="border-b border-b-neutral200 my-4" />
                <div className="flex gap-2 items-start mb-4">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 rounded
                      appearance-none cursor-pointer
                      border-2 border-green500 bg-white
                      hover:border-green500 hover:bg-purple50
                      transition-all duration-200
                      checked:bg-green500 checked:border-green500
                      checked:hover:bg-green500 checked:hover:border-green500
                      checked:before:content-['✔']
                      checked:before:text-white checked:before:text-xs
                      checked:before:flex checked:before:items-center checked:before:justify-center
                      shadow-sm focus:ring-2 focus:ring-green500 focus:ring-offset-1"
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <p className="text-sm">
                    By clicking this, I acknowledge that I have read and agree
                    with Sendeet Terms and Conditions.
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="rounded-full py-3 px-8 text-white bg-green100 hover:bg-green800"
                  disabled={!isChecked}
                  onClick={submit}
                  loading={isPending}
                >
                  {/* {isPending && <Loader2 className="h-6 w-6 animate-spin" />}  */}
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
          <div className="lg:w-[35%] flex">
            <div className="p-4 relative bg-neutral100 border border-neutral200 rounded-xl flex-1">
              <h2 className="font-clash font-semibold text-md mt-1">Summary</h2>
              <hr className="border-b border-b-neutral200 my-4" />

              <div className="flex flex-col gap-4">
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-neutral600">Pickup</span>
                  <span className="text-right">
                    {bookingData?.pickupLocation}
                  </span>
                </p>
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-neutral600">Pickup Date</span>
                  <span className="text-right">
                    {formatDate(bookingData?.pickupDate)}
                  </span>
                </p>
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-neutral600">Delivery</span>
                  <span className="text-right">{bookingData?.destination}</span>
                </p>
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-neutral600">Delivery Date</span>
                  <span className="text-right">
                    {formatDate(bookingData?.estimatedDeliveryDate)}
                  </span>
                </p>
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-neutral600">Logistics</span>
                  <span className="text-right">{bookingData?.courierName}</span>
                </p>
              </div>

              <hr className="border-b border-b-neutral200 my-10" />

              <h2 className="font-clash font-semibold text-md mt-1">
                Price Details
              </h2>
              <hr className="border-b border-b-neutral200 my-4" />

              <div className="flex flex-col gap-4">
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-neutral600">Subtotal</span>
                  <span className="text-right">
                    ₦ {bookingData?.courierCost}
                  </span>
                </p>
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-neutral600">Tax</span>
                  <span className="text-right">₦ {bookingData?.tax}</span>
                </p>
              </div>

              <hr className="border-b border-b-neutral200 my-6" />

              <p className="flex justify-between items-start gap-4 font-semibold">
                <span className="text-neutral600">Total</span>
                <span className="text-right">₦ {total}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
