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
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPromoCode, updatePromoCode } from "@/services/adminSettings";
import { useEffect } from "react";
import { CustomInput } from "@/components/CustomInput";
import { allowOnlyNumbers } from "@/lib/utils";

const schema = z.object({
  code: z
    .string({ required_error: "Code is required" })
    .min(3, { message: "Code must be at least 3 characters" })
    .toUpperCase(),
  discount: z
    .number({ required_error: "Discount is required" })
    .min(1, { message: "Discount must be greater than 0" }),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
    required_error: "Discount type is required",
  }),
  maxUsage: z
    .number({ required_error: "Max usage is required" })
    .min(1, { message: "Max usage must be at least 1" }),
  expiresAt: z
    .string({ required_error: "Expiration date is required" })
    .min(1, { message: "Please select an expiration date" }),
  active: z.boolean().optional(),
});

export function PromoCodeModal({
  open,
  setOpen,
  type,
  info,
}: {
  open: boolean;
  setOpen: any;
  type: string;
  info: any;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const discountType = watch("discountType");
  const active = watch("active") ?? false;

  useEffect(() => {
    if (open && type === "edit" && info) {
      reset({
        code: info.code ?? "",
        discount: info.discount ?? undefined,
        discountType: info.discountType ?? "PERCENTAGE",
        maxUsage: info.maxUsage ?? undefined,
        expiresAt: info.expiresAt ? info.expiresAt.slice(0, 10) : "",
        active: info.active ?? false,
      });
    } else if (open && type === "create") {
      reset({
        code: "",
        discount: undefined,
        discountType: "PERCENTAGE",
        maxUsage: undefined,
        expiresAt: "",
        active: true,
      });
    }
  }, [open, info, type, reset]);

  const queryClient = useQueryClient();

  const { mutate: createCode, isPending: pendingCreate } = useMutation({
    mutationFn: createPromoCode,
    onSuccess: () => {
      toast.success("Promo code created");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["promo_codes"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const { mutate: updateCode, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updatePromoCode(id, data),
    onSuccess: () => {
      toast.success("Promo code updated");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({ queryKey: ["promo_codes"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (type === "create") createCode(data);
    if (type === "edit") updateCode({ id: info?.id, data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent autoFocus={false} className="gap-0">
        <DialogTitle className="text-[20px] font-semibold font-inter mb-2">
          Promo Code
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          {type === "create" ? "Add a new promo code." : "Edit promo code."}
        </DialogDescription>

        <div className="py-4 text-sm mt-2">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex md:flex-row flex-col gap-4 items-center">
              <CustomInput
                inputType="text"
                label="Code"
                wrapperClassName="w-full"
                registration={register("code")}
                error={errors.code?.message}
                inputProps={{ placeholder: "e.g. GOPCE20", style: { textTransform: "uppercase" } }}
              />
              <CustomInput
                inputType="select"
                label="Discount Type"
                wrapperClassName="w-full"
                value={discountType}
                placeholder="Select type"
                options={[
                  { label: "Percentage (%)", value: "PERCENTAGE" },
                  { label: "Fixed Amount (₦)", value: "FIXED_AMOUNT" },
                ]}
                error={errors.discountType?.message}
                onValueChange={(val) =>
                  setValue("discountType", val as "PERCENTAGE" | "FIXED_AMOUNT", {
                    shouldValidate: true,
                  })
                }
              />
            </div>

            <div className="flex md:flex-row flex-col gap-4 items-center">
              <CustomInput
                inputType="number"
                label={discountType === "PERCENTAGE" ? "Discount (%)" : "Discount Amount (₦)"}
                wrapperClassName="w-full"
                registration={register("discount", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                error={errors.discount?.message}
                inputProps={{
                  placeholder: discountType === "PERCENTAGE" ? "e.g. 10" : "e.g. 500",
                  onKeyDown: allowOnlyNumbers,
                }}
              />
              <CustomInput
                inputType="number"
                label="Max Usage"
                wrapperClassName="w-full"
                registration={register("maxUsage", {
                  setValueAs: (v) => (v === "" ? undefined : Number(v)),
                })}
                error={errors.maxUsage?.message}
                inputProps={{
                  placeholder: "e.g. 100",
                  onKeyDown: allowOnlyNumbers,
                }}
              />
            </div>

            <div className="flex md:flex-row flex-col gap-4 items-center">
              <div className="flex flex-col w-full">
                <label htmlFor="expiresAt" className="font-inter text-brand font-semibold">
                  Expiration Date
                </label>
                <div className="flex justify-between items-center gap-2 border-b mb-2">
                  <input
                    id="expiresAt"
                    type="date"
                    {...register("expiresAt")}
                    className="w-full outline-0 border-b-0 py-2"
                  />
                </div>
                {errors.expiresAt?.message && (
                  <p className="error text-xs text-[#FF0000]">{errors.expiresAt.message}</p>
                )}
              </div>
            </div>

            <div className="flex md:flex-row flex-col gap-4 items-center">
              <CustomInput
                inputType="toggle"
                label="Active"
                checked={active}
                onCheckedChange={(val) => setValue("active", val)}
              />
            </div>

            <Button
              variant={"secondary"}
              className="bg-brand"
              loading={type === "edit" ? pendingUpdate : pendingCreate}
            >
              {type === "edit" ? "Update" : "Add"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
