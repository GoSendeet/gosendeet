import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
// import { changePassword } from "@/services/auth";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import {
  // useGetCoverageArea,
  useGetCrossAreaRoute,
  // useGetLocationCode,
  useGetPackageType,
  useGetPickupOptions,
  // useGetServiceLevel,
} from "@/queries/admin/useGetAdminSettings";
import { MultiSelect } from "@/components/ui/multi";
import {
  createCompanyServices,
  updateCompanyServices,
} from "@/services/companies";
import { allowOnlyNumbers } from "@/lib/utils";

export function AddRoutesModal({
  companyId,
  openRoutesModal,
  setOpenRoutesModal,
  info,
  type,
  setInfo,
}: {
  companyId: string;
  openRoutesModal: boolean;
  setOpenRoutesModal: any;
  info: any;
  type: string;
  setInfo: any;
}) {
  const [selectedPickupOptions, setSelectedPickupOptions] = useState<string[]>(
    []
  );
  const [selectedPackageTypes, setSelectedPackageTypes] = useState<string[]>(
    []
  );
  // const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  // const [selectedRoutes, setSelectedRoutes] = useState<string[]>([]);

  const { data: pickup_options } = useGetPickupOptions({ minimize: true });
  const { data: package_types } = useGetPackageType({ minimize: true });
  // const { data: location_codes } = useGetLocationCode({ minimize: true });
  const { data: cross_area_routes } = useGetCrossAreaRoute({ minimize: true });
  // const { data: coverage_areas } = useGetCoverageArea({ minimize: true });

  const pickupOptions = pickup_options?.data?.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const packageOptions = package_types?.data?.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const routeOptions = cross_area_routes?.data?.map((item: any) => {
    return {
      label: item.areaA + " - " + item.areaB,
      value: item.id,
    };
  });

  const schema = z.object({
    crossAreaRouteId: z
      .string({ required_error: "Cross area route is required" })
      .min(1, { message: "Please select an option" }),
    pickupOptionIds: z
      .array(z.string())
      .nonempty({ message: "Select at least one pickup option" }),
    packageTypeIds: z
      .array(z.string())
      .nonempty({ message: "Select at least one package type" }),
    // basePrice: z
    //   .string({ required_error: "Base price is required" })
    //   .min(1, { message: "Please enter a base price" }),
    // weightMultiplier: z
    //   .string({ required_error: "Weight multiplier is required" })
    //   .min(1, { message: "Please enter a weight multiplier" }),
    // zoneMultiplier: z
    //   .string({ required_error: "Zone multiplier is required" })
    //   .min(1, { message: "Please enter a zone multiplier" }),
    // discountPercent: z
    //   .string({ required_error: "Discount percent is required" })
    //   .min(1, { message: "Please enter a discount percent" }),
    // crossAreaRouteIds: z
    //   .array(z.string())
    //   .nonempty({ message: "Select at least one cross area route" }),
    weightLimit: z
      .string({ required_error: "Weight limit is required" })
      .min(1, { message: "Please enter a limit" }),
    isNextDayDelivery: z.boolean(),
    numberOfDaysForPickup: z
      .string({ required_error: "Number of days is required" })
      .min(1, { message: "Please enter a limit" }),
    numberOfDaysForDelivery: z
      .string({ required_error: "Number of days is required" })
      .min(1, { message: "Please enter a limit" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      crossAreaRouteId: "",
      // coverageAreaId: "",
      pickupOptionIds: [],
      packageTypeIds: [],
      numberOfDaysForDelivery: "",
      numberOfDaysForPickup: "",
      weightLimit: "",
      isNextDayDelivery: false,
      // locationCodeIds: [],
      // crossAreaRouteIds: [],
    },
  });

  // Initialize once when `info` is available
  useEffect(() => {
    if (info?.pickupOptions) {
      const defaultIds = info.pickupOptions.map((item: any) => item.id);
      setSelectedPickupOptions(defaultIds);
      setValue("pickupOptionIds", defaultIds);
    }
    if (info?.packageTypes) {
      const defaultIds = info.packageTypes.map((item: any) => item.id);
      setSelectedPackageTypes(defaultIds);
      setValue("packageTypeIds", defaultIds);
    }
    // if (info?.locationCodes) {
    //   const defaultIds = info.locationCodes.map((item: any) => item.id);
    //   setSelectedLocations(defaultIds);
    //   setValue("locationCodeIds", defaultIds);
    // }
    // if (info?.crossAreaRoutes) {
    //   const defaultIds = info.crossAreaRoutes.map((item: any) => item.id);
    //   setSelectedRoutes(defaultIds);
    //   setValue("crossAreaRouteIds", defaultIds);
    // }
  }, [info]);

  // ✅ Reset form with incoming info when modal opens
  useEffect(() => {
    if (openRoutesModal && type === "edit" && info) {
      reset({
        crossAreaRouteId:
          info?.crossAreaRoute?.id ??
          info?.crossAreaRouteId ??
          info?.crossAreaRoute ??
          "",
        // coverageAreaId: info?.coverageArea?.id,
        pickupOptionIds: info?.pickupOptions?.map((item: any) => item.id) || [],
        packageTypeIds: info?.packageTypes?.map((item: any) => item.id) || [],
        // locationCodeIds: info?.locationCodes?.map((item: any) => item.id) || [],
        // crossAreaRouteIds:
        //   info?.crossAreaRoutes?.map((item: any) => item.id) || [],
        weightLimit: info.weightLimit?.toString() ?? "",
        isNextDayDelivery: info?.isNextDayDelivery ?? false,
        numberOfDaysForPickup: info.numberOfDaysForPickup?.toString() ?? "",
        numberOfDaysForDelivery: info.numberOfDaysForDelivery?.toString() ?? "",
      });
    } else if (openRoutesModal && type === "create") {
      setInfo(null);
      reset({
        pickupOptionIds: [], // empty array for multi-select
        packageTypeIds: [],
        // locationCodeIds: [],
        // crossAreaRouteIds: [],
        // coverageAreaId: "",
        weightLimit: "",
        isNextDayDelivery: false,
        numberOfDaysForPickup: "",
        numberOfDaysForDelivery: "",
      });
      setSelectedPickupOptions([]);
      setSelectedPackageTypes([]);
      // setSelectedLocations([]);
      // setSelectedRoutes([]);
    }
  }, [openRoutesModal, info, type, reset]);
  const queryClient = useQueryClient();

  const { mutate: createServices, isPending: pendingCreate } = useMutation({
    mutationFn: createCompanyServices,
    onSuccess: () => {
      toast.success("Successful");
      reset({
        // coverageAreaId: "",
        crossAreaRouteId: "",
        pickupOptionIds: [],
        packageTypeIds: [],
        // locationCodeIds: [],
        // crossAreaRouteIds: [],
        isNextDayDelivery: false,
      });
      setSelectedPickupOptions([]);
      setSelectedPackageTypes([]);
      // setSelectedRoutes([]);
      setOpenRoutesModal(false);
      queryClient.invalidateQueries({
        queryKey: ["company_services"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: updateServices, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCompanyServices(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpenRoutesModal(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["company_services"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    type === "create" && createServices({ ...data, companyId: companyId });

    type === "edit" &&
      updateServices({
        id: info?.id,
        data: {
          ...data,
          companyId: companyId,
        },
      });
  };

  return (
    <Dialog open={openRoutesModal} onOpenChange={setOpenRoutesModal}>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] text-brand font-semibold font-inter mb-2">
          {type === "create" ? "Add a new route" : "Edit a company route"}
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          {type === "create" ? "Create" : "Edit"} a route for this
          company by defining the route details and other custom details.
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:gap-5 gap-4"
            >
              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col w-full">
                  <label htmlFor="name" className="font-inter text-brand font-semibold">
                    Select Cross Area Route
                  </label>
                  <div className="border-b mb-2">
                    <input type="hidden" {...register("crossAreaRouteId")} />
                    {/* <MultiSelect
                      options={routeOptions}
                      value={selectedRoutes}
                      placeholder="Select options"
                      // value={selected || []}
                      onChange={(val) => {
                        setSelectedRoutes(val);
                        setValue(
                          "crossAreaRouteIds",
                          val as [string, ...string[]]
                        );
                      }}
                    /> */}
                    <Select
                      onValueChange={(val) =>
                        setValue("crossAreaRouteId", val, { shouldValidate: true })
                      }
                      defaultValue={
                        info?.crossAreaRoute?.id ??
                        info?.crossAreaRouteId ??
                        info?.crossAreaRoute
                      }
                      disabled={type === "edit"}
                    >
                      <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent w-full py-2 px-0">
                        <SelectValue placeholder="Select option"  />
                      </SelectTrigger>
                      <SelectContent >
                        {type === "create" &&
                          routeOptions?.map(
                            (item: any, index: number) => (
                              <SelectItem
                                value={item.value}
                                key={index}
                              >
                                {item.label}
                              </SelectItem>
                            )
                          )}
                        {/* {type === "edit" &&
                          service_level &&
                          service_level?.data?.content?.map(
                            (item: any, index: number) => (
                              <SelectItem value={item.id} key={index}>
                                {item.name}
                              </SelectItem>
                            )
                          )} */}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.crossAreaRouteId && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.crossAreaRouteId.message}
                    </p>
                  )}
                </div>

              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="packageType"
                    className="font-inter text-brand font-semibold"
                  >
                    Select package type
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b mb-2">
                    <MultiSelect
                      options={packageOptions}
                      value={selectedPackageTypes}
                      placeholder="Select options"
                      // value={selected || []}
                      onChange={(val) => {
                        setSelectedPackageTypes(val);
                        setValue(
                          "packageTypeIds",
                          val as [string, ...string[]]
                        );
                      }}
                    />
                  </div>
                  {errors.packageTypeIds && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.packageTypeIds.message}
                    </p>
                  )}
                </div>
                {/* <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="coverageArea"
                    className="font-inter font-semibold"
                  >
                    Select coverage area
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b mb-2">
                    <Select
                      onValueChange={(val) => setValue("coverageAreaId", val)}
                      defaultValue={info?.coverageArea?.id}
                    >
                      <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent w-full py-2 px-0">
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        {coverage_areas?.data?.map(
                          (item: any, index: number) => (
                            <SelectItem value={item.id} key={index}>
                              {item.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.coverageAreaId && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.coverageAreaId.message}
                    </p>
                  )}
                </div> */}
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                {/* <div className="flex flex-col lg:w-1/2 w-full">
                  <label htmlFor="name" className="font-inter font-semibold">
                    Select location code
                  </label>
                  <div className="border-b mb-2">
                    <MultiSelect
                      options={locationOptions}
                      value={selectedLocations}
                      placeholder="Select options"
                      onChange={(val) => {
                        setSelectedLocations(val);
                        setValue(
                          "locationCodeIds",
                          val as [string, ...string[]]
                        );
                      }}
                    />
                  </div>
                  {errors.locationCodeIds && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.locationCodeIds.message}
                    </p>
                  )}
                </div> */}

                            <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="pickupOption"
                    className="font-inter text-brand font-semibold"
                  >
                    Select pickup option
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b mb-2">
                    <MultiSelect
                      options={pickupOptions}
                      value={selectedPickupOptions}
                      placeholder="Select options"
                      // value={selected || []}
                      onChange={(val) => {
                        setSelectedPickupOptions(val);
                        setValue(
                          "pickupOptionIds",
                          val as [string, ...string[]]
                        );
                      }}
                    />
                  </div>
                  {errors.pickupOptionIds && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.pickupOptionIds.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col lg:w-1/2 w-full">
                  <label htmlFor="name" className="font-inter text-brand font-semibold">
                    Weight limit (kg)
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("weightLimit")}
                      defaultValue={info?.weightLimit}
                      placeholder="Enter weight limit"
                      className="w-full outline-0 border-b-0 py-2 "
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.weightLimit && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.weightLimit.message}
                    </p>
                  )}
                </div>
              </div>
              {/* <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="basePrice"
                    className="font-inter text-brand font-semibold"
                  >
                    Base Price
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("basePrice")}
                      defaultValue={info?.basePrice}
                      placeholder="Enter base price"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.basePrice && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.basePrice.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="discountPercent"
                    className="font-inter text-brand font-semibold"
                  >
                    Discount Percent
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("discountPercent")}
                      defaultValue={info?.discountPercent}
                      placeholder="Enter discount percentage"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.discountPercent && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.discountPercent.message}
                    </p>
                  )}
                </div>
              </div> */}
              {/* <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="weightMultiplier"
                    className="font-inter text-brand font-semibold"
                  >
                    Weight Multiplier
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("weightMultiplier")}
                      defaultValue={info?.weightMultiplier}
                      placeholder="Enter weight multiplier"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.weightMultiplier && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.weightMultiplier.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="zoneMultiplier"
                    className="font-inter text-brand font-semibold"
                  >
                    Zone Multiplier
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("zoneMultiplier")}
                      defaultValue={info?.zoneMultiplier}
                      placeholder="Enter zone multiplier"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.zoneMultiplier && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.zoneMultiplier.message}
                    </p>
                  )}
                </div>
              </div> */}
              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="numberOfDaysForPickup"
                    className="font-inter text-brand font-semibold"
                  >
                    Number of days for pickup
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("numberOfDaysForPickup")}
                      defaultValue={info?.numberOfDaysForPickup}
                      placeholder="Enter number of days"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.numberOfDaysForPickup && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.numberOfDaysForPickup.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="numberOfDaysForDelivery"
                    className="font-inter text-brand font-semibold"
                  >
                    Number of days for delivery
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("numberOfDaysForDelivery")}
                      defaultValue={info?.numberOfDaysForDelivery}
                      placeholder="Enter number of days"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.numberOfDaysForDelivery && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.numberOfDaysForDelivery.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  defaultChecked={info?.isNextDayDelivery}
                  onCheckedChange={(val) => setValue("isNextDayDelivery", val)}
                />
                <label htmlFor="name" className="font-inter text-brand font-semibold">
                  Allow next day delivery
                </label>
              </div>

              <Button
                variant={"secondary"}
                className=" w-fit bg-brand"
                loading={type === "create" ? pendingCreate : pendingUpdate}
              >
                {type === "create" ? "Add Route" : "Edit Route"}
              </Button>
            </form>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
