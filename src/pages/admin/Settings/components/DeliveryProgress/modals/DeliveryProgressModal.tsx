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
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDeliveryProgress,
  updateDeliveryProgress,
} from "@/services/adminSettings";
import { statusOptions } from "@/constants";
import { useEffect } from "react";

export function DeliveryProgressModal({
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
    deliveryProgress: z
      .string({ required_error: "Delivery progress is required" })
      .min(1, { message: "Please enter a delivery progress" }),
    bookingStatus: z.string().optional(),
  });

  const {
    register,
    control,
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
        deliveryProgress: info.name,
        bookingStatus: info.bookingStatus ?? "",
      });
    } else if (open && type === "create") {
      reset({
        deliveryProgress: "",
        bookingStatus: "",
      });
    }
  }, [open, info, type, reset]);

  const queryClient = useQueryClient();

  const { mutate: createProgress, isPending: pendingCreate } = useMutation({
    mutationFn: createDeliveryProgress,
    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["delivery_progress"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: updateProgress, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateDeliveryProgress(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["delivery_progress"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    const payload = {
      name: data.deliveryProgress,
      ...(data.bookingStatus ? { bookingStatus: data.bookingStatus } : {}),
    };

    type === "create" && createProgress(payload);

    type === "edit" && updateProgress({ id: info?.id, data: payload });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent autoFocus={false} className="gap-0">
        <DialogTitle className="text-[20px] text-brand font-semibold font-inter mb-2">
          Delivery Progress
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-brand">
          {type === "create" ? "Add a delivery progress." : "Edit a delivery progress."}
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("deliveryProgress")}
                    defaultValue={info?.name}
                    placeholder="Enter delivery progress"
                    className="w-full outline-0 border-b-0 py-2 px-4 "
                  />
                </div>
                {errors.deliveryProgress && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.deliveryProgress.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label className="font-inter font-semibold px-4 text-brand">
                  Maps to Booking Status <span className="text-neutral500 font-normal">(optional)</span>
                </label>
                <Controller
                  name="bookingStatus"
                  control={control}
                  render={({ field }) => (
                    <div className="border-b">
                      <Select
                        onValueChange={(val) => field.onChange(val === "none" ? "" : val)}
                        value={field.value || "none"}
                      >
                        <SelectTrigger className="outline-0 focus-visible:border-transparent focus-visible:ring-transparent border-0 w-full py-2 px-4 mt-0">
                          <SelectValue placeholder="No status mapping" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No status mapping</SelectItem>
                          {statusOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
                <p className="text-xs text-neutral500 px-4">
                  When this progress is selected, the booking status will also update automatically.
                </p>
              </div>

              <Button
                variant={"secondary"}
                loading={type === "edit" ? pendingUpdate : pendingCreate}
                className="bg-brand"
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
