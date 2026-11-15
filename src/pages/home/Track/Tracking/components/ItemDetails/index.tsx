import { formatDate } from "@/lib/utils";

const ItemDetails = ({ data }: any) => {
  const pudoMode = data?.data?.pudoMode;
  const isStoreDropoff = pudoMode === "STORE_DROPOFF";
  const stationName = data?.data?.dropOffStationName;
  const stationAddress = data?.data?.dropOffStationAddress;

  return (
    <div className="grid md:grid-cols-2 gap-y-8 gap-x-4 md:text-base text-sm py-4">
      <div className="flex flex-col gap-2">
        <p className="font-semibold font-clash">Pickup Location</p>
        <p>{data?.data?.pickupLocation}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold font-clash">Pickup Date</p>
        <p className="">{formatDate(data?.data?.pickupDate)}</p>
      </div>
      {pudoMode && (
        <div className="flex flex-col gap-2">
          <p className="font-semibold font-clash">Pickup Option</p>
          <p>{isStoreDropoff ? "Store Drop-off" : "Doorstep Pickup"}</p>
        </div>
      )}
      {isStoreDropoff && stationName && (
        <div className="flex flex-col gap-2">
          <p className="font-semibold font-clash">Drop-off Station</p>
          <p>{stationName}</p>
          {stationAddress && (
            <p className="text-neutral500 text-sm">{stationAddress}</p>
          )}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <p className="font-semibold font-clash">Estimated Delivery Date</p>
        <p>{formatDate(data?.data?.estimatedDeliveryDate)}</p>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-semibold font-clash">Actual Delivery Date</p>
        <p>
          {data?.data?.actualDeliveryDate
            ? formatDate(data?.data?.actualDeliveryDate)
            : "--"}
        </p>
      </div>
    </div>
  );
};

export default ItemDetails;
