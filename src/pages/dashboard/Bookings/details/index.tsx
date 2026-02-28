import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BiDetail } from "react-icons/bi";
import { FiDownloadCloud } from "react-icons/fi";
import { RxExternalLink } from "react-icons/rx";
import { cn, formatDateTime, formatStatus } from "@/lib/utils";
import { statusClasses } from "@/constants";
import { useGetBookingsById } from "@/queries/user/useGetUserBookings";
import { Spinner } from "@/components/Spinner";
import CurrencyFormatter from "@/components/CurrencyFormatter";

export function BookingDetails({ bookingData }: any) {
  const { data, isLoading, isSuccess, isError } = useGetBookingsById(
    bookingData.id
  );
  return (
    <Dialog>
      <DialogTrigger asChild>
        <p className="flex items-center gap-2 py-2 px-4 hover:bg-brand-light rounded-md cursor-pointer">
          <BiDetail size={18} /> View Details
        </p>
      </DialogTrigger>
      <DialogContent className="lg:max-w-[800px] md:max-w-[700px]">
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
            <DialogHeader>
              <DialogTitle>
                <p className="font-clash text-[20px] text-brand text-left font-semibold mt-2">
                  {bookingData?.trackingNumber}
                </p>
              </DialogTitle>
              <DialogDescription className="hidden"></DialogDescription>
            </DialogHeader>
            <div>
              <div className="flex justify-between items-center gap-2">
                <p className="flex items-center gap-2 w-fit border-offset-1 font-medium text-brand border-b-[1.5px] border-b-brand cursor-pointer">
                  <FiDownloadCloud />
                  Download
                </p>
                <p
                  className={cn(
                    statusClasses[bookingData?.status] ??
                      "bg-gray-100 text-gray-800", // fallback if status not found
                    "px-2 py-1 w-fit font-medium rounded-2xl text-xs"
                  )}
                >
                  {formatStatus(bookingData?.status)}
                </p>
                {/* <p className="px-4 py-1 w-fit font-medium rounded-2xl bg-[#FEF2F2] text-[#EC2D30]">
              Canceled
            </p> */}
                {/* <p className="px-4 py-1 w-fit font-medium rounded-2xl bg-neutral200 text-neutral600">Refunded</p> */}
              </div>
              <div className="grid md:grid-cols-3 gap-5 my-10">
                <div className="flex flex-col gap-2">
                  <p className="font-clash font-semibold text-brand ">From</p>
                  <p className="text-sm font-medium">
                    {bookingData?.senderName}
                  </p>
                  <p className="text-neutral600">
                    {data?.data?.pickupLocation}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-clash font-semibold text-brand">To</p>
                  <p className="text-sm font-medium">
                    {bookingData?.receiverName}
                  </p>
                  <p className="text-neutral600">{data?.data?.destination}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-clash font-semibold text-brand">Category</p>
                  <p className="text-sm">{bookingData?.packageType}</p>
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-5">
                <div className="flex flex-col gap-2">
                  <p className="font-clash font-semibold text-brand">Pickup Created</p>
                  <p className="text-sm">
                    {formatDateTime(bookingData?.bookingDate)}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-clash font-semibold text-brand">Logistics</p>
                  <p className="text-sm">{bookingData?.companyName}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-clash font-semibold text-brand">Parcel Weight</p>
                  <p className="text-sm">{`${bookingData?.weight} ${bookingData?.weightUnit} | ${bookingData?.length}x${bookingData?.width}x${bookingData?.height} ${bookingData?.dimensionsUnit}`}</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 my-10 text-sm">
                <p className="flex justify-between items-center md:px-8 px-4 text-brand">
                  Subtotal
                  <span className="font-clash font-semibold">
                    ₦ {data?.data?.cost?.subTotal}
                  </span>
                </p>
                <p className="flex justify-between items-center md:px-8 px-4 text-brand">
                  Shipping Fee
                  <span className="font-clash font-semibold">
                    ₦ {CurrencyFormatter(data?.data?.cost?.shippingFee)}
                  </span>
                </p>
                <p className="flex justify-between items-center md:px-8 px-4 text-brand">
                  Tax
                  <span className="font-clash font-semibold">
                    ₦ {CurrencyFormatter(data?.data?.cost?.tax ?? 0)}
                  </span>
                </p>
                <p className="flex justify-between  items-center md:px-8 px-4 py-4 font-clash font-semibold bg-brand-light rounded-full">
                  TOTAL COSTS + VAT
                  <span className="text-brand">₦ {CurrencyFormatter(data?.data?.cost?.total)}</span>
                </p>
              </div>
              <div className="flex md:flex-row flex-col justify-center gap-2 items-center mb-10">
                <p className="font-medium text-brand">Need help?</p>
                <button className="flex items-center gap-2 font-medium bg-brand border border-neutral300 rounded-full px-4 py-3 outline-neutral300">
                  <RxExternalLink className="text-white text-xl" />
                  <span className="text-white">Contact GoSendeet help</span>
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
