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
import {
  createPickupOptions,
  updatePickupOptions,
} from "@/services/adminSettings";
import { useEffect } from "react";

export function PickupOptionModal({
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
    pickupOption: z
      .string({ required_error: "Pickup option is required" })
      .min(1, { message: "Please enter an option" }),
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
        pickupOption: info.name,
      });
    } else if (open && type === "create") {
      reset({
        pickupOption: "",
      });
    }
  }, [open, info, type, reset]);

  const queryClient = useQueryClient();

  const { mutate: createOption, isPending: pendingCreate } = useMutation({
    mutationFn: createPickupOptions,
    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["pickup_options"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: updateOptions, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updatePickupOptions(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["pickup_options"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    type === "create" &&
      createOption({
        name: data.pickupOption,
      });

    type === "edit" &&
      updateOptions({
        id: info?.id,
        data: { name: data.pickupOption },
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent autoFocus={false} className="gap-0">
        <DialogTitle className="text-[20px] text-brand font-semibold font-inter mb-2">
          Pickup Options
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          {type === "create" ? "Add a pickup option." : "Edit a pickup option."}
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2 w-full">
                {/* <label
                  htmlFor="pickupOption"
                  className="font-inter font-semibold px-4"
                >
                  Pickup options
                </label> */}
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("pickupOption")}
                    defaultValue={info?.name}
                    placeholder="Enter pickup option"
                    className="w-full outline-0 border-b-0 py-2 px-4 "
                  />
                </div>
                {errors.pickupOption && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.pickupOption.message}
                  </p>
                )}
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
