import { useEffect } from "react";
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

const Delivery = () => {
  const location = useLocation();
  const { bookingRequest, bookingDetails } = location?.state || {};
  const userId = sessionStorage.getItem("userId") || "";
  const isAuthenticated = hasAuthSession();

  const currency = bookingDetails?.currency || "NGN";
  const basePrice = parseFloat(String(bookingDetails?.price || "0").replace(/[^\d.]/g, "")) || 0;
  const serviceCharge = bookingDetails?.serviceCharge ?? basePrice * 0.005;
  const amount = (basePrice + serviceCharge).toFixed(2);

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

  const schema = z.object({
    sender_name: z
      .string({ required_error: "Sender’s name is required" })
      .min(1, { message: "Name cannot be empty" }),
    sender_phone: z
      .string({ required_error: "Sender’s number is required" })
      .regex(/^\+?[0-9]{11,15}$/, {
        message: "Invalid phone number",
      }),
    sender_email: z
      .string()
      .email({ message: "Invalid Sender'semail address" })
      .or(z.literal("")) // allow empty string
      .optional(),
    receiver_name: z
      .string({ required_error: "Receiver’s name is required" })
      .trim()
      .min(1, { message: "Receiver's Name cannot be empty" })
      .regex(/^[A-Za-z\s'-]+$/, { message: "Name must contain only letters" }),

    receiver_phone: z
      .string({ required_error: "Receiver’s number is required" })
      .min(1, { message: "Receiver’s number cannot be empty" })
      .min(11, { message: "Receiver’s number must be at least 11 digits" })
      .max(15, { message: "Receiver’s number must be at most 15 digits" })
      .regex(/^\+?[0-9]{11,15}$/, {
        message: "Receiver’s number is invalid",
      }),

    receiver_email: z
      .string()
      .min(1, { message: "Receiver’s email is required" })
       .email({ message: "Invalid Receiver’s email address" }),
    // .or(z.literal("")) // allow empty string
    // .optional(),
   
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      sender_name: "",
      sender_phone: "",
      sender_email: "",
      receiver_name: "",
      receiver_phone: "",
      receiver_email: "",
    },
  });

  useEffect(() => {
    if (userData?.data) {
      reset({
        sender_name: userData.data.username ?? "",
        sender_phone: userData.data.phone ?? "",
        sender_email: userData.data.email ?? "",
        receiver_name: "",
        receiver_phone: "",
        receiver_email: "",
      });
    }
  }, [userData, reset]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!userId || !isAuthenticated) {
      toast.error("Please sign in to continue");
      navigate("/signin");
      return;
    }

    const payload = {
      // senderId: userId,
      packageTypeId: bookingRequest?.packageTypeId,
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
      companyId: bookingDetails?.courier?.id,
      estimatedDeliveryDate: parseDateInput(bookingDetails?.estimatedDeliveryDate),
      // Required fields from the quote response
      pudoMode: bookingDetails?.pudoMode,
      routeConfigId: bookingDetails?.routeConfigId,
      slaConfigId: bookingDetails?.slaConfigId,
      itemValue: Number(bookingRequest?.itemPrice) || 0,
    };
    const nextBookingData = {
      courierName: bookingDetails?.courier?.name,
      ...payload,
    };

    navigate("/checkout", {
      state: { bookingData: nextBookingData },
    });
  };
  return (
    <Layout>
      <div className="py-10 xl:w-[70%] md:w-[80%] w-full mx-auto px-6 ">
        <p className="text-neutral600 font-medium leading-140 mb-2">Step 1/3</p>
        <h1 className="font-clash font-semibold text-2xl leading-130 mb-2">
          Delivery Details
        </h1>
        <p className="mb-4 text-neutral600">Complete the details below </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 md:p-8 p-4 relative bg-neutral100 border border-neutral200 rounded-xl"
        >
          <div className="flex md:flex-row flex-col gap-8 justify-between">
            {/* Sender’s Name */}
            <div className="form-group w-full">
              <Input
                label="Sender’s Name"
                name="sender_name"
                type="text"
                placeholder="Enter your name"
                register={register}
                // disabled
              />
              {errors.sender_name && (
                <p className="error text-xs text-[#FF0000]">
                  {errors.sender_name.message}
                </p>
              )}
            </div>
            {/* Sender’s Phone Number */}
            <div className="form-group w-full">
              <Input
                label="Sender’s Phone Number"
                name="sender_phone"
                type="text"
                placeholder="Enter your phone number"
                register={register}
                // disabled={Boolean(senderPhone)}
                onKeyDown={allowOnlyNumbers}
              />

              {errors.sender_phone && (
                <p className="error text-xs text-[#FF0000]">
                  {errors.sender_phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Sender’s Email */}
          <div className="form-group">
            <Input
              label="Sender’s Email"
              name="sender_email"
              type="text"
              // disabled
              placeholder="Enter your email"
              register={register}
            />
            {errors.sender_email && (
              <p className="error text-xs text-[#FF0000]">
                {errors.sender_email.message}
              </p>
            )}
          </div>

          <div className="flex md:flex-row flex-col gap-8 justify-between">
            {/* Receiver’s  Name */}
            <div className="form-group w-full">
              <Input
                label="Receiver’s  Name"
                name="receiver_name"
                type="text"
                placeholder="Enter receiver's name"
                register={register}
              />
              {errors.receiver_name && (
                <p className="error text-xs text-[#FF0000]">
                  {errors.receiver_name.message}
                </p>
              )}
            </div>
            {/* Receiver’s  Phone Number */}
            <div className="form-group w-full">
              <Input
                label="Receiver’s  Phone Number"
                name="receiver_phone"
                type="text"
                placeholder="Enter receiver's phone number"
                register={register}
                onKeyDown={allowOnlyNumbers}
              />
              {errors.receiver_phone && (
                <p className="error text-xs text-[#FF0000]">
                  {errors.receiver_phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Receiver’s Email */}
          <div className="form-group">
            <Input
              label="Receiver’s Email"
              name="receiver_email"
              type="text"
              placeholder="Enter receiver's email"
              register={register}
            />
            {errors.receiver_email && (
              <p className="error text-xs text-[#FF0000]">
                {errors.receiver_email.message}
              </p>
            )}
          </div>



          {/* Submit Button */}
          <div className="">
            <Button
              type="submit"
              className=" rounded-full py-3 px-8 bg-green100 hover:bg-green800"
              disabled={!userId || !isAuthenticated}
            >
              Proceed to Checkout
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default Delivery;
