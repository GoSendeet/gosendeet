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
import { useGetServiceLevel } from "@/queries/admin/useGetAdminSettings";
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
  const { data: service_level } = useGetServiceLevel();
  const { data: company_services } = useGetCompanyServices(companyId);

  const schema = z.object({
    serviceLevelId: z
      .string({ required_error: "Service level is required" })
      .min(1, { message: "Please select an option" }),
    basePrice: z
      .string({ required_error: "Base price is required" })
      .min(1, { message: "Please enter a base price" }),
    weightMultiplier: z
      .string({ required_error: "Weight multiplier is required" })
      .min(1, { message: "Please enter a weight multiplier" }),
    zoneMultiplier: z
      .string({ required_error: "Zone multiplier is required" })
      .min(1, { message: "Please enter a zone multiplier" }),
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
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      serviceLevelId: "",
    },
  });

  // ✅ Reset form with incoming info when modal opens
  useEffect(() => {
    if (openPricing && type === "edit" && info) {
      reset({
        serviceLevelId: info?.serviceLevel?.id,
        basePrice: info.basePrice?.toString() ?? "",
        weightMultiplier: info.weightMultiplier?.toString() ?? "",
        zoneMultiplier: info.zoneMultiplier?.toString() ?? "",
        discountPercent: info.discountPercent?.toString() ?? "",
        notes: info?.notes,
      });
    } else if (openPricing && type === "create") {
      setPricingInfo(null);
      reset({
        serviceLevelId: "",
        basePrice: "",
        weightMultiplier: "",
        zoneMultiplier: "",
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
        serviceLevelId: "",
        basePrice: "",
        weightMultiplier: "",
        zoneMultiplier: "",
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
          Start by picking a package type, then enter the cost details per kg/km
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
                    htmlFor="serviceLevel"
                    className="font-inter text-brand font-semibold"
                  >
                    Select service level
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b mb-2">
                    <Select
                      onValueChange={(val) => setValue("serviceLevelId", val)}
                      defaultValue={info?.serviceLevel?.id}
                      disabled={type === "edit"}
                    >
                      <SelectTrigger className="outline-0 border-0 focus-visible:border-transparent focus-visible:ring-transparent w-full py-2 px-0">
                        <SelectValue placeholder="Select option"  />
                      </SelectTrigger>
                      <SelectContent >
                        {type === "create" &&
                          company_services &&
                          company_services?.data?.content?.map(
                            (item: any, index: number) => (
                              <SelectItem
                                value={item.companyServiceLevel.id}
                                key={index}
                              >
                                {item.companyServiceLevel.name}
                              </SelectItem>
                            )
                          )}
                        {type === "edit" &&
                          service_level &&
                          service_level?.data?.content?.map(
                            (item: any, index: number) => (
                              <SelectItem value={item.id} key={index}>
                                {item.name}
                              </SelectItem>
                            )
                          )}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.serviceLevelId && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.serviceLevelId.message}
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
