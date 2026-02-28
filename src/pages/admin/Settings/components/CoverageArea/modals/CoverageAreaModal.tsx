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
  createCoverageArea,
  updateCoverageArea,
} from "@/services/adminSettings";
import { useEffect } from "react";

export function CoverageAreaModal({
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
      .string({ required_error: "Name is required" })
      .min(1, { message: "Please enter a name" }),
    code: z
      .string({ required_error: "Code is required" })
      .min(1, { message: "Please enter a code" }),
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
        name: info.name,
        code: info.code,
      });
    } else if (open && type === "create") {
      reset({
        name: "",
        code: "",
      });
    }
  }, [open, info, type, reset]);

  const queryClient = useQueryClient();

  const { mutate: createArea, isPending: pendingCreate } = useMutation({
    mutationFn: createCoverageArea,
    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["coverage_areas"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: updateArea, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCoverageArea(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["coverage_areas"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    type === "create" &&
      createArea({
        name: data.name,
        code: data.code,
      });

    type === "edit" &&
      updateArea({
        id: info?.id,
        data: { name: data.name, code: data.code },
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent autoFocus={false} className="gap-0">
        <DialogTitle className="text-[20px] font-semibold text-brand font-inter mb-2">
          Coverage Area
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          {type === "create" ? "Add a coverage area." : "Edit a coverage area."}
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="name" className="font-inter text-brand font-semibold">
                    Name
                  </label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("name")}
                    defaultValue={info?.name}
                    placeholder="Enter name"
                    className="w-full outline-0 border-b-0 py-2 "
                  />
                </div>
                {errors.name && (
                  <p className="error text-xs text-[#FF0000]">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 w-full">
                <label htmlFor="code" className="font-inter text-brand font-semibold">
                    Code
                  </label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("code")}
                    defaultValue={info?.code}
                    placeholder="Enter code"
                    className="w-full outline-0 border-b-0 py-2 "
                  />
                </div>
                {errors.code && (
                  <p className="error text-xs text-[#FF0000]">
                    {errors.code.message}
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
