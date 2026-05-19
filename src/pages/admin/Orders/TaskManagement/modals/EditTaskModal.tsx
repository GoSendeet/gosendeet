import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskDto, updateTask } from "@/services/tasks";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getErrorMessage,
  toDateTimeLocalInput,
  toISOFromLocalInput,
} from "@/lib/utils";
import { MultiSelect } from "@/components/ui/multi";

const schema = z.object({
  taskType: z.enum(["PICKUP", "DROPOFF", "IN_HUB"]),
  destinationAddress: z
    .string({ required_error: "Destination is required" })
    .min(3, "Destination is required"),
  completionRequirement: z
    .enum(["PHOTO", "NONE"])
    .optional()
    .or(z.literal("").optional()),
  completeAfter: z.string().optional(),
  completeBefore: z.string().optional(),
  notes: z.string().optional(),
  dependsOn: z.array(z.string()).optional(),
});

type FormValues = z.infer<typeof schema>;
type EditableCompletionRequirement = NonNullable<
  FormValues["completionRequirement"]
>;

const toEditableCompletionRequirement = (
  value: TaskDto["completionRequirement"],
): EditableCompletionRequirement | undefined =>
  value === "PHOTO" || value === "NONE" ? value : undefined;

interface EditTaskModalProps {
  task: TaskDto | null;
  allTasks: TaskDto[];
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditTaskModal = ({ task, allTasks, onOpenChange, onSuccess }: EditTaskModalProps) => {
  const open = !!task;

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      taskType: "PICKUP",
      destinationAddress: "",
      completionRequirement: undefined,
      completeAfter: "",
      completeBefore: "",
      notes: "",
      dependsOn: [],
    },
  });

  useEffect(() => {
    if (task) {
      reset({
        taskType: task.taskType,
        destinationAddress: task.destinationAddress || "",
        completionRequirement: toEditableCompletionRequirement(
          task.completionRequirement,
        ),
        completeAfter: toDateTimeLocalInput(task.completeAfter),
        completeBefore: toDateTimeLocalInput(task.completeBefore),
        notes: task.notes ?? "",
        dependsOn: task.dependsOn ?? [],
      });
    }
  }, [task, reset]);

  const { mutate, isPending } = useMutation({
    mutationFn: (variables: { taskId: string; data: FormValues }) => {
      const { completionRequirement, dependsOn, ...rest } = variables.data;
      const payload = {
        ...rest,
        ...(completionRequirement
          ? { completionRequirement }
          : {}),
        completeAfter: toISOFromLocalInput(variables.data.completeAfter),
        completeBefore: toISOFromLocalInput(variables.data.completeBefore),
        dependsOn: dependsOn ?? [],
      };
      return updateTask(variables.taskId, payload);
    },
    onSuccess: () => {
      toast.success("Task updated");
      onOpenChange(false);
      onSuccess();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to update task"));
    },
  });

  const onSubmit = (values: FormValues) => {
    if (!task) return;
    mutate({ taskId: task.id, data: values });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update task details before assignment. Only draft tasks can be edited.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Task Type</label>
              <Controller
                control={control}
                name="taskType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PICKUP">Pickup</SelectItem>
                      <SelectItem value="DROPOFF">Drop-off</SelectItem>
                      <SelectItem value="IN_HUB">In Hub</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.taskType && (
                <p className="text-xs text-red-500">{errors.taskType.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Completion Requirement</label>
              <Controller
                control={control}
                name="completionRequirement"
                render={({ field }) => (
                  <Select
                    value={field.value ?? "NONE"}
                    onValueChange={(value) =>
                      field.onChange(value === "NONE" ? undefined : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NONE">None</SelectItem>
                      <SelectItem value="PHOTO">Photo Proof</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.completionRequirement && (
                <p className="text-xs text-red-500">
                  {errors.completionRequirement.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Destination Address</label>
            <Input
              placeholder="Enter address"
              {...register("destinationAddress")}
              aria-invalid={!!errors.destinationAddress}
            />
            {errors.destinationAddress && (
              <p className="text-xs text-red-500">
                {errors.destinationAddress.message}
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-semibold text-neutral-700">Dispatch Window</p>
              <p className="text-xs text-neutral-500 mt-1">
                Set the time range when this task must be completed
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Earliest Start</label>
                <Input type="datetime-local" {...register("completeAfter")} />
                <p className="text-xs text-neutral-500">Task can start after this time</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Must Complete By</label>
                <Input type="datetime-local" {...register("completeBefore")} />
                <p className="text-xs text-neutral-500">Task must be done before this time</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Task Notes</label>
            <Textarea
              rows={3}
              {...register("notes")}
              placeholder="Add special instructions or requirements for this task"
            />
            <p className="text-xs text-neutral500">These notes will be visible to the dispatch partner</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Depends On</label>
            <Controller
              control={control}
              name="dependsOn"
              render={({ field }) => {
                // Create options from all tasks except the current one
                const dependencyOptions = allTasks
                  .filter((t) => t.id !== task?.id && t.status === "DRAFT")
                  .map((t) => ({
                    label: `${t.taskType} - ${t.destinationAddress}`,
                    value: t.id,
                  }));

                return (
                  <div className="border border-neutral-300 rounded-md px-3 py-2 bg-white">
                    <MultiSelect
                      options={dependencyOptions}
                      value={field.value ?? []}
                      onChange={field.onChange}
                      placeholder={
                        dependencyOptions.length === 0
                          ? "No other draft tasks available"
                          : "Select prerequisite tasks"
                      }
                    />
                  </div>
                );
              }}
            />
            <p className="text-xs text-neutral-500">
              This task will only be available after selected tasks are completed.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral200">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={isPending} className="min-w-[120px]">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskModal;
