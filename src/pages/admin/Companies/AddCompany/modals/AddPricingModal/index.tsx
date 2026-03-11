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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompanyPricing,
  updateCompanyPricing,
} from "@/services/companies";
import { toast } from "sonner";
import { useGetCompanyServices } from "@/queries/admin/useGetAdminCompanies";
import { allowOnlyNumbers } from "@/lib/utils";

export function AddPricingModal({
  companyId,
  openPricing,
  setOpenPricing,
  info,
  type,
  setPricingInfo,
}: {
  companyId: string;
  openPricing: boolean;
  setOpenPricing: any;
  info: any;
  type: string;
  setPricingInfo: any;
}) {
  const { data: company_services } = useGetCompanyServices(companyId);
  const schema = z.object({
    companyServiceLineId: z
      .string({ required_error: "Service level is required" })
      .min(1, { message: "Please select an option" }),
    basePrice: z
      .string({ required_error: "Base price is required" })
      .min(1, { message: "Please enter a base price" }),
    weightLimit: z
      .string({ required_error: "Weight limit is required" })
      .min(1, { message: "Please enter a limit" }),
    weightMultiplier: z
      .string({ required_error: "Weight multiplier is required" })
      .min(1, { message: "Please enter a weight multiplier" }),
    distanceMultiplier: z
      .string({ required_error: "Distance multiplier is required" })
      .min(1, { message: "Please enter a distance multiplier" }),
    bulkMultiplier: z
      .string({ required_error: "Bulk multiplier is required" })
      .min(1, { message: "Please enter a bulk multiplier" }),
    expressMultiplier: z
      .string({ required_error: "Express multiplier is required" })
      .min(1, { message: "Please enter an express multiplier" }),
    discountPercent: z
      .string({ required_error: "Discount percent is required" })
      .min(1, { message: "Please enter a discount percent" }),
    notes: z.string().optional(),
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
      companyServiceLineId: "",
    },
  });

  const companyServiceLineId = watch("companyServiceLineId");
  // const editRouteLabel = info?.companyService?.crossAreaRoute
  //   ? `${info.companyService.crossAreaRoute.areaA} - ${info.companyService.crossAreaRoute.areaB}`
  //   : info?.crossAreaRoute
  //     ? `${info.crossAreaRoute.areaA} - ${info.crossAreaRoute.areaB}`
  //     : "";

  // ✅ Reset form with incoming info when modal opens
  useEffect(() => {
    if (openPricing && type === "edit" && info) {
      reset({
        companyServiceLineId:
          info?.companyServiceLine?.id ??
          "",
        basePrice: info.basePrice?.toString() ?? "",
        weightMultiplier: info.weightMultiplier?.toString() ?? "",
        distanceMultiplier: info.distanceMultiplier?.toString() ?? "",
        bulkMultiplier: info.bulkMultiplier?.toString() ?? "",
        weightLimit: info.weightLimit?.toString() ?? "",
        expressMultiplier: info.expressMultiplier?.toString() ?? "",
        discountPercent: info.discountPercent?.toString() ?? "",
        notes: info?.notes,
      });
    } else if (openPricing && type === "create") {
      setPricingInfo(null);
      reset({
        companyServiceLineId: "",
        basePrice: "",
        weightLimit: "",
        weightMultiplier: "",
        distanceMultiplier: "",
        bulkMultiplier: "",
        expressMultiplier: "",
        discountPercent: "",
        notes: "",
      });
    }
  }, [openPricing, info, type, reset]);
  const queryClient = useQueryClient();

  const { mutate: createPricing, isPending: pendingCreate } = useMutation({
    mutationFn: createCompanyPricing,
    onSuccess: () => {
      toast.success("Successful");
      reset({
        companyServiceLineId: "",
        basePrice: "",
        weightLimit: "",
        weightMultiplier: "",
        distanceMultiplier: "",
        bulkMultiplier: "",
        expressMultiplier: "",
        discountPercent: "",
        notes: "",
      });
      setOpenPricing(false);
      queryClient.invalidateQueries({
        queryKey: ["company_pricing"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: updatePricing, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCompanyPricing(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpenPricing(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["company_pricing"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    type === "create" &&
      createPricing({
        ...data,
        companyId: companyId,
      });

    type === "edit" &&
      updatePricing({
        id: info?.id,
        data: {
          ...data,
          companyId: companyId,
        },
      });
  };
  return (
    <Dialog open={openPricing} onOpenChange={setOpenPricing}>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] text-brand font-semibold font-inter mb-2">
          Set Up Delivery Pricing
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          Start by picking a company route, then enter the cost details per km
          to tailor your delivery pricing.
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:gap-5 gap-4"
            >
              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col w-full">
                  <label
                    htmlFor="companyServiceLineId"
                    className="font-inter text-brand font-semibold"
                  >
                    Select Company Route
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b mb-2">
                    <Select
                      value={companyServiceLineId}
                      onValueChange={(val) =>
                        setValue("companyServiceLineId", val)
                      }
                      defaultValue={companyServiceLineId}
                      disabled={type === "edit"}
                    >
                      <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent w-full py-2 px-0">
                        <SelectValue placeholder="Select option"  />
                      </SelectTrigger>
                      <SelectContent >
                        {
                          company_services?.data?.content?.map((item: any) => (
                            <SelectItem value={item.id} key={item.id}>
                              {`${item.crossAreaRoute?.areaA} - ${item?.crossAreaRoute?.areaB} (${item?.pickupOptions?.[0]?.name || '-'})`}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.companyServiceLineId && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.companyServiceLineId.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
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
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
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
                    htmlFor="distanceMultiplier"
                    className="font-inter text-brand font-semibold"
                  >
                    Distance Multiplier
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("distanceMultiplier")}
                      defaultValue={info?.distanceMultiplier}
                      placeholder="Enter distance multiplier"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.distanceMultiplier && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.distanceMultiplier.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="bulkMultiplier"
                    className="font-inter text-brand font-semibold"
                  >
                    Bulk Multiplier
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("bulkMultiplier")}
                      defaultValue={info?.bulkMultiplier}
                      placeholder="Enter bulk multiplier"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.bulkMultiplier && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.bulkMultiplier.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col lg:w-1/2 w-full">
                  <label
                    htmlFor="expressMultiplier"
                    className="font-inter text-brand font-semibold"
                  >
                    Express Multiplier
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("expressMultiplier")}
                      defaultValue={info?.expressMultiplier}
                      placeholder="Enter express multiplier"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.expressMultiplier && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.expressMultiplier.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col w-full">
                  <label htmlFor="notes" className="font-inter text-brand font-semibold">
                    Notes
                  </label>
                  <div className="border-b mb-2">
                    <input
                      type="text"
                      {...register("notes")}
                      defaultValue={info?.notes}
                      placeholder="Enter notes"
                      className="w-full outline-0 border-b-0 py-2"
                    />
                  </div>
                  {errors.notes && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.notes.message}
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

              <Button
                variant={"secondary"}
                className=" w-fit bg-brand"
                loading={type === "create" ? pendingCreate : pendingUpdate}
              >
                {type === "create" ? "Add pricing" : "Edit pricing"}
              </Button>
            </form>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
