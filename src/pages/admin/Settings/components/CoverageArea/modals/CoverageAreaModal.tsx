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
import { CustomInput } from "@/components/CustomInput";
import { useGetCoverageArea } from "@/queries/admin/useGetAdminSettings";

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
    level: z.enum(["CITY", "STATE"], {
      required_error: "Level is required",
    }),
    parentStateId: z.string().optional(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const level = watch("level");

  // Load state-level coverage areas for the parentState dropdown
  const { data: coverageAreaData } = useGetCoverageArea({ minimize: true });
  const stateAreas = (coverageAreaData?.data ?? []).filter(
    (item: any) => item.level === "STATE"
  );

  // ✅ Reset form with incoming info when modal opens
  useEffect(() => {
    if (open && type === "edit" && info) {
      reset({
        name: info.name,
        code: info.code,
        level: info.level,
        parentStateId: info.parentState?.id ?? "",
      });
    } else if (open && type === "create") {
      reset({
        name: "",
        code: "",
        level: undefined,
        parentStateId: "",
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
      updateCoverageArea(id, data),

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
    const payload: any = {
      name: data.name,
      code: data.code,
      level: data.level,
    };
    if (data.level === "CITY" && data.parentStateId) {
      payload.parentStateId = data.parentStateId;
    }

    type === "create" && createArea(payload);
    type === "edit" && updateArea({ id: info?.id, data: payload });
  };

  const levelValue = watch("level");
  const parentStateIdValue = watch("parentStateId");

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
              <CustomInput
                inputType="text"
                label="Name"
                wrapperClassName="w-full"
                registration={register("name")}
                error={errors.name?.message}
                inputProps={{ placeholder: "Enter name" }}
              />

              <CustomInput
                inputType="text"
                label="Code"
                wrapperClassName="w-full"
                registration={register("code", {
                  setValueAs: (value) =>
                    typeof value === "string" ? value.toUpperCase() : value,
                })}
                error={errors.code?.message}
                inputProps={{
                  placeholder: "Enter code",
                  className: "uppercase",
                }}
              />

              <CustomInput
                inputType="select"
                label="Level"
                wrapperClassName="w-full"
                value={levelValue}
                placeholder="Select level"
                options={[
                  { label: "City", value: "CITY" },
                  { label: "State", value: "STATE" },
                ]}
                error={errors.level?.message}
                onValueChange={(val) => {
                  setValue("level", val as "CITY" | "STATE", {
                    shouldValidate: true,
                  });
                  setValue("parentStateId", "");
                }}
              />

              {level === "CITY" && (
                <CustomInput
                  inputType="select"
                  label="Parent State"
                  wrapperClassName="w-full"
                  value={parentStateIdValue}
                  placeholder="Select parent state"
                  options={
                    stateAreas.map((item: any) => ({
                      label: `${item.name} - ${item.code}`,
                      value: item.id,
                    }))
                  }
                  error={errors.parentStateId?.message}
                  onValueChange={(val) =>
                    setValue("parentStateId", val, { shouldValidate: true })
                  }
                />
              )}

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
