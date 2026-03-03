import { useCallback, useEffect } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi";
import { createTasks, TaskType } from "@/services/tasks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getErrorMessage,
  toISOFromLocalInput,
  formatToDatetimeLocal,
} from "@/lib/utils";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";

const completionRequirementSchema = z
  .enum(["PHOTO", "NONE"])
  .optional()
  .or(z.literal("").optional());

const taskSchema = z.object({
  taskType: z.enum(["PICKUP", "DROPOFF", "IN_HUB"], {
    required_error: "Task type is required",
  }),
  destinationAddress: z
    .string({ required_error: "Destination is required" })
    .min(3, "Destination is required"),
  completionRequirement: completionRequirementSchema,
  completeAfter: z.string().optional(),
  completeBefore: z.string().optional(),
  notes: z.string().optional(),
  dependsOn: z.array(z.string()).optional(),
});

const formSchema = z.object({
  tasks: z.array(taskSchema).min(1, "Add at least one task"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTasksModalProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  pickupAddress?: string;
  dropoffAddress?: string;
}

const CreateTasksModal = ({
  bookingId,
  open,
  onOpenChange,
  onSuccess,
  pickupAddress,
  dropoffAddress,
}: CreateTasksModalProps) => {
  const buildDefaultTask = useCallback(
    (
      type: TaskType = "PICKUP",
    ): {
      taskType: TaskType;
      destinationAddress: string;
      completionRequirement: "PHOTO" | "NONE";
      completeAfter: string;
      completeBefore: string;
      notes: string;
      dependsOn: string[];
    } => {
      const now = new Date();

      // Smart dispatch window based on task type
      let completeAfter = "";
      let completeBefore = "";

      if (type === "PICKUP") {
        // Pickup: Start in 2 hours, 2 hour window
        const start = new Date(now.getTime() + 2 * 60 * 60 * 1000);
        const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
        completeAfter = formatToDatetimeLocal(start);
        completeBefore = formatToDatetimeLocal(end);
      } else if (type === "DROPOFF") {
        // Dropoff: Start in 4 hours (after pickup), 4 hour window
        const start = new Date(now.getTime() + 4 * 60 * 60 * 1000);
        const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
        completeAfter = formatToDatetimeLocal(start);
        completeBefore = formatToDatetimeLocal(end);
      }

      return {
        taskType: type,
        destinationAddress: "", // Empty - let useEffect handle address filling
        // Smart default: PHOTO proof for dropoffs, NONE for others
        completionRequirement: (type === "DROPOFF" ? "PHOTO" : "NONE") as
          | "PHOTO"
          | "NONE",
        completeAfter,
        completeBefore,
        notes:
          type === "PICKUP"
            ? "Collect package from sender"
            : type === "DROPOFF"
              ? "Deliver to recipient and collect signature/photo"
              : "",
        dependsOn: [] as string[],
      };
    },
    [], // No dependencies - useEffect handles address
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { tasks: [buildDefaultTask()] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const watchedTasks = useWatch({
    control,
    name: "tasks",
  });

  const { mutate: createTaskMutation, isPending } = useMutation({
    mutationFn: createTasks,
    onSuccess: () => {
      toast.success("Tasks created successfully");
      reset({ tasks: [buildDefaultTask()] });
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to create tasks"));
    },
  });

  useEffect(() => {
    if (!open) {
      reset({ tasks: [buildDefaultTask()] });
    }
  }, [open, reset, buildDefaultTask]);

  useEffect(() => {
    watchedTasks?.forEach((task, index) => {
      if (!task) return;
      const desired =
        task.taskType === "PICKUP"
          ? (pickupAddress ?? "")
          : task.taskType === "DROPOFF"
            ? (dropoffAddress ?? "")
            : "";

      // ALWAYS update if desired address differs from current
      if (task.destinationAddress !== desired && desired) {
        setValue(`tasks.${index}.destinationAddress`, desired, {
          shouldDirty: false,
        });
      }
    });
  }, [watchedTasks, pickupAddress, dropoffAddress, setValue]);

  const onSubmit = (values: FormValues) => {
    const payload = {
      bookingId,
      tasks: values.tasks.map((task, index) => ({
        taskType: task.taskType,
        destinationAddress: task.destinationAddress,
        ...(task.completionRequirement
          ? { completionRequirement: task.completionRequirement }
          : {}),
        completeAfter: toISOFromLocalInput(task.completeAfter),
        completeBefore: toISOFromLocalInput(task.completeBefore),
        notes: task.notes,
        dependsOn: task.dependsOn
          ?.map((dep) => Number(dep))
          .filter((dep) => dep < index),
      })),
    };

    createTaskMutation(payload);
  };

  const applyTemplate = (
    templateType: "pickup-dropoff" | "pickup" | "dropoff",
  ) => {
    if (templateType === "pickup-dropoff") {
      const pickup = buildDefaultTask("PICKUP");
      const dropoff = buildDefaultTask("DROPOFF");
      // Set dropoff to depend on pickup
      dropoff.dependsOn = ["0"];
      reset({ tasks: [pickup, dropoff] });
      toast.success("Pickup + Dropoff template applied");
    } else if (templateType === "pickup") {
      reset({ tasks: [buildDefaultTask("PICKUP")] });
      toast.success("Pickup template applied");
    } else if (templateType === "dropoff") {
      reset({ tasks: [buildDefaultTask("DROPOFF")] });
      toast.success("Dropoff template applied");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-brand">Create Tasks</DialogTitle>
          <DialogDescription>
            Create one or multiple tasks in the order you want them executed.
            Use dependencies to control sequencing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 pb-4 border-b border-neutral-200">
          <p className="text-xs font-medium text-brand">Quick Templates</p>

          <div className="grid grid-cols-3 gap-2">
            {/* Pickup + Dropoff */}
            <button
              type="button"
              onClick={() => applyTemplate("pickup-dropoff")}
              className="group bg-white border-2 border-neutral-300 hover:border-brand rounded-md p-2.5 text-center transition-all hover:shadow-md active:shadow-sm"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="size-7 rounded-full bg-neutral-100 group-hover:bg-brand flex items-center justify-center transition-colors">
                  <div className="flex gap-0.5">
                    <ArrowUp className="size-3 text-neutral-700 group-hover:text-white transition-colors" />
                    <ArrowDown className="size-3 text-neutral-700 group-hover:text-white transition-colors" />
                  </div>
                </div>
                <p className="font-medium text-xs text-brand group-hover:font-semibold">
                  Pickup + Dropoff
                </p>
              </div>
            </button>

            {/* Pickup Only */}
            <button
              type="button"
              onClick={() => applyTemplate("pickup")}
              className="group bg-white border-2 border-neutral-300 hover:border-brand rounded-md p-2.5 text-center transition-all hover:shadow-md active:shadow-sm"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="size-7 rounded-full bg-neutral-100 group-hover:bg-brand flex items-center justify-center transition-colors">
                  <ArrowUp className="size-3.5 text-neutral-700 group-hover:text-white transition-colors" />
                </div>
                <p className="font-medium text-xs text-brand group-hover:font-semibold">
                  Pickup Only
                </p>
              </div>
            </button>

            {/* Dropoff Only */}
            <button
              type="button"
              onClick={() => applyTemplate("dropoff")}
              className="group bg-white border-2 border-neutral-300 hover:border-brand rounded-md p-2.5 text-center transition-all hover:shadow-md active:shadow-sm"
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="size-7 rounded-full bg-neutral-100 group-hover:bg-brand flex items-center justify-center transition-colors">
                  <ArrowDown className="size-3.5 text-neutral-700 group-hover:text-white transition-colors" />
                </div>
                <p className="font-medium text-xs text-brand group-hover:font-semibold">
                  Dropoff Only
                </p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {fields.map((field, index) => {
              const dependencyOptions = fields
                .slice(0, index)
                .map((_, depIndex) => ({
                  label: `Task ${depIndex + 1}`,
                  value: depIndex.toString(),
                }));

              return (
                <div
                  key={field.id}
                  className="relative bg-white border-2 border-neutral-300 rounded-xl p-5 space-y-4 shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <p className="font-semibold text-base text-brand">
                        Task {index + 1}
                      </p>
                    </div>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-sm font-medium text-brand">
                        Task Type
                      </label>
                      <Controller
                        control={control}
                        name={`tasks.${index}.taskType`}
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select task type" />
                            </SelectTrigger>
                            <SelectContent >
                              <SelectItem
                                value="PICKUP"
                                className="focus:bg-brand-light"
                              >
                                Pickup
                              </SelectItem>
                              <SelectItem
                                value="DROPOFF"
                                className="focus:bg-brand-light"
                              >
                                Drop-off
                              </SelectItem>
                              <SelectItem
                                value="IN_HUB"
                                className="focus:bg-brand-light"
                              >
                                In hub
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.tasks?.[index]?.taskType && (
                        <p className="text-xs text-red-500">
                          {errors.tasks[index]?.taskType?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-medium text-brand">
                        Completion Requirement
                      </label>
                      <Controller
                        control={control}
                        name={`tasks.${index}.completionRequirement`}
                        render={({ field }) => (
                          <Select
                            onValueChange={(value) =>
                              field.onChange(
                                value === "NONE" ? undefined : value,
                              )
                            }
                            value={field.value ?? "NONE"}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select requirement" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="NONE"
                                className="focus:bg-brand-light"
                              >
                                None
                              </SelectItem>
                              <SelectItem
                                value="PHOTO"
                                className="focus:bg-brand-light"
                              >
                                Photo Proof
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {errors.tasks?.[index]?.completionRequirement && (
                        <p className="text-xs text-red-500">
                          {errors.tasks[index]?.completionRequirement?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-brand">
                      Destination Address
                    </label>
                    <Input
                      placeholder="Enter address"
                      {...register(
                        `tasks.${index}.destinationAddress` as const,
                      )}
                      aria-invalid={!!errors.tasks?.[index]?.destinationAddress}
                    />
                    {errors.tasks?.[index]?.destinationAddress && (
                      <p className="text-xs text-red-500">
                        {errors.tasks[index]?.destinationAddress?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-brand">
                        Dispatch Window
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Set the time range when this task must be completed
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-brand">
                          Earliest Start
                        </label>
                        <Input
                          type="datetime-local"
                          {...register(`tasks.${index}.completeAfter` as const)}
                        />
                        <p className="text-xs text-neutral-500">
                          Task can start after this time
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-medium text-brand">
                          Must Complete By
                        </label>
                        <Input
                          type="datetime-local"
                          {...register(
                            `tasks.${index}.completeBefore` as const,
                          )}
                        />
                        <p className="text-xs text-neutral-500">
                          Task must be done before this time
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-brand">Notes</label>
                    <Textarea
                      rows={3}
                      placeholder="Optional instructions"
                      {...register(`tasks.${index}.notes` as const)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-sm font-medium text-brand">Depends On</label>
                    <Controller
                      control={control}
                      name={`tasks.${index}.dependsOn`}
                      render={({ field }) => (
                        <div className="border border-neutral-300 rounded-md px-3 py-2 bg-white">
                          <MultiSelect
                            options={dependencyOptions}
                            value={field.value ?? []}
                            onChange={field.onChange}
                            placeholder={
                              dependencyOptions.length === 0
                                ? "No tasks available yet"
                                : "Select prerequisite tasks"
                            }
                          />
                        </div>
                      )}
                    />
                    {dependencyOptions.length === 0 && (
                      <p className="text-xs text-neutral-500">
                        Add more tasks to enable dependencies.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {errors.tasks && (
            <p className="text-xs text-red-500">{errors.tasks.message}</p>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full border-2 border-dashed text-brand border-brand hover:border-neutral-900 hover:bg-neutral-50 transition-all"
            onClick={() => append(buildDefaultTask())}
          >
            <Plus className="size-4 mr-2" />
            Add another task
          </Button>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border border-gray800"
            >
              Cancel
            </Button>
            <Button className="bg-brand text-white" type="submit" loading={isPending}>
              Save Tasks
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTasksModal;
