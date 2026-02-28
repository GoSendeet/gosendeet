import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useGetDeliveryProgress } from "@/queries/admin/useGetAdminSettings";
import { statusOptions } from "@/constants";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrackingHistory } from "@/services/bookings";
import { useEffect } from "react";

export function UpdateProgressModal({
  open,
  setOpen,
  bookingId,
  progress,
  status,
}: {
  open: boolean;
  setOpen: any;
  bookingId: string;
  progress: string;
  status: string;
}) {
  const { data: deliveryProgress } = useGetDeliveryProgress({ minimize: true });

  // find the matching progress item by name
  const matchedProgressId = deliveryProgress?.data?.find(
    (item: any) => item.name === progress
  )?.id;

  const schema = z.object({
    deliveryProgressId: z
      .string({ required_error: "Progress is required" })
      .min(1, { message: "Please select a progress" }),
    status: z
      .string({ required_error: "Status is required" })
      .min(1, { message: "Please select a status" }),
    location: z
      .string({ required_error: "Location is required" })
      .min(3, { message: "Please add a valid location" }),
    notes: z.string().optional(),
    sendEmailNotification: z.boolean().optional(),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      deliveryProgressId: matchedProgressId,
      status: status || "",
      location: "",
      notes: "",
      sendEmailNotification: false,
    },
  });

  useEffect(() => {
    reset({
      deliveryProgressId: matchedProgressId,
      status: status || "",
      location: "",
      notes: "",
      sendEmailNotification: false,
    });
  }, [progress, status, reset]);

  const queryClient = useQueryClient();

  const { mutate: create, isPending: pendingCreate } = useMutation({
    mutationFn: createTrackingHistory,
    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["tracking_history"],
      });
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });
      queryClient.invalidateQueries({
        queryKey: ["booking_stats"],
      });
      reset();
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    create({
      bookingId: bookingId,
      ...data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] font-semibold text-brand font-inter mb-2">
          Update Order Progress
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          You are adding an order progress to this order, it will reflect on
          their tracking page and also be sent to mail
        </DialogDescription>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 py-4 text-sm mt-4"
        >
          {/* Delivery Progress */}
          <div className="flex flex-col  w-full">
            <label className="font-inter text-brand font-semibold">
              Delivery Progress
            </label>
            <Controller
              name="deliveryProgressId"
              control={control}
              render={({ field }) => (
                <div className="border-b">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="outline-0 focus-visible:border-transparent focus-visible:ring-transparent border-0 w-full py-2 px-0 mt-0">
                      <SelectValue placeholder="Select delivery progress" />
                    </SelectTrigger>
                    <SelectContent>
                      {deliveryProgress?.data?.map((item: any) => (
                        <SelectItem value={item.id} key={item.id}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            {errors.deliveryProgressId && (
              <p className="error text-xs text-[#FF0000]">
                {errors.deliveryProgressId.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div className="flex flex-col  w-full">
            <label className="font-inter font-semibold text-brand">Status</label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <div className="border-b">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="outline-0 focus-visible:border-transparent focus-visible:ring-transparent border-0 w-full py-2 px-0 mt-0">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions?.map((item: any) => (
                        <SelectItem value={item.value} key={item.value}>
                          {item.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            {errors.status && (
              <p className="error text-xs text-[#FF0000]">
                {errors.status.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div className="flex flex-col  w-full">
            <label className="font-inter text-brand font-semibold">Location</label>
            <input
              type="text"
              {...register("location")}
              className="w-full outline-0 border-b border-gray-300 py-2"
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="error text-xs text-[#FF0000]">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="flex flex-col  w-full">
            <label className="font-inter text-brand font-semibold">
              Additional Message
            </label>
            <input
              type="text"
              {...register("notes")}
              placeholder="Type in a short message"
              className="w-full outline-0 border-b border-gray-300 py-2"
            />
          </div>

          {/* Mail checkbox */}
          <div className="flex items-start gap-2">
            <Controller
              name="sendEmailNotification"
              control={control}
              render={({ field }) => (
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                  className="mt-[1px]"
                />
              )}
            />
            <label>Send a notification email to your customer</label>
          </div>

          <Button variant="secondary" className="w-fit text-white bg-brand" loading={pendingCreate}>
            Update
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
