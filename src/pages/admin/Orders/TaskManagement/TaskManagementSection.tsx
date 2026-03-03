import { useMemo, useState } from "react";
import { useTasksByBooking } from "@/queries/tasks/useTasks";
import { TaskDto, deleteTask } from "@/services/tasks";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatDateTime, formatStatus, getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  MoreVertical,
  Pencil,
  Trash2,
  UserPlus,
  RefreshCw,
  Eye,
} from "lucide-react";
import CreateTasksModal from "./modals/CreateTasksModal";
import EditTaskModal from "./modals/EditTaskModal";
import AssignCompanyModal from "./modals/AssignCompanyModal";
import DispatchPreviewDialog from "./modals/DispatchPreviewDialog";

const taskStatusClasses: Record<string, string> = {
  DRAFT: "bg-slate-100 text-slate-800",
  DISPATCHED: "bg-blue-100 text-blue-800",
  ACCEPTED: "bg-indigo-100 text-indigo-800",
  DECLINED: "bg-red-100 text-red-800",
  ACTIVE: "bg-purple-100 text-purple-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-200 text-gray-800",
  TERMINATED: "bg-orange-100 text-orange-800",
};

const TASK_TYPE_LABELS: Record<string, string> = {
  PICKUP: "Pickup",
  DROPOFF: "Drop-off",
  IN_HUB: "In Hub",
};

interface TaskManagementSectionProps {
  bookingId: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  trackingNumber?: string;
}

const TaskManagementSection = ({
  bookingId,
  pickupAddress,
  dropoffAddress,
  trackingNumber,
}: TaskManagementSectionProps) => {
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskDto | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useTasksByBooking(bookingId, {
    enabled: !!bookingId,
  });
  const tasks = useMemo<TaskDto[]>(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray((data as { data?: TaskDto[] }).data)) {
      return (data as { data?: TaskDto[] }).data ?? [];
    }

    if (Array.isArray((data as { tasks?: TaskDto[] }).tasks)) {
      return (data as { tasks?: TaskDto[] }).tasks ?? [];
    }

    return [];
  }, [data]);

  const selectableIds = useMemo(
    () => tasks.filter((task) => task.status === "DRAFT").map((task) => task.id),
    [tasks]
  );

  const isAllSelected =
    selectableIds.length > 0 &&
    selectableIds.every((taskId) => selectedTaskIds.includes(taskId));

  const toggleAll = () => {
    if (isAllSelected) {
      setSelectedTaskIds([]);
    } else {
      setSelectedTaskIds(selectableIds);
    }
  };

  const toggleSelection = (taskId: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const { mutate: removeTask, isPending: isDeleting } = useMutation({
    mutationFn: (taskId: string) => deleteTask(taskId),
    onSuccess: (_, taskId) => {
      toast.success("Task deleted");
      setSelectedTaskIds((prev) => prev.filter((id) => id !== taskId));
      refetch();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to delete task"));
    },
  });

  const handleDelete = (task: TaskDto) => {
    if (task.status !== "DRAFT") {
      toast.error("Only draft tasks can be deleted");
      return;
    }

    const confirmDelete = window.confirm(
      "Delete this task? This action cannot be undone."
    );
    if (!confirmDelete) return;

    removeTask(task.id);
  };

  const handleAssign = (taskIds: string[]) => {
    if (taskIds.length === 0) {
      toast.error("Select at least one draft task to assign");
      return;
    }
    setSelectedTaskIds(taskIds);
    setAssignOpen(true);
  };

  const handleEdit = (task: TaskDto) => {
    if (task.status !== "DRAFT") {
      toast.error("Only draft tasks can be updated");
      return;
    }
    setEditingTask(task);
  };

  const renderStatusPill = (status: string) => (
    <span
      className={cn(
        taskStatusClasses[status] || "bg-gray-100 text-gray-800",
        "px-3 py-1 text-xs font-medium rounded-full"
      )}
    >
      {formatStatus(status)}
    </span>
  );

  return (
    <section className="bg-white rounded-2xl border border-neutral200 p-4 mt-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <p className="text-base font-semibold font-clash text-brand">
            Task Management
          </p>
          <p className="text-sm text-neutral600">
            Create, assign and dispatch internal tasks tied to this booking.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            className="border-brand text-brand"
            onClick={() => refetch()}
          >
            <RefreshCw className="size-4" />
            Refresh
          </Button>
          <Button variant="outline" className="border-brand text-brand" 
            onClick={() => setPreviewOpen(true)}>
            <Eye className="size-4 text-brand" />
            Preview Dispatch
          </Button>
          <Button className="border-brand text-white bg-brand" onClick={() => setIsCreateOpen(true)}>
            + Create Tasks
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="py-10 flex justify-center">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="py-10 text-center text-sm text-red-500">
          Unable to load tasks. Please try again.
        </div>
      )}

      {!isLoading && !isError && tasks.length === 0 && (
        <div className="py-10 text-center text-sm text-neutral600">
          No tasks created for this booking yet.
        </div>
      )}

      {!isLoading && !isError && tasks.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3 p-3 bg-neutral50 rounded-lg border border-neutral200">
            <div className="flex items-center gap-2 text-sm text-neutral600">
              <Checkbox
                checked={isAllSelected}
                onCheckedChange={toggleAll}
                disabled={selectableIds.length === 0}
              />
              <span>
                {selectedTaskIds.length} of {selectableIds.length} draft tasks
                selected
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-neutral300 text-neutral800"
                onClick={() => handleAssign(selectedTaskIds)}
                disabled={selectedTaskIds.length === 0}
              >
                <UserPlus className="size-4" />
                Assign Selected ({selectedTaskIds.length})
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAssign(selectableIds)}
                disabled={selectableIds.length === 0}
              >
                Assign All Draft Tasks
              </Button>
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <div className="min-w-[1100px]">
              <div className="grid grid-cols-[60px_repeat(8,minmax(0,1fr))_140px] gap-4 text-xs font-semibold uppercase text-neutral500 border-b border-neutral200 pb-2">
                <span>Select</span>
                <span>Task</span>
                <span>Destination</span>
                <span>Company</span>
                <span>Schedule</span>
                <span>Requirement</span>
                <span>Proof</span>
                <span>Status Info</span>
                <span>Dispatch Link</span>
                <span className="text-right">Actions</span>
              </div>

              <div className="divide-y divide-neutral200">
                {tasks.map((task) => {
                  const isSelectable = task.status === "DRAFT";
                  const isChecked = selectedTaskIds.includes(task.id);

                  return (
                    <div
                      key={task.id}
                      className="grid grid-cols-[60px_repeat(8,minmax(0,1fr))_140px] gap-4 py-4 text-sm items-start group hover:bg-neutral50"
                    >
                      <div className="pt-1">
                        <Checkbox
                          checked={isChecked}
                          disabled={!isSelectable}
                          onCheckedChange={() => {
                            if (isSelectable) {
                              toggleSelection(task.id);
                            }
                          }}
                        />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold">
                          {TASK_TYPE_LABELS[task.taskType] ?? task.taskType}
                        </p>
                        {renderStatusPill(task.status)}
                      </div>
                      <div className="text-neutral700">
                        <p className="font-medium">
                          {task.destinationAddress || "—"}
                        </p>
                        {task.notes && (
                          <p className="text-xs text-neutral500 truncate">
                            {task.notes}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {task.companyName ?? "Unassigned"}
                        </p>
                      </div>
                      <div className="text-sm text-neutral700">
                        {task.completeAfter && (
                          <p>Start: {formatDateTime(task.completeAfter)}</p>
                        )}
                        {task.completeBefore && (
                          <p>Deadline: {formatDateTime(task.completeBefore)}</p>
                        )}
                      </div>
                      <div className="text-neutral700">
                        <p>
                          {task.completionRequirement
                            ? formatStatus(task.completionRequirement)
                            : "Not required"}
                        </p>
                        {task.dependsOn && task.dependsOn.length > 0 && (
                          <p className="text-xs text-neutral500">
                            Depends on {task.dependsOn.length} task
                            {task.dependsOn.length > 1 ? "s" : ""}
                          </p>
                        )}
                      </div>
                      <div className="text-neutral700">
                        {getProofLinks(task).length > 0 ? (
                          <div className="flex flex-col gap-2">
                            {getProofLinks(task).map((proof, index) => (
                              <a
                                key={proof.url + index}
                                href={proof.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-purple500 text-xs hover:underline break-all"
                              >
                                {proof.label}
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-neutral500">No proofs</p>
                        )}
                      </div>
                      <div className="text-neutral700">
                        {(task.status === "DECLINED" || task.status === "TERMINATED") && (task.terminationReason || task.declineReason) ? (
                          <div className="bg-red-50 border border-red-200 rounded-md p-2 space-y-1">
                            <p className="text-xs font-semibold text-red-800">Cannot Complete</p>
                            <p className="text-xs text-red-700 leading-relaxed">
                              {task.terminationReason || task.declineReason}
                            </p>
                          </div>
                        ) : task.status === "COMPLETED" ? (
                          <p className="text-xs text-green-600 font-medium">Task completed successfully</p>
                        ) : (
                          <p className="text-xs text-neutral500">—</p>
                        )}
                      </div>
                      <div className="text-neutral700">
                        {getPreviewLink(task, trackingNumber) ? (
                          <div className="flex flex-col gap-2 text-xs">
                            <a
                              href={getPreviewLink(task, trackingNumber) ?? "#"}
                              target="_blank"
                              rel="noreferrer"
                              className="text-purple500 hover:underline break-all"
                            >
                              Open link
                            </a>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-xs px-2 py-1 h-auto w-fit"
                              onClick={() => {
                                const link = getPreviewLink(task, trackingNumber);
                                if (!link) return;
                                if (
                                  typeof navigator !== "undefined" &&
                                  navigator?.clipboard?.writeText
                                ) {
                                  navigator.clipboard
                                    .writeText(link)
                                    .then(() => toast.success("Link copied"))
                                    .catch(() =>
                                      toast.error("Unable to copy link")
                                    );
                                } else {
                                  toast.error("Clipboard not available");
                                }
                              }}
                            >
                              Copy link
                            </Button>
                          </div>
                        ) : (
                          <p className="text-xs text-neutral500">No link</p>
                        )}
                      </div>
                      <div className="flex items-center justify-end gap-1">
                        {/* Inline Quick Actions - Visible on Hover */}
                        {task.status === "DRAFT" && (
                          <div className="hidden group-hover:flex items-center gap-1">
                            <button
                              className="p-1.5 rounded-md hover:bg-neutral200 text-neutral700"
                              onClick={() => handleEdit(task)}
                              title="Edit task"
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              className="p-1.5 rounded-md hover:bg-neutral200 text-neutral700"
                              onClick={() => handleAssign([task.id])}
                              title="Assign company"
                            >
                              <UserPlus className="size-3.5" />
                            </button>
                            <button
                              className="p-1.5 rounded-md hover:bg-red-100 text-red-600"
                              onClick={() => handleDelete(task)}
                              title="Delete task"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        )}

                        {/* More Options Menu */}
                        <Popover
                          open={activePopoverId === task.id}
                          onOpenChange={(open) =>
                            setActivePopoverId(open ? task.id : null)
                          }
                        >
                          <PopoverTrigger asChild>
                            <button className="border border-neutral300 rounded-md p-2 hover:bg-neutral100">
                              <MoreVertical className="size-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent
                            align="end"
                            className="w-44 p-2 text-sm space-y-1"
                          >
                            <button
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral100"
                              onClick={() => {
                                setActivePopoverId(null);
                                handleEdit(task);
                              }}
                            >
                              <Pencil className="size-4" />
                              Edit
                            </button>
                            <button
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral100"
                              onClick={() => {
                                setActivePopoverId(null);
                                if (task.status !== "DRAFT") {
                                  toast.error("Only draft tasks can be assigned");
                                  return;
                                }
                                handleAssign([task.id]);
                              }}
                            >
                              <UserPlus className="size-4" />
                              Assign
                            </button>
                            <button
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral100 text-red-500"
                              disabled={isDeleting && activePopoverId === task.id}
                              onClick={() => {
                                setActivePopoverId(null);
                                handleDelete(task);
                              }}
                            >
                              <Trash2 className="size-4" />
                              Delete
                            </button>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {tasks.map((task) => {
              const isSelectable = task.status === "DRAFT";
              const isChecked = selectedTaskIds.includes(task.id);

              return (
                <div
                  key={task.id}
                  className="bg-white border border-neutral200 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      {isSelectable && (
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => toggleSelection(task.id)}
                          className="mt-1"
                        />
                      )}
                      <div className="flex-1 space-y-2">
                        <div>
                          <p className="font-semibold text-base">
                            {TASK_TYPE_LABELS[task.taskType] ?? task.taskType}
                          </p>
                          {renderStatusPill(task.status)}
                        </div>
                        <div className="text-sm text-neutral700">
                          <p className="font-medium">{task.destinationAddress || "—"}</p>
                          {task.notes && (
                            <p className="text-xs text-neutral500 mt-1">{task.notes}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-neutral500 uppercase">Company</p>
                      <p className="font-medium">{task.companyName ?? "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral500 uppercase">Requirement</p>
                      <p>
                        {task.completionRequirement
                          ? formatStatus(task.completionRequirement)
                          : "Not required"}
                      </p>
                    </div>
                  </div>

                  {(task.completeAfter || task.completeBefore) && (
                    <div className="text-xs text-neutral700 space-y-1 p-2 bg-neutral50 rounded-md">
                      {task.completeAfter && (
                        <p>Window Start: {formatDateTime(task.completeAfter)}</p>
                      )}
                      {task.completeBefore && (
                        <p>Window End: {formatDateTime(task.completeBefore)}</p>
                      )}
                    </div>
                  )}

                  {(task.status === "DECLINED" || task.status === "TERMINATED") && (task.terminationReason || task.declineReason) && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
                      <p className="text-xs font-semibold text-red-800 uppercase tracking-wide">Cannot Complete</p>
                      <p className="text-sm text-red-700 leading-relaxed">
                        {task.terminationReason || task.declineReason}
                      </p>
                    </div>
                  )}

                  {getPreviewLink(task, trackingNumber) && (
                    <div className="flex gap-2">
                      <a
                        href={getPreviewLink(task, trackingNumber) ?? "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-purple500 hover:underline text-sm"
                      >
                        View Dispatch Link
                      </a>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs px-2 py-1 h-auto"
                        onClick={() => {
                          const link = getPreviewLink(task, trackingNumber);
                          if (!link) return;
                          if (
                            typeof navigator !== "undefined" &&
                            navigator?.clipboard?.writeText
                          ) {
                            navigator.clipboard
                              .writeText(link)
                              .then(() => toast.success("Link copied"))
                              .catch(() => toast.error("Unable to copy link"));
                          } else {
                            toast.error("Clipboard not available");
                          }
                        }}
                      >
                        Copy
                      </Button>
                    </div>
                  )}

                  {task.status === "DRAFT" && (
                    <div className="flex gap-2 pt-2 border-t border-neutral200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(task)}
                        className="flex-1"
                      >
                        <Pencil className="size-3.5" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAssign([task.id])}
                        className="flex-1"
                      >
                        <UserPlus className="size-3.5" />
                        Assign
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(task)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      <CreateTasksModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        bookingId={bookingId}
        pickupAddress={pickupAddress}
        dropoffAddress={dropoffAddress}
        onSuccess={() => {
          refetch();
          setSelectedTaskIds([]);
        }}
      />

      <EditTaskModal
        task={editingTask}
        allTasks={tasks}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTask(null);
          }
        }}
        onSuccess={() => {
          refetch();
          setSelectedTaskIds([]);
        }}
      />

      <AssignCompanyModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        taskIds={selectedTaskIds}
        onSuccess={() => {
          refetch();
          setAssignOpen(false);
          setSelectedTaskIds([]);
        }}
      />

      <DispatchPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        bookingId={bookingId}
        onDispatched={() => {
          refetch();
          setPreviewOpen(false);
        }}
      />
    </section>
  );
};

export default TaskManagementSection;
  const getProofLinks = (task: TaskDto) => {
    const proofs: Array<{ url: string; label: string }> = [];

    task.completionProofs?.forEach((proof, index) => {
      const url = proof?.url || proof?.fileUrl;
      if (url) {
        proofs.push({
          url,
          label: proof?.fileName || `Proof ${index + 1}`,
        });
      }
    });

    task.proofPhotos?.forEach((url, index) => {
      if (url) {
        proofs.push({
          url,
          label: `Photo ${proofs.length + index + 1}`,
        });
      }
    });

    return proofs;
  };

  const getPreviewLink = (task: TaskDto, tracking?: string) => {
    if (typeof window === "undefined") return null;
    if (!task.previewToken || !tracking) return null;
    return `${window.location.origin}/dispatch/${tracking}/${task.previewToken}`;
  };
