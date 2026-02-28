import { Button } from "@/components/ui/button";
import MobileCard from "@/components/MobileCard";
import { FaArrowLeft } from "react-icons/fa6";
import { useLocation, useNavigate } from "react-router-dom";
import { BiEditAlt } from "react-icons/bi";
import { useState } from "react";
import { UpdateProgressModal } from "../modals/UpdateProgressModal";
import { cn, formatDate, formatDateTime, formatStatus } from "@/lib/utils";
import CurrencyFormatter from "@/components/CurrencyFormatter";
import { statusClasses } from "@/constants";
import { useGetBookingsById } from "@/queries/user/useGetUserBookings";
import { Spinner } from "@/components/Spinner";
import OrderHistory from "@/pages/home/Track/Tracking/components/OrderHistory";
import { TaskManagementSection } from "../TaskManagement";

const OrderDetails = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { bookingData } = location?.state ?? {};
  const { data, isLoading, isSuccess, isError } = useGetBookingsById(
    bookingData.id
  );
  return (
    <div className="md:px-20 px-6 py-8 bg-neutral100">
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
          <div className="flex justify-between items-center mb-8">
            <Button
              variant={"ghost"}
              size={"ghost"}
              className=""
              onClick={() => navigate(-1)}
            >
              <FaArrowLeft />
              Back
            </Button>

            <Button
              variant={"secondary"}
              className="md:text-base text-sm bg-brand"
              onClick={() => setOpen(true)}
            >
              <BiEditAlt />
              Update Progress
            </Button>
          </div>

          <div className="grid xl:grid-cols-4 grid-cols-2 md:gap-6 gap-6 mb-4">
            <div>
              <p className="text-neutral600 text-sm mb-2">CONTACT</p>
              <p className="text-brand md:text-[20px] text-sm font-inter font-semibold mb-2">
                {data?.data?.sender?.username}
              </p>
            </div>
            <div>
              <p className="text-neutral600 text-sm mb-2">EMAIL</p>
              <p className="text-brand md:text-[20px] text-sm font-inter font-semibold break-all">
                {data?.data?.sender?.email}
              </p>
            </div>
            <div>
              <p className="text-neutral600 text-sm mb-2">TRACKING NUMBER</p>
              <p className="text-brand md:text-[20px] text-sm font-inter font-semibold ">
                {data?.data?.trackingNumber}
              </p>
            </div>
            <div>
              <p className="text-neutral600 text-sm mb-3">STATUS</p>
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
          </div>
          {/* Card UI for first table structure (mobile) */}
          <div className="xl:hidden mb-4">
            <MobileCard>
              <div className="mb-4">
                <p className="font-semibold bg-brand-light p-3 rounded-md text-brand mb-2">Order Details</p>
                <div className="mb-2">
                  <span className="block text-neutral600 text-xs mb-1">Pickup Created</span>
                  <span className="block text-neutral800 text-sm">{formatDateTime(data?.data?.bookingDate)}</span>
                </div>
                <div className="mb-2">
                  <span className="block text-neutral600 text-xs mb-1">Pickup Date</span>
                  <span className="block text-neutral800 text-sm">{formatDate(data?.data?.pickupDate)}</span>
                </div>
                <div className="mb-2">
                  <span className="block text-neutral600 text-xs mb-1">Estimated Delivery</span>
                  <span className="block text-neutral800 text-sm">{formatDate(data?.data?.estimatedDeliveryDate)}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-semibold text-brand mb-2 bg-brand-light p-3 rounded-md">Company Details</p>
                <span className="block text-neutral800 text-sm">{data?.data?.company?.name}</span>
              </div>
              <div>
                <p className="font-semibold text-brand mb-2 bg-brand-light p-3 rounded-md">Order Summary</p>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral600 text-xs">Subtotal</span>
                  <span className="text-neutral800 text-sm">₦ {CurrencyFormatter(data?.data?.cost?.subTotal)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral600 text-xs">Shipping Fee</span>
                  <span className="text-neutral800 text-sm">₦ {CurrencyFormatter(data?.data?.cost?.shippingFee)}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral600 text-xs">Tax</span>
                  <span className="text-neutral800 text-sm">₦ {CurrencyFormatter(data?.data?.cost?.tax ?? 0)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-brand">Total</span>
                  <span className="text-brand">₦ {CurrencyFormatter(data?.data?.cost?.total)}</span>
                </div>
              </div>
            </MobileCard>
          </div>
          {/* Table UI for desktop */}
          <div className="hidden xl:flex xl:flex-row flex-col gap-8 mb-4">
            <div className="w-full">
              <div className="overflow-x-auto">
                <div className="min-w-[600px] w-full relative">
                  <div className="flex justify-between text-brand text-left px-3 xl:px-4 py-4 gap-4 text-md font-inter font-semibold bg-brand-light w-full">
                    <span className="flex-1">Order Details</span>
                    <span className="flex-1">Company Details</span>
                    <span className="flex-1">Order Summary</span>
                  </div>
                  <div className="flex justify-between text-left px-3 gap-4 xl:px-4 py-4 w-full bg-white">
                    <div className="flex-1 text-sm">
                      <div className="mb-8">
                        <p className="font-medium mb-2 text-brand">Pickup Created</p>
                        <p>{formatDateTime(data?.data?.bookingDate)}</p>
                      </div>
                      <div className="mb-8">
                        <p className="font-medium mb-2 text-brand">Pickup Date</p>
                        <p>{formatDate(data?.data?.pickupDate)}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-2 text-brand">Estimated Delivery Date</p>
                        <p>{formatDate(data?.data?.estimatedDeliveryDate)}</p>
                      </div>
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="mb-16">
                        <p className="font-medium mb-2 text-brand">Company</p>
                        <p>{data?.data?.company?.name}</p>
                      </div>
                    </div>
                    <div className="flex-1 text-sm">
                      <div className="flex justify-between items-center mb-2 pr-6">
                        <p className="text-neutral600">Subtotal</p>
                        <p className="text-neutral800">₦ {CurrencyFormatter(data?.data?.cost?.subTotal)}</p>
                      </div>
                      <div className="flex justify-between items-center mb-2 pr-6">
                        <p className="text-neutral600">Shipping Fee</p>
                        <p className="text-neutral800">₦ {CurrencyFormatter(data?.data?.cost?.shippingFee)}</p>
                      </div>
                      <div className="flex justify-between items-center mb-2 pr-6">
                        <p className="text-neutral600">Tax</p>
                        <p className="text-neutral800">₦ {CurrencyFormatter(data?.data?.cost?.tax ?? 0)}</p>
                      </div>
                      <div className="flex justify-between items-center mb-2 pr-6 font-medium">
                        <p className="text-brand">Total</p>
                        <p className="text-brand">₦ {CurrencyFormatter(data?.data?.cost?.total)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* second table structure */}
          {/* Card UI for second table structure (mobile) */}
          <div className="xl:hidden mb-4">
            <MobileCard>
              <div className="mb-4">
                <p className="font-semibold text-brand mb-2 bg-brand-light p-3 rounded-md">Parcel Specs</p>
                <div className="mb-2">
                  <span className="block text-neutral600 text-xs mb-1">Parcel Weight</span>
                  <span className="block text-neutral800 text-sm">{`${bookingData?.weight} ${bookingData?.weightUnit} | ${bookingData?.length}x${bookingData?.width}x${bookingData?.height} ${bookingData?.dimensionsUnit}`}</span>
                </div>
                <div>
                  <span className="block text-neutral600 text-xs mb-1">Category</span>
                  <span className="block text-neutral800 text-sm">{bookingData?.packageType}</span>
                </div>
              </div>
              <div className="mb-4">
                <p className="font-semibold text-brand mb-2 bg-brand-light p-3 rounded-md">Pick From</p>
                <span className="block text-brand font-medium mb-1">{data?.data?.sender?.username}</span>
                <span className="block text-neutral600 text-sm mb-1">{data?.data?.pickupLocation}</span>
                <span className="block text-neutral600 text-sm">{data?.data?.sender?.phone}</span>
              </div>
              <div>
                <p className="font-semibold text-brand mb-2 bg-brand-light p-3 rounded-md">Ship To</p>
                <span className="block text-brand font-medium mb-1">{data?.data?.receiver?.name}</span>
                <span className="block text-neutral600 text-sm mb-1">{data?.data?.destination}</span>
                <span className="block text-neutral600 text-sm">{data?.data?.receiver?.phoneNumber}</span>
              </div>
            </MobileCard>
          </div>
          {/* Table UI for desktop */}
          <div className="hidden xl:block overflow-x-auto">
            <div className="min-w-[600px] w-full relative mb-4">
              <div className="flex justify-between text-left px-3 xl:px-4 py-4 gap-4 text-brand text-md font-inter font-semibold bg-brand-light w-full">
                <span className="flex-1">Parcel Specs</span>
                <span className="flex-1">Pick From</span>
                <span className="flex-1">Ship To</span>
              </div>
              <div className="flex justify-between text-left px-3 gap-4 xl:px-4 py-4 w-full bg-white">
                <div className="flex-1 text-sm">
                  <div className="mb-8">
                    <p className="font-medium mb-2 text-brand">Parcel Weight</p>
                    <p>{`${bookingData?.weight} ${bookingData?.weightUnit} | ${bookingData?.length}x${bookingData?.width}x${bookingData?.height} ${bookingData?.dimensionsUnit}`}</p>
                  </div>
                  <div>
                    <p className="font-medium mb-2 text-brand">Category</p>
                    <p>{bookingData?.packageType}</p>
                  </div>
                </div>
                <div className="flex-1 text-sm">
                  <div className="mb-8">
                    <p className="font-medium mb-2 text-brand">{data?.data?.sender?.username}</p>
                    <p className="text-neutral600 mb-2">{data?.data?.pickupLocation}</p>
                    <p className="text-neutral600">{data?.data?.sender?.phone}</p>
                  </div>
                </div>
                <div className="flex-1 text-sm">
                  <div className="mb-8">
                    <p className="font-medium mb-2 text-brand">{data?.data?.receiver?.name}</p>
                    <p className="text-neutral600 mb-2">{data?.data?.destination}</p>
                    <p className="text-neutral600">{data?.data?.receiver?.phoneNumber}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <TaskManagementSection
            bookingId={bookingData.id}
            pickupAddress={data?.data?.pickupLocation}
            dropoffAddress={data?.data?.destination}
            trackingNumber={data?.data?.trackingNumber}
          />

          <div className="mt-12">
            <div className="px-3 xl:px-4 py-4 text-md font-inter text-brand font-semibold bg-brand-light w-full">
              <p>Delivery Progress</p>
            </div>
            <div className="grid gap-4 text-sm px-3 xl:px-4 py-4 bg-white mb-6">
              <OrderHistory data={data} />
            </div>
          </div>

          <UpdateProgressModal
            open={open}
            setOpen={setOpen}
            bookingId={bookingData.id}
            progress={bookingData?.currentProgress}
            status={data?.data?.status}
          />
        </>
      )}
    </div>
  );
};

export default OrderDetails;
