import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useGetCrossAreaRoute,
  useGetPackageType,
  useGetServiceLevel,
} from "@/queries/admin/useGetAdminSettings";
import {
  createCompanyServices,
  updateCompanyServices,
} from "@/services/companies";
import { allowOnlyNumbers } from "@/lib/utils";
import { CustomInput } from "@/components/CustomInput";

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
  const [selectedServiceLevels, setSelectedServiceLevels] = useState<string[]>(
    []
  );
  const [selectedPackageTypes, setSelectedPackageTypes] = useState<string[]>(
    []
  );
  const { data: service_levels } = useGetServiceLevel({ minimize: true });
  const { data: package_types } = useGetPackageType({ minimize: true });
  // const { data: location_codes } = useGetLocationCode({ minimize: true });
  const { data: cross_area_routes } = useGetCrossAreaRoute({ minimize: true });
  // const { data: coverage_areas } = useGetCoverageArea({ minimize: true });

  const serviceLevelOptions = service_levels?.data?.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  
  const packageOptions = package_types?.data?.map((item: any) => {
    return {
      label: (<div className="flex flex-col"> <span className="text-gray-900 font-semibold">{item.name}</span> <span className="font-light text-[0.6rem]"> Max weight: ({item.maxWeight} kg) </span></div>),
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
    serviceLevelAgreementIds: z
      .array(z.string())
      .nonempty({ message: "Select at least one service level agreement" }),
    packageTypeIds: z
      .array(z.string())
      .nonempty({ message: "Select at least one package type" }),
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
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      crossAreaRouteId: "",
      // coverageAreaId: "",
      serviceLevelAgreementIds: [],
      packageTypeIds: [],
      numberOfDaysForDelivery: "",
      numberOfDaysForPickup: "",
      isNextDayDelivery: false,
      // locationCodeIds: [],
      // crossAreaRouteIds: [],
    },
  });
  const isNextDayDelivery = watch("isNextDayDelivery");
  // Initialize once when `info` is available
  useEffect(() => {
    const serviceLevelIds =
      info?.serviceLevels?.map((item: any) => item.id) ??
      info?.serviceLevelAgreements?.map((item: any) => item.id) ??
      (info?.companyServiceLevel?.id
        ? [info.companyServiceLevel.id]
        : info?.serviceLevel?.id
          ? [info.serviceLevel.id]
          : info?.serviceLevelAgreement?.id
            ? [info.serviceLevelAgreement.id]
            : []);
    setSelectedServiceLevels(serviceLevelIds);
    setValue("serviceLevelAgreementIds", serviceLevelIds);

    if (info?.packageTypes) {
      const defaultIds = info.packageTypes.map((item: any) => item.id);
      setSelectedPackageTypes(defaultIds);
      setValue("packageTypeIds", defaultIds);
    }
  }, [info, setValue]);

  // ✅ Reset form with incoming info when modal opens
  useEffect(() => {
    if (openRoutesModal && type === "edit" && info) {
      reset({
        crossAreaRouteId:
          info?.crossAreaRoute?.id ??
          "",
        // coverageAreaId: info?.coverageArea?.id,
        serviceLevelAgreementIds:
          info?.serviceLevels?.map((item: any) => item.id) ??
          info?.serviceLevelAgreements?.map((item: any) => item.id) ??
          (info?.companyServiceLevel?.id
            ? [info.companyServiceLevel.id]
            : info?.serviceLevel?.id
              ? [info.serviceLevel.id]
              : info?.serviceLevelAgreement?.id
                ? [info.serviceLevelAgreement.id]
                : []),
        packageTypeIds: info?.packageTypes?.map((item: any) => item.id) || [],
        isNextDayDelivery: info?.isNextDayDelivery ?? false,
        numberOfDaysForPickup: info.numberOfDaysForPickup?.toString() ?? "",
        numberOfDaysForDelivery: info.numberOfDaysForDelivery?.toString() ?? "",
      });
    } else if (openRoutesModal && type === "create") {
      setInfo(null);
      reset({
        crossAreaRouteId: "",
        serviceLevelAgreementIds: [],
        packageTypeIds: [],
        isNextDayDelivery: false,
        numberOfDaysForPickup: "",
        numberOfDaysForDelivery: "",
      });
      setSelectedServiceLevels([]);
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
        serviceLevelAgreementIds: [],
        packageTypeIds: [],
        // locationCodeIds: [],
        // crossAreaRouteIds: [],
        isNextDayDelivery: false,
      });
      setSelectedServiceLevels([]);
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
                <input type="hidden" {...register("crossAreaRouteId")} />
                <CustomInput
                  inputType="select"
                  label="Select Cross Area Route"
                  placeholder="Select option"
                  value={info?.crossAreaRoute?.id}
                  options={routeOptions ?? []}
                  error={errors.crossAreaRouteId?.message}
                  wrapperClassName="w-full"
                  disabled={type === "edit"}
                  onValueChange={(val) =>
                    setValue("crossAreaRouteId", val, { shouldValidate: true })
                  }
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="multiSelect"
                  label="Select service level agreement"
                  placeholder="Select options"
                  value={selectedServiceLevels}
                  options={serviceLevelOptions ?? []}
                  error={errors.serviceLevelAgreementIds?.message}
                  wrapperClassName="w-full"
                  onChange={(val) => {
                    setSelectedServiceLevels(val);
                    setValue("serviceLevelAgreementIds", val as [string, ...string[]], {
                      shouldValidate: true,
                    });
                  }}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="multiSelect"
                  label="Select package type"
                  placeholder="Select options"
                  value={selectedPackageTypes}
                  options={packageOptions ?? []}
                  error={errors.packageTypeIds?.message}
                  wrapperClassName="w-full"
                  onChange={(val) => {
                    setSelectedPackageTypes(val);
                    setValue("packageTypeIds", val as [string, ...string[]]);
                  }}
                />
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

              {/* <div className="flex md:flex-row flex-col gap-4 items-center"> */}
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

                {/* <CustomInput
                  inputType="multiSelect"
                  label="Select pickup option"
                  placeholder="Select options"
                  value={selectedPickupOptions}
                  options={pickupOptions ?? []}
                  error={errors.pickupOptionIds?.message}
                  onChange={(val) => {
                    setSelectedPickupOptions(val);
                    setValue("pickupOptionIds", val as [string, ...string[]]);
                  }}
                /> */}
              {/* </div> */}
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
                <CustomInput
                  inputType="number"
                  label="Number of days for pickup"
                  inputProps={{
                    placeholder: "Enter number of days",
                    onKeyDown: allowOnlyNumbers,
                  }}
                  registration={register("numberOfDaysForPickup")}
                  error={errors.numberOfDaysForPickup?.message}
                />

                <CustomInput
                  inputType="number"
                  label="Number of days for delivery"
                  inputProps={{
                    placeholder: "Enter number of days",
                    onKeyDown: allowOnlyNumbers,
                  }}
                  registration={register("numberOfDaysForDelivery")}
                  error={errors.numberOfDaysForDelivery?.message}
                />
              </div>

              <CustomInput
                inputType="toggle"
                label="Allow next day delivery"
                checked={isNextDayDelivery}
                onCheckedChange={(val) => setValue("isNextDayDelivery", val)}
              />

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
