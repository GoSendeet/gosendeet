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
    serviceLevel: z
      .string({ required_error: "Service level is required" })
      .min(1, { message: "Please enter a level" }),
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
        serviceLevel: info.name,
      });
    } else if (open && type === "create") {
      reset({
        serviceLevel: "",
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
    type === "create" &&
      createService({
        name: data.serviceLevel,
      });

    type === "edit" &&
      updateService({
        id: info?.id,
        data: { name: data.serviceLevel },
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
              <div className="flex flex-col gap-2 w-full">
                {/* <label
                  htmlFor="serviceLevel"
                  className="font-inter font-semibold px-4"
                >
                  Service Level
                </label> */}
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("serviceLevel")}
                    defaultValue={info?.name}
                    placeholder="Enter service level"
                    className="w-full outline-0 border-b-0 py-2 px-4 "
                  />
                </div>
                {errors.serviceLevel && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.serviceLevel.message}
                  </p>
                )}
              </div>

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
