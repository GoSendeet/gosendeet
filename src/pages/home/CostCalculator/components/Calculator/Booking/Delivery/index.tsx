import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Layout from "@/layouts/HomePageLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/InputField";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { allowOnlyNumbers, parseDateInput } from "@/lib/utils";
import { hasAuthSession } from "@/lib/authSession";
import { useGetUserDetails } from "@/queries/user/useGetUserDetails";
import { Stepper } from "@/components/ui/stepper";
import { UserRound } from "lucide-react";
import { track, EVENT } from "@/lib/analytics";

const inputClasses =
  "rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 !text-[#111827] !opacity-100 placeholder:!text-[#667085] focus:border-green500 focus:ring-2 focus:ring-green500/20";

const bookingSteps = [
  { label: "Route & Package" },
  { label: "Sender & Receiver" },
  { label: "Pickup Time" },
  { label: "Review & Pay" },
];

const schema = z.object({
  sender_name: z
    .string({ required_error: "Sender’s name is required" })
    .min(1, { message: "Name cannot be empty" }),
  sender_phone: z
    .string({ required_error: "Sender’s number is required" })
    .regex(/^(\+234|0)[7-9][0-9]{9}$/, {
      message: "Enter a valid Nigerian number (e.g. 08012345678 or +2348012345678)",
    }),
  sender_email: z
    .string()
    .email({ message: "Invalid Sender'semail address" })
    .or(z.literal(""))
    .optional(),
  receiver_name: z
    .string({ required_error: "Receiver’s name is required" })
    .trim()
    .min(1, { message: "Receiver's Name cannot be empty" })
    .regex(/^[A-Za-z\s'-]+$/, { message: "Name must contain only letters" }),
  receiver_phone: z
    .string({ required_error: "Receiver’s number is required" })
    .regex(/^(\+234|0)[7-9][0-9]{9}$/, {
      message: "Enter a valid Nigerian number (e.g. 08012345678 or +2348012345678)",
    }),
  receiver_email: z
    .string()
    .min(1, { message: "Receiver’s email is required" })
    .email({ message: "Invalid Receiver’s email address" }),
});

type DeliveryFormData = z.infer<typeof schema>;

const Delivery = () => {
  const location = useLocation();
  const { bookingRequest, bookingDetails } = location?.state || {};
  const userId = sessionStorage.getItem("userId") || "";
  const isAuthenticated = hasAuthSession();

  const currency = bookingDetails?.currency || "NGN";
  const basePrice = parseFloat(String(bookingDetails?.price || "0").replace(/[^\d.]/g, "")) || 0;
  const serviceCharge = bookingDetails?.serviceCharge ?? basePrice * 0.005;
  const amount = (basePrice + serviceCharge).toFixed(2);
  const draftKey = useMemo(
    () =>
      [
        "booking-contact-draft",
        bookingRequest?.packageTypeId,
        bookingRequest?.pickupLocation,
        bookingRequest?.dropOffLocation,
        bookingRequest?.weight,
      ]
        .filter(Boolean)
        .join(":"),
    [
      bookingRequest?.dropOffLocation,
      bookingRequest?.packageTypeId,
      bookingRequest?.pickupLocation,
      bookingRequest?.weight,
    ]
  );
  const savedDraft = useMemo<Partial<DeliveryFormData>>(() => {
    try {
      return JSON.parse(sessionStorage.getItem(draftKey) || "{}");
    } catch {
      return {};
    }
  }, [draftKey]);

  const navigate = useNavigate();
  useEffect(() => {
    if (!userId || !isAuthenticated) {
      toast.error("Please sign in to continue");
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    }
  }, [isAuthenticated, navigate, userId]);

  const { data: userData, refetchUserData } = useGetUserDetails(userId);

  useEffect(() => {
    if (userId) {
      refetchUserData();
    }
  }, [userId]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
    watch,
  } = useForm<DeliveryFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      sender_name: savedDraft.sender_name ?? "",
      sender_phone: savedDraft.sender_phone ?? "",
      sender_email: savedDraft.sender_email ?? "",
      receiver_name: savedDraft.receiver_name ?? "",
      receiver_phone: savedDraft.receiver_phone ?? "",
      receiver_email: savedDraft.receiver_email ?? "",
    },
  });

  useEffect(() => {
    if (userData?.data) {
      reset({
        sender_name: savedDraft.sender_name ?? userData.data.username ?? "",
        sender_phone: savedDraft.sender_phone ?? userData.data.phone ?? "",
        sender_email: savedDraft.sender_email ?? userData.data.email ?? "",
        receiver_name: savedDraft.receiver_name ?? "",
        receiver_phone: savedDraft.receiver_phone ?? "",
        receiver_email: savedDraft.receiver_email ?? "",
      });
      setTimeout(() => setFocus("receiver_name"), 0);
    }
  }, [savedDraft, setFocus, userData, reset]);

  useEffect(() => {
    const subscription = watch((value) => {
      sessionStorage.setItem(draftKey, JSON.stringify(value));
    });

    return () => subscription.unsubscribe();
  }, [draftKey, watch]);

  useEffect(() => {
    setTimeout(() => setFocus("receiver_name"), 0);
  }, [setFocus]);

  const onSubmit = (data: DeliveryFormData) => {
    if (!userId || !isAuthenticated) {
      toast.error("Please sign in to continue");
      navigate("/signin");
      return;
    }

    track(EVENT.DELIVERY_DETAILS_SUBMITTED, {
      courier_name: bookingDetails?.courier?.name,
      pickup_location: bookingRequest?.pickupLocation,
      drop_off_location: bookingRequest?.dropOffLocation,
    });

    const payload = {
      // senderId: userId,
      packageTypeId: bookingRequest?.packageTypeId,
      packageName: bookingRequest?.packageName,
      weight: bookingRequest?.weight,
      receiverName: data.receiver_name,
      receiverPhone: data.receiver_phone,
      receiverEmail: data.receiver_email, // Nullable
      pickupLocation: bookingRequest?.pickupLocation,
      senderName: data.sender_name,
      senderPhoneNumber: data.sender_phone,
      senderEmail: data.sender_email,
      destination: bookingRequest?.dropOffLocation,
      courierCost: amount,
      tax: 0,
      currency: currency,
      pickupDate: parseDateInput(bookingDetails?.pickUpdateDate),
      pickupWindow: bookingDetails?.pickUpdateDate,
      companyId: bookingDetails?.courier?.id,
      estimatedDeliveryDate: parseDateInput(bookingDetails?.estimatedDeliveryDate),
      deliveryWindow: bookingDetails?.estimatedDeliveryDate,
      // Required fields from the quote response
      pudoMode: bookingDetails?.pudoMode,
      routeConfigId: bookingDetails?.routeConfigId,
      slaConfigId: bookingDetails?.slaConfigId,
      itemValue: Number(bookingRequest?.itemPrice) || 0,
      quotedItemValue: Number(bookingRequest?.itemPrice) || 0,
    };
    const nextBookingData = {
      courierName: bookingDetails?.courier?.name,
      ...payload,
    };
    sessionStorage.setItem(draftKey, JSON.stringify(data));

    navigate("/pickup-time", {
      state: { bookingData: nextBookingData },
    });
  };
  return (
    <Layout>
      <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <Stepper steps={bookingSteps} currentStep={2} className="mb-8" />

        <div className="mb-6">
          <div>
            <h1 className="font-clash text-3xl font-semibold leading-130 text-[#111827] sm:text-4xl">
              Who's sending and receiving?
            </h1>
            <p className="mt-2 text-base text-[#475467]">
              Add contact details so pickup and delivery can be coordinated.
            </p>
          </div>
        </div>

        <form
          id="delivery-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5"
        >
          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green500/10 text-green100">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-clash text-xl font-semibold text-[#111827]">
                    Sender details
                  </h2>
                  <p className="text-sm text-[#475467]">
                    Who is sending this package?
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="form-group w-full min-w-0">
                  <Input
                    label="Full name"
                    name="sender_name"
                    type="text"
                    placeholder="Enter sender full name"
                    register={register}
                    classes={inputClasses}
                  />
                  {errors.sender_name && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.sender_name.message}
                    </p>
                  )}
                </div>
                <div className="form-group w-full min-w-0">
                  <Input
                    label="Phone number"
                    name="sender_phone"
                    type="text"
                    placeholder="Enter sender phone number"
                    register={register}
                    classes={inputClasses}
                    onKeyDown={allowOnlyNumbers}
                  />

                  {errors.sender_phone && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.sender_phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group mt-0">
                <Input
                  label="Email"
                  name="sender_email"
                  type="text"
                  placeholder="Enter sender email address"
                  register={register}
                  classes={inputClasses}
                />
                {errors.sender_email && (
                  <p className="error text-xs text-[#FF0000]">
                    {errors.sender_email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-[#EAECF0] bg-white p-5 shadow-sm sm:p-6">
              <div className="mb-6 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green500/10 text-green100">
                  <UserRound className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-clash text-xl font-semibold text-[#111827]">
                    Receiver details
                  </h2>
                  <p className="text-sm text-[#475467]">
                    Who is receiving this package?
                  </p>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="form-group w-full min-w-0">
                  <Input
                    label="Full name"
                    name="receiver_name"
                    type="text"
                    placeholder="Enter receiver full name"
                    register={register}
                    classes={inputClasses}
                  />
                  {errors.receiver_name && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.receiver_name.message}
                    </p>
                  )}
                </div>
                <div className="form-group w-full min-w-0">
                  <Input
                    label="Phone number"
                    name="receiver_phone"
                    type="text"
                    placeholder="Enter receiver phone number"
                    register={register}
                    classes={inputClasses}
                    onKeyDown={allowOnlyNumbers}
                  />
                  {errors.receiver_phone && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.receiver_phone.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="form-group mt-0">
                <Input
                  label="Email"
                  name="receiver_email"
                  type="text"
                  placeholder="Enter receiver email address"
                  register={register}
                  classes={inputClasses}
                />
                {errors.receiver_email && (
                  <p className="error text-xs text-[#FF0000]">
                    {errors.receiver_email.message}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <Button
              type="submit"
              form="delivery-form"
              className="w-full rounded-full bg-green100 px-8 py-3 text-white hover:bg-green800 sm:w-auto"
              disabled={!userId || !isAuthenticated}
            >
              Continue to Pickup Time
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Delivery;
