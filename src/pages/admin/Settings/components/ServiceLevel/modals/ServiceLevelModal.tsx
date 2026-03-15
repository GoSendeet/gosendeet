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
import { createServiceLevel, updateServiceLevel } from "@/services/adminSettings";
import { useEffect } from "react";
import { CustomInput } from "@/components/CustomInput";

export function ServiceLevelModal({
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
  const schema = z.object({
    name: z
      .string({ required_error: "Service level name is required" })
      .min(1, { message: "Please enter a name" })
      .regex(/^[A-Za-z\s]+$/, {
        message: "Name must contain only letters and spaces",
      }),
    multiplier: z.coerce
      .number({ required_error: "Multiplier is required" })
      .positive({ message: "Multiplier must be greater than 0" }),
    eta_min_days: z.coerce
      .number({ required_error: "Minimum ETA is required" })
      .int({ message: "Minimum ETA must be a whole number" })
      .min(1, { message: "Minimum ETA must be at least 1 day" }),
    eta_max_days: z.coerce
      .number({ required_error: "Maximum ETA is required" })
      .int({ message: "Maximum ETA must be a whole number" })
      .min(1, { message: "Maximum ETA must be at least 1 day" }),
  }).refine((data) => data.eta_max_days >= data.eta_min_days, {
    message: "Maximum ETA must be greater than or equal to minimum ETA",
    path: ["eta_max_days"],
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  // ✅ Reset form with incoming info when modal opens
  useEffect(() => {
    if (open && type === "edit" && info) {
      reset({
        name: info.name ?? "",
        multiplier: info.multiplier ?? "",
        eta_min_days: info.eta_min_days ?? "",
        eta_max_days: info.eta_max_days ?? "",
      });
    } else if (open && type === "create") {
      reset({
        name: "",
        multiplier: "" as unknown as number,
        eta_min_days: "" as unknown as number,
        eta_max_days: "" as unknown as number,
      });
    }
  }, [open, info, type, reset]);

  const queryClient = useQueryClient();

  const { mutate: createService, isPending: pendingCreate } = useMutation({
    mutationFn: createServiceLevel,
    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["service_level"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: updateService, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateServiceLevel(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["service_level"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    const payload = {
      name: data.name.trim(),
      multiplier: data.multiplier,
      eta_min_days: data.eta_min_days,
      eta_max_days: data.eta_max_days,
    };

    type === "create" &&
      createService(payload);

    type === "edit" &&
      updateService({
        id: info?.id,
        data: payload,
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent autoFocus={false} className="gap-0">
        <DialogTitle className="text-[20px] font-semibold text-brand font-inter mb-2">
          Service Level
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          {type === "create" ? "Add a service level." : "Edit a service level."}
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <CustomInput
                inputType="text"
                label="Service level name"
                wrapperClassName="w-full"
                registration={register("name")}
                error={errors.name?.message}
                inputProps={{
                  placeholder: "Enter service level name",
                }}
                className="px-4"
              />

              <CustomInput
                inputType="number"
                label="Multiplier"
                wrapperClassName="w-full"
                registration={register("multiplier")}
                error={errors.multiplier?.message}
                inputProps={{
                  placeholder: "Enter multiplier",
                  step: "any",
                }}
                className="px-4"
              />

              <CustomInput
                inputType="number"
                label="Minimum ETA days"
                wrapperClassName="w-full"
                registration={register("eta_min_days")}
                error={errors.eta_min_days?.message}
                inputProps={{
                  placeholder: "Enter minimum ETA days",
                }}
                className="px-4"
              />

              <CustomInput
                inputType="number"
                label="Maximum ETA days"
                wrapperClassName="w-full"
                registration={register("eta_max_days")}
                error={errors.eta_max_days?.message}
                inputProps={{
                  placeholder: "Enter maximum ETA days",
                }}
                className="px-4"
              />

              <Button
                variant={"secondary"}
                loading={type === "edit" ? pendingUpdate : pendingCreate}
                className="text-white bg-brand"
              >
                {type === "edit" ? "Update" : "Add"}
              </Button>
            </form>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
