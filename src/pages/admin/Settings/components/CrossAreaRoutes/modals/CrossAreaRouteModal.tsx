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
  createCrossAreaRoute,
  updateCrossAreaRoute,
} from "@/services/adminSettings";
import { useEffect } from "react";
import { useGetCoverageArea } from "@/queries/admin/useGetAdminSettings";
import { CustomInput } from "@/components/CustomInput";

export function CrossAreaRoutesModal({
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
  const { data } = useGetCoverageArea({
    minimize: true,
  });
  const coverageAreaAList = data?.data;
  const schema = z.object({
    coverageAreaAId: z
      .string({ required_error: "Coverage area is required" })
      .min(1, { message: "Please select a coverage area" }),
    coverageAreaBId: z
      .string({ required_error: "Coverage area is required" })
      .min(1, { message: "Please select a coverage area" }),
  });

  const {
    setValue,
    watch,
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
        coverageAreaAId: info.areaA.id,
        coverageAreaBId: info.areaB.id,
      });
    } else if (open && type === "create") {
      reset({
        coverageAreaAId: "",
        coverageAreaBId: "",
      });
    }
  }, [open, info, type, reset]);

  const queryClient = useQueryClient();

  const { mutate: create, isPending: pendingCreate } = useMutation({
    mutationFn: createCrossAreaRoute,
    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["cross_area_routes"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: update, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCrossAreaRoute(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["cross_area_routes"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    type === "create" &&
      create({
        coverageAreaAId: data.coverageAreaAId,
        coverageAreaBId: data.coverageAreaBId,
      });

    type === "edit" &&
      update({
        id: info?.id,
        data: {
          coverageAreaAId: data.coverageAreaAId,
          coverageAreaBId: data.coverageAreaBId,
        },
      });
  };

  const coverageAreaAId = watch("coverageAreaAId");
  const coverageAreaBId = watch("coverageAreaBId");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent autoFocus={false} className="gap-0">
        <DialogTitle className="text-[20px] text-brand font-semibold font-inter mb-2">
          Cross Area Route
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-brand">
          {type === "create"
            ? "Add a directional cross area route (From → To)."
            : "Edit a cross area route."}
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <CustomInput
                inputType="select"
                label="From"
                wrapperClassName="w-full"
                value={coverageAreaAId}
                placeholder="Select pickup area"
                options={
                  coverageAreaAList?.map((item: any) => ({
                    label: `${item.name} - ${item.code} (${item.level})`,
                    value: item.id,
                  })) ?? []
                }
                error={errors.coverageAreaAId?.message}
                onValueChange={(val) =>
                  setValue("coverageAreaAId", val, { shouldValidate: true })
                }
              />

              <CustomInput
                inputType="select"
                label="To"
                wrapperClassName="w-full"
                value={coverageAreaBId}
                placeholder="Select dropoff area"
                options={
                  coverageAreaAList?.map((item: any) => ({
                    label: `${item.name} - ${item.code} (${item.level})`,
                    value: item.id,
                  })) ?? []
                }
                error={errors.coverageAreaBId?.message}
                onValueChange={(val) =>
                  setValue("coverageAreaBId", val, { shouldValidate: true })
                }
              />

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
