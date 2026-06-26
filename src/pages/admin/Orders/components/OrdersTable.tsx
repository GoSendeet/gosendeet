import { Link } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";

import MobileCard from "@/components/MobileCard";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { statusClasses } from "@/constants";
import { cn, formatDateTime, formatStatus } from "@/lib/utils";

export type OrdersTableVariant = "admin" | "company" | "profile";

type OrdersTableProps = {
  orders: any[];
  variant: OrdersTableVariant;
};

const getDetailPath = (item: any, index: number, variant: OrdersTableVariant) => {
  if (variant === "admin") return `/admin-dashboard/order/${item?.id}`;
  if (variant === "profile") return `/admin-dashboard/order/${item?.id}`;
  return `/admin-dashboard/order/${index}`;
};

const parcelWeight = (item: any) =>
  `${item?.weight} ${item?.weightUnit} | ${item?.length}x${item?.width}x${item?.height} ${item?.dimensionsUnit}`;

const StatusBadge = ({ status }: { status: string }) => (
  <span
    className={cn(
      statusClasses[status] ?? "bg-gray-100 text-gray-800",
      "inline-flex w-fit rounded-2xl px-2 py-1 text-xs font-medium",
    )}
  >
    {formatStatus(status)}
  </span>
);

const RowActions = ({
  item,
  index,
  variant,
  showRefund = false,
}: {
  item: any;
  index: number;
  variant: OrdersTableVariant;
  showRefund?: boolean;
}) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="rounded-md border border-neutral200 p-1">
        <BsThreeDotsVertical size={20} className="p-1 cursor-pointer" />
      </button>
    </PopoverTrigger>
    <PopoverContent className="w-fit p-1">
      <Link
        to={getDetailPath(item, index, variant)}
        state={{ bookingData: item }}
      >
        <p className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 hover:bg-brand-light">
          View full details
        </p>
      </Link>
      {showRefund && (
        <p className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 hover:bg-brand-light">
          Refund
        </p>
      )}
    </PopoverContent>
  </Popover>
);

const MobileOrderCard = ({
  item,
  index,
  variant,
}: {
  item: any;
  index: number;
  variant: OrdersTableVariant;
}) => (
  <MobileCard>
    <div className="mb-2 flex justify-end">
      <RowActions
        item={item}
        index={index}
        variant={variant}
        showRefund={variant === "profile"}
      />
    </div>
    <div className="space-y-2 text-sm">
      {variant !== "profile" && (
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-brand">Customer</span>
          <span className="truncate">{item?.senderName}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-brand">Tracking #</span>
        <span className="truncate">{item?.trackingNumber}</span>
      </div>
      {variant !== "company" && (
        <div className="flex items-center justify-between gap-3">
          <span className="font-medium text-brand">Courier</span>
          <span className="truncate">{item?.companyName}</span>
        </div>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-brand">
          {variant === "profile" ? "Category" : "Package Type"}
        </span>
        <span className="truncate">{item?.packageType}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-brand">Parcel Weight</span>
        <span className="truncate">{parcelWeight(item)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-brand">Pickup Created</span>
        <span className="truncate">{formatDateTime(item?.bookingDate)}</span>
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-brand">Status</span>
        <StatusBadge status={item?.status} />
      </div>
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium text-brand">Progress</span>
        <span className="truncate">{item?.currentProgress}</span>
      </div>
    </div>
  </MobileCard>
);

export function OrdersTable({ orders, variant }: OrdersTableProps) {
  const showCustomer = variant !== "profile";
  const showCourier = variant !== "company";

  return (
    <div className="overflow-x-auto">
      <div className={variant === "profile" ? "md:hidden" : "lg:hidden"}>
        {orders.map((item, index) => (
          <MobileOrderCard
            key={item?.id ?? index}
            item={item}
            index={index}
            variant={variant}
          />
        ))}
      </div>

      <div
        className={cn(
          variant === "profile" ? "hidden md:block" : "hidden lg:block",
        )}
      >
        <div className="min-w-[1100px] w-full">
          <div className="flex w-full justify-between bg-purple300 px-3 py-4 text-left font-inter text-md font-semibold text-brand xl:px-4">
            <span className="mr-4 w-[1%]">
              <input type="checkbox" className="mt-[2px]" />
            </span>
            {showCustomer ? (
              <span className="flex-1">Customer</span>
            ) : (
              <span className="flex-1">Tracking Number</span>
            )}
            {showCourier && <span className="flex-1">Courier</span>}
            <span className="flex-1">
              {variant === "profile" ? "Category" : "Package Type"}
            </span>
            <span className="flex-1">Parcel Weight</span>
            <span className="flex-1">Pickup Created</span>
            <span className={variant === "profile" ? "w-[10%]" : "flex-1"}>
              Status
            </span>
            <span className={variant === "profile" ? "w-[10%]" : "flex-1"}>
              Progress
            </span>
            <span className="w-[2%]" />
          </div>

          {orders.map((item, index) => (
            <div
              key={item?.id ?? index}
              className="relative flex min-h-[60px] items-center border-b border-b-neutral300 bg-white px-3 text-sm hover:bg-brand-light xl:px-4"
            >
              <span className="mr-4 w-[1%]">
                <input type="checkbox" className="mt-1" />
              </span>
              <div className="flex-1">
                {showCustomer ? (
                  <>
                    <p className="font-medium">{item?.senderName}</p>
                    <p>{item?.trackingNumber}</p>
                  </>
                ) : (
                  <p>{item?.trackingNumber}</p>
                )}
              </div>
              {showCourier && (
                <div className="flex-1">
                  <p>{item?.companyName}</p>
                </div>
              )}
              <div className="flex-1">
                <p>{item?.packageType}</p>
              </div>
              <div className="flex-1">
                <p>{parcelWeight(item)}</p>
              </div>
              <div className="flex-1">
                <p>{formatDateTime(item?.bookingDate)}</p>
              </div>
              <div className={variant === "profile" ? "w-[10%]" : "flex-1"}>
                <StatusBadge status={item?.status} />
              </div>
              <div className={variant === "profile" ? "w-[10%]" : "flex-1"}>
                {item?.currentProgress}
              </div>
              <div className="w-[2%]">
                <RowActions
                  item={item}
                  index={index}
                  variant={variant}
                  showRefund={variant === "profile"}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
