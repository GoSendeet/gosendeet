import { Button } from "@/components/ui/button";
import Layout from "@/layouts/HomePageLayout";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { payForBooking } from "@/services/user";
import CurrencyFormatter from "@/components/CurrencyFormatter";
import {
  ArrowRight,
  Clock,
  LockKeyhole,
  MapPin,
  Navigation,
  Package,
  PencilLine,
} from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";

const APP_BASE_URL = window.location.origin.replace(/\/$/, "");
const bookingSteps = [
  { label: "Route & Package" },
  { label: "Sender & Receiver" },
  { label: "Pickup Time" },
  { label: "Review & Pay" },
];

const Checkout = () => {
  const userId = sessionStorage.getItem("userId") || "";
  const location = useLocation();

  const { bookingData } = location?.state || {};
  const successUrl = `${APP_BASE_URL}/success-page`;
  const errorUrl = `${APP_BASE_URL}/error-page`;

  const [isChecked, setIsChecked] = useState(false);
  const { data: packageTypes } = useGetPackageType({ minimize: true });
  const packages = Array.isArray(packageTypes?.data)
    ? packageTypes.data
    : packageTypes?.data?.content || [];
  const resolvedPackage = packages.find(
    (item: any) => String(item?.id) === String(bookingData?.packageTypeId)
  );
  const packageName =
    bookingData?.packageName ||
    resolvedPackage?.name ||
    resolvedPackage?.title ||
    "Package";
  const logisticsName = bookingData?.courierName || "Selected logistics partner";
  const discount = Number(bookingData?.discount ?? bookingData?.discountAmount ?? 0);

  const navigate = useNavigate();
  useEffect(() => {
    if (!userId) {
      toast.error("Please sign in to continue");
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    }
  }, [navigate, userId]);

  useEffect(() => {
    // If user somehow lands here after finishing a booking, redirect
    const bookingCompleted = sessionStorage.getItem("bookingCompleted");
    if (bookingCompleted) {
      navigate("/", { replace: true });
    }

    sessionStorage.removeItem("bookingCompleted");
  }, [navigate]);

  useEffect(() => {
    if (!bookingData) {
      toast.error("Booking details are missing. Please start again.");
      navigate("/", { replace: true });
    }
  }, [bookingData, navigate]);

  const total = Number(bookingData?.tax ?? 0) + Number(bookingData?.courierCost ?? 0);

  const ALLOWED_PAYMENT_ORIGINS = [
    "https://checkout.paystack.com",
    "https://standard.paystack.com",
    "https://paystack.com",
  ];

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      bookingData,
      successUrl,
      errorUrl,
    }: {
      bookingData: Record<string, unknown>;
      successUrl: string;
      errorUrl: string;
    }) => payForBooking(bookingData, successUrl, errorUrl),
    onSuccess: (data: any) => {
      const url: string = data?.data?.authorizationUrl ?? "";
      if (!url || !ALLOWED_PAYMENT_ORIGINS.some((origin) => url.startsWith(origin))) {
        toast.error("Invalid payment redirect. Please contact support.");
        return;
      }
      toast.success("Successful");
      window.location.href = url;
    },
    onError: (data: any) => {
      toast.error(data?.message);
    },
  });

  const submit = () => {
    if (!bookingData) {
      toast.error("Booking details are missing. Please start again.");
      return;
    }

    const {
      deliveryInstruction,
      pickupTimeSlot,
      pickupWindow,
      deliveryWindow,
      packageName: _packageName,
      specialHandling,
      ...paymentBookingData
    } = bookingData;
    mutate({ bookingData: paymentBookingData, successUrl, errorUrl });
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 pb-32 sm:px-6 lg:pb-8">
        <Stepper steps={bookingSteps} currentStep={4} className="mb-8" />

        <div className="mb-5">
          <div>
            <h1 className="font-clash text-3xl font-semibold leading-130 text-[#111827] sm:text-4xl">
              Review and pay
            </h1>
            <p className="mt-2 text-[#475467]">
              Review your delivery and complete payment.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)]">
          <div className="flex flex-col gap-6">
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-sm sm:p-6">
              <div className="divide-y divide-[#EAECF0]">
                <div className="grid gap-4 py-5 first:pt-0 sm:grid-cols-[3rem_minmax(0,1fr)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green500/10 text-green100">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Pickup
                    </p>
                    <p className="mt-2 break-words text-base font-medium text-[#111827]">
                      {bookingData?.pickupLocation}
                    </p>
                    <div className="mt-2 flex flex-col gap-2 text-sm text-[#475467] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                      <span className="break-words font-medium text-[#111827]">{bookingData?.senderName} (Sender)</span>
                      <span className="hidden text-[#667085] sm:inline">•</span>
                      <span className="break-words">{bookingData?.senderPhoneNumber}</span>
                      {bookingData?.senderEmail && (
                        <>
                          <span className="hidden text-[#667085] sm:inline">•</span>
                          <span className="break-words">{bookingData.senderEmail}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 py-5 sm:grid-cols-[3rem_minmax(0,1fr)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green500/10 text-green100">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Destination
                    </p>
                    <p className="mt-2 break-words text-base font-medium text-[#111827]">
                      {bookingData?.destination}
                    </p>
                    <div className="mt-2 flex flex-col gap-2 text-sm text-[#475467] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                      <span className="break-words font-medium text-[#111827]">{bookingData?.receiverName} (Receiver)</span>
                      <span className="hidden text-[#667085] sm:inline">•</span>
                      <span className="break-words">{bookingData?.receiverPhone}</span>
                      {bookingData?.receiverEmail && (
                        <>
                          <span className="hidden text-[#667085] sm:inline">•</span>
                          <span className="break-words">{bookingData.receiverEmail}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 py-5 last:pb-0 sm:grid-cols-[3rem_minmax(0,1fr)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green500/10 text-green100">
                    <Package className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
                      Package, pickup & instruction
                    </p>
                    <div className="mt-2 flex flex-col gap-2 text-sm text-[#475467] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                      <span className="font-medium text-[#111827]">
                        {packageName}
                        {bookingData?.weight ? ` • ${bookingData.weight}kg` : ""}
                      </span>
                      <span className="hidden text-[#667085] sm:inline">•</span>
                      <span className="inline-flex items-center gap-2">
                        <Clock className="h-4 w-4 text-green100" />
                        {formatDate(bookingData?.pickupDate)}
                        {bookingData?.pickupTimeSlot ? `, ${bookingData.pickupTimeSlot}` : ""}
                      </span>
                      <span className="hidden text-[#667085] sm:inline">•</span>
                      <span>Item value: ₦ {CurrencyFormatter(bookingData?.itemValue)}</span>
                      {bookingData?.specialHandling &&
                        bookingData.specialHandling !== "None" && (
                          <>
                            <span className="hidden text-[#667085] sm:inline">•</span>
                            <span>Handling: {bookingData.specialHandling}</span>
                          </>
                        )}
                    </div>
                    <p className="mt-3 break-words text-sm text-[#475467]">
                      {bookingData?.deliveryInstruction || "No delivery instruction added."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 rounded-xl border border-[#EAECF0] bg-white p-4 shadow-sm lg:sticky lg:top-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#667085]">Total amount</p>
              <p className="mt-1 font-clash text-3xl font-semibold text-green100">
                ₦ {CurrencyFormatter(total)}
              </p>

              <hr className="my-3 border-[#EAECF0]" />

              <div className="flex flex-col gap-2">
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-[#667085]">Logistics</span>
                  <span className="text-right text-[#111827]">{logisticsName}</span>
                </p>
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-[#667085]">Estimated Delivery</span>
                  <span className="text-right text-[#111827]">
                    {bookingData?.deliveryWindow || formatDate(bookingData?.estimatedDeliveryDate)}
                  </span>
                </p>
                {bookingData?.pickupWindow && (
                  <p className="flex justify-between items-start gap-4 font-medium text-sm">
                    <span className="text-[#667085]">Quoted Pickup</span>
                    <span className="text-right text-[#111827]">
                      {bookingData.pickupWindow}
                    </span>
                  </p>
                )}
                {bookingData?.pickupTimeSlot && (
                  <p className="flex justify-between items-start gap-4 font-medium text-sm">
                    <span className="text-[#667085]">Pickup Time</span>
                    <span className="text-right text-[#111827]">
                      {bookingData.pickupTimeSlot}
                    </span>
                  </p>
                )}
              </div>

              <hr className="my-3 border-[#EAECF0]" />

              <div className="flex flex-col gap-2">
                <p className="flex justify-between items-start gap-4 font-medium text-sm">
                  <span className="text-[#667085]">Delivery fee</span>
                  <span className="text-right text-[#111827]">
                    ₦ {CurrencyFormatter(bookingData?.courierCost)}
                  </span>
                </p>
                {discount > 0 && (
                  <p className="flex justify-between items-start gap-4 font-medium text-sm">
                    <span className="text-[#667085]">Discount</span>
                    <span className="text-right text-green100">
                      - ₦ {CurrencyFormatter(discount)}
                    </span>
                  </p>
                )}
              </div>

              <hr className="my-3 border-[#EAECF0]" />

              <p className="flex justify-between items-start gap-4 font-semibold">
                <span className="text-[#475467]">Total</span>
                <span className="text-right text-lg text-green100">₦ {CurrencyFormatter(total)}</span>
              </p>

              {/* Desktop-only: inline T&C + button */}
              <div className="mt-4 hidden lg:block">
                <label className="mb-4 flex cursor-pointer gap-3 rounded-lg border border-[#EAECF0] bg-[#FCFCFD] p-3">
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 shrink-0 rounded
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
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  <span className="text-sm leading-5 text-[#111827]">
                    I have reviewed this booking and agree with Sendeet Terms and Conditions.
                  </span>
                </label>

                <Button
                  type="submit"
                  className="w-full rounded-full bg-green100 px-8 py-3 text-white hover:bg-green800"
                  disabled={!isChecked}
                  onClick={submit}
                  loading={isPending}
                >
                  <LockKeyhole className="h-4 w-4" />
                  Proceed to Secure Payment
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <p className="mt-2 text-center text-xs text-[#667085]">
                  You will be redirected to complete payment securely.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 hidden lg:flex">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-[#D0D5DD] bg-white text-[#111827] hover:border-green500"
          >
            <PencilLine className="h-4 w-4" />
            Back to pickup time
          </Button>
        </div>

        {/* Mobile sticky bottom bar */}
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-[#EAECF0] bg-white px-4 pb-[env(safe-area-inset-bottom)] pt-3 shadow-[0_-2px_10px_rgba(0,0,0,0.06)] lg:hidden">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="mb-3 w-full border-[#D0D5DD] bg-white text-[#111827] hover:border-green500"
          >
            <PencilLine className="h-4 w-4" />
            Back to pickup time
          </Button>
          <label className="mb-3 flex cursor-pointer gap-3">
            <input
              type="checkbox"
              className="mt-0.5 h-5 w-5 shrink-0 rounded
                appearance-none cursor-pointer
                border-2 border-green500 bg-white
                transition-all duration-200
                checked:bg-green500 checked:border-green500
                checked:before:content-['✔']
                checked:before:text-white checked:before:text-xs
                checked:before:flex checked:before:items-center checked:before:justify-center"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <span className="text-xs leading-4 text-[#111827]">
              I agree with Sendeet Terms and Conditions.
            </span>
          </label>
          <Button
            type="submit"
            className="w-full rounded-full bg-green100 px-8 py-3 text-white hover:bg-green800"
            disabled={!isChecked}
            onClick={submit}
            loading={isPending}
          >
            <LockKeyhole className="h-4 w-4" />
            Pay ₦ {CurrencyFormatter(total)}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
