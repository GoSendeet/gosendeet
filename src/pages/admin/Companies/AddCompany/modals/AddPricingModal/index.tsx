import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CustomInput } from "@/components/CustomInput";

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
                <CustomInput
                  inputType="select"
                  label="Select Company Route"
                  wrapperClassName="w-full"
                  value={companyServiceLineId}
                  placeholder="Select option"
                  options={
                    company_services?.data?.content?.map((item: any) => ({
                      label: `${item.crossAreaRoute?.areaA} - ${item?.crossAreaRoute?.areaB}`,
                      value: item.id,
                    })) ?? []
                  }
                  error={errors.companyServiceLineId?.message}
                  disabled={type === "edit"}
                  onValueChange={(val) =>
                    setValue("companyServiceLineId", val, { shouldValidate: true })
                  }
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="number"
                  label="Base Price"
                  registration={register("basePrice")}
                  error={errors.basePrice?.message}
                  inputProps={{
                    placeholder: "Enter base price",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />

                <CustomInput
                  inputType="number"
                  label="Discount Percent"
                  registration={register("discountPercent")}
                  error={errors.discountPercent?.message}
                  inputProps={{
                    placeholder: "Enter discount percentage",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="number"
                  label="Weight Multiplier"
                  registration={register("weightMultiplier")}
                  error={errors.weightMultiplier?.message}
                  inputProps={{
                    placeholder: "Enter weight multiplier",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />

                <CustomInput
                  inputType="number"
                  label="Distance Multiplier"
                  registration={register("distanceMultiplier")}
                  error={errors.distanceMultiplier?.message}
                  inputProps={{
                    placeholder: "Enter distance multiplier",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="number"
                  label="Bulk Multiplier"
                  registration={register("bulkMultiplier")}
                  error={errors.bulkMultiplier?.message}
                  inputProps={{
                    placeholder: "Enter bulk multiplier",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />
                 <CustomInput
                  inputType="number"
                  label="Weight limit (kg)"
                  registration={register("weightLimit")}
                  error={errors.weightLimit?.message}
                  inputProps={{
                    placeholder: "Enter weight limit",
                    onKeyDown: allowOnlyNumbers,
                  }}
                />
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <CustomInput
                  inputType="text"
                  label="Notes"
                  wrapperClassName="w-full"
                  registration={register("notes")}
                  error={errors.notes?.message}
                  inputProps={{ placeholder: "Enter notes" }}
                />
            
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
