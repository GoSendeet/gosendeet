import { useMemo, useState, useCallback, useEffect } from "react";
import { CheckCircle2, Circle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import { usePublicDispatch } from "@/queries/dispatch/usePublicDispatch";
import {
  acceptDispatch,
  declineDispatch,
  startTask,
  completeTask,
  updateTaskEtaWindow,
  terminateTask,
} from "@/services/dispatchPublic";
import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  formatDate,
  formatStatus,
  getErrorMessage,
  formatToDatetimeLocal,
  formatTo12Hour,
  toISOFromLocalInput,
} from "@/lib/utils";
import { TaskDto } from "@/services/tasks";

type TabView = "review" | "ongoing" | "completed";

const getRelativeDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Reset hours for accurate day comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);

  if (targetDate.getTime() === today.getTime()) {
    return "today";
  } else if (targetDate.getTime() === tomorrow.getTime()) {
    return "tomorrow";
  } else {
    // Format as "November 15" or "December 3"
    const month = date.toLocaleString("en-US", { month: "long" });
    const day = date.getDate();
    return `${month} ${day}`;
  }
};

const PublicDispatchPage = () => {
  const { token = "", trackingId = "" } = useParams();
  const navigate = useNavigate();

  const missingToken = !token;

  const [activeTab, setActiveTab] = useState<TabView>("review");
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [declineDialogOpen, setDeclineDialogOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState("");
  const [etaDialogOpen, setEtaDialogOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [startingTaskId, setStartingTaskId] = useState<string | null>(null);
  const [draftEtaStart, setDraftEtaStart] = useState("");
  const [draftEtaEnd, setDraftEtaEnd] = useState("");
  const [completionNotes, setCompletionNotes] = useState<Record<string, string>>({});
  const [completionMessages, setCompletionMessages] = useState<Record<string, string>>({});
  const [completionProofs, setCompletionProofs] = useState<Record<string, File[]>>({});
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [showInternalNotes, setShowInternalNotes] = useState(false);
  const [terminatingTaskId, setTerminatingTaskId] = useState<string | null>(null);
  const [terminateReason, setTerminateReason] = useState("");

  const { data, isLoading, isError, refetch } = usePublicDispatch(
    token,
    !!token
  );

  const dispatchView = useMemo(() => data, [data]);
  const aggregatedStatus = dispatchView?.aggregatedStatus ?? "UNKNOWN";
  const displayStatus =
    aggregatedStatus === "DISPATCHED" ? "ASSIGNED" : aggregatedStatus;
  const allowResponse = aggregatedStatus === "DISPATCHED";
  const isAccepted = aggregatedStatus === "ACCEPTED";
  const isDeclined = aggregatedStatus === "DECLINED";

  // Define tasks early so we can use it for allTasksCompleted
  const allTasks = (dispatchView?.tasks ?? []).filter((task) => task.status !== "DRAFT");

  // Sort tasks: ACTIVE first, then ACCEPTED, then COMPLETED
  // Within each status, sort by dependencies and task type
  const tasks = useMemo(() => {
    return [...allTasks].sort((a, b) => {
      // 1. Status priority: ACTIVE > ACCEPTED > COMPLETED
      const statusPriority = { ACTIVE: 0, ACCEPTED: 1, COMPLETED: 2 };
      const aPriority = statusPriority[a.status as keyof typeof statusPriority] ?? 3;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] ?? 3;

      if (aPriority !== bPriority) return aPriority - bPriority;

      // 2. Then by dependencies (tasks with no dependencies first)
      const aDeps = a.dependsOn?.length ?? 0;
      const bDeps = b.dependsOn?.length ?? 0;
      if (aDeps !== bDeps) return aDeps - bDeps;

      // 3. Then by task type (PICKUP before DROPOFF)
      const typeOrder = { PICKUP: 0, IN_HUB: 1, DROPOFF: 2 };
      const aType = typeOrder[a.taskType as keyof typeof typeOrder] ?? 3;
      const bType = typeOrder[b.taskType as keyof typeof typeOrder] ?? 3;
      return aType - bType;
    });
  }, [allTasks]);

  const allTasksCompleted = tasks.length > 0 && tasks.every(t => t.status === "COMPLETED");
  const totalActionableTasks = tasks.length;
  const completedActionableTasks = tasks.filter((task) => task.status === "COMPLETED").length;

  // Filter tasks by their status for different views
  const dispatchedTasks = useMemo(() => tasks.filter(t => t.status === "DISPATCHED"), [tasks]);
  const ongoingTasks = useMemo(() => tasks.filter(t => t.status === "ACCEPTED" || t.status === "ACTIVE"), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.status === "COMPLETED" || t.status === "DECLINED" || t.status === "TERMINATED"), [tasks]);

  // Get the current view's tasks based on active tab
  const currentViewTasks = useMemo(() => {
    switch (activeTab) {
      case "review":
        return dispatchedTasks;
      case "ongoing":
        return ongoingTasks;
      case "completed":
        return completedTasks;
      default:
        return [];
    }
  }, [activeTab, dispatchedTasks, ongoingTasks, completedTasks]);

  // Auto-redirect logic on page load and when tasks change
  useEffect(() => {
    if (dispatchedTasks.length > 0) {
      setActiveTab("review");
    } else if (ongoingTasks.length > 0) {
      setActiveTab("ongoing");
    } else if (completedTasks.length > 0) {
      setActiveTab("completed");
    }
  }, [dispatchedTasks.length, ongoingTasks.length, completedTasks.length]);

  const acceptMutation = useMutation({
    mutationFn: (message?: string) => acceptDispatch(token, message),
    onSuccess: (res) => {
      toast.success(res?.message ?? "Dispatch accepted");
      setAcceptDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to accept dispatch"));
    },
  });

  const declineMutation = useMutation({
    mutationFn: (reason: string) => declineDispatch(token, reason),
    onSuccess: (res) => {
      toast.success(res?.message ?? "Dispatch declined");
      setDeclineDialogOpen(false);
      setDeclineReason("");
      refetch();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to decline dispatch"));
    },
  });

  const startMutation = useMutation({
    mutationFn: (taskId: string) => startTask(token, taskId),
    onSuccess: () => {
      toast.success("Task started");
      refetch();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to start task"));
    },
  });

  const etaWindowMutation = useMutation({
    mutationFn: ({ taskId, windowStart, windowEnd }: { taskId: string; windowStart: string; windowEnd: string }) =>
      updateTaskEtaWindow(token, taskId, windowStart, windowEnd),
    onSuccess: (_, { taskId }) => {
      // Check if we're in start mode
      if (startingTaskId === taskId) {
        // Auto-start the task after ETA is set
        startMutation.mutate(taskId);
        setStartingTaskId(null);
        toast.success("ETA set, starting task...");
      } else {
        toast.success("ETA window updated");
      }
      setEtaDialogOpen(false);
      setEditingTaskId(null);
      refetch();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to update ETA window"));
    },
  });

  const terminateMutation = useMutation({
    mutationFn: ({ taskId, reason }: { taskId: string; reason: string }) =>
      terminateTask(token, taskId, reason),
    onSuccess: (res) => {
      toast.success(res?.message ?? "Task terminated");
      setTerminatingTaskId(null);
      setTerminateReason("");
      refetch();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to terminate task"));
    },
  });

  // ETA Modal Handlers
  const handleOpenEtaDialog = useCallback((task: TaskDto) => {
    setEditingTaskId(task.id);

    // Initialize with existing ETA or smart defaults
    if (task.estimatedTimeWindowStart && task.estimatedTimeWindowEnd) {
      setDraftEtaStart(formatToDatetimeLocal(new Date(task.estimatedTimeWindowStart)));
      setDraftEtaEnd(formatToDatetimeLocal(new Date(task.estimatedTimeWindowEnd)));
    } else {
      // Default: 2 hours from now to 4 hours from now
      const start = new Date(Date.now() + 2 * 60 * 60 * 1000);
      const end = new Date(Date.now() + 4 * 60 * 60 * 1000);
      setDraftEtaStart(formatToDatetimeLocal(start));
      setDraftEtaEnd(formatToDatetimeLocal(end));
    }

    setEtaDialogOpen(true);
  }, []);

  const handleCloseEtaDialog = useCallback(() => {
    setEtaDialogOpen(false);
    setEditingTaskId(null);
    setStartingTaskId(null);
    setDraftEtaStart("");
    setDraftEtaEnd("");
  }, []);

  const handleSaveEta = useCallback(() => {
    if (!editingTaskId || !draftEtaStart || !draftEtaEnd) {
      toast.error("Please provide both start and end times");
      return;
    }

    const windowStart = toISOFromLocalInput(draftEtaStart);
    const windowEnd = toISOFromLocalInput(draftEtaEnd);

    if (!windowStart || !windowEnd) {
      toast.error("Please provide valid start and end times");
      return;
    }

    etaWindowMutation.mutate({ taskId: editingTaskId, windowStart, windowEnd });
  }, [editingTaskId, draftEtaStart, draftEtaEnd, etaWindowMutation]);

  const setEtaWindowPreset = useCallback((hoursFromNowStart: number, hoursFromNowEnd: number) => {
    const start = new Date(Date.now() + hoursFromNowStart * 60 * 60 * 1000);
    const end = new Date(Date.now() + hoursFromNowEnd * 60 * 60 * 1000);
    setDraftEtaStart(formatToDatetimeLocal(start));
    setDraftEtaEnd(formatToDatetimeLocal(end));
  }, []);

  const setEtaWindowTomorrow = useCallback(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    const end = new Date(tomorrow);
    end.setHours(17, 0, 0, 0);
    setDraftEtaStart(formatToDatetimeLocal(tomorrow));
    setDraftEtaEnd(formatToDatetimeLocal(end));
  }, []);

  // Auto-scroll to active task
  useEffect(() => {
    const activeTask = tasks.find(t => t.status === "ACTIVE");
    if (activeTask) {
      const element = document.getElementById(`task-${activeTask.id}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    }
  }, [tasks]);

  const completeMutation = useMutation<
    unknown,
    unknown,
    string
  >({
    mutationFn: (taskId: string) =>
      completeTask(token, taskId, {
        message: completionMessages[taskId],
        notes: completionNotes[taskId],
        proofPhotos: completionProofs[taskId],
      }),
    onSuccess: (_, taskId) => {
      toast.success("Task completed");
      setCompletionProofs((prev) => {
        if (!prev[taskId]) return prev;
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      setCompletionMessages((prev) => {
        if (!prev[taskId]) return prev;
        const next = { ...prev };
        delete next[taskId];
        return next;
      });
      refetch();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to complete task"));
    },
  });

  if (missingToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral100 px-4 text-center">
        <p className="text-xl font-semibold mb-4">Dispatch token missing or invalid</p>
        <Button onClick={() => navigate("/" )}>Go Home</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (isError || !dispatchView) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <p className="text-xl font-semibold mb-4">Unable to load dispatch details</p>
        <Button onClick={() => refetch()}>Retry</Button>
      </div>
    );
  }

  const handleStart = (task: TaskDto) => {
    if (task.status !== "ACCEPTED") {
      toast.error("Only accepted tasks can be started");
      return;
    }
    // Open ETA dialog to set ETA before starting
    setStartingTaskId(task.id);
    handleOpenEtaDialog(task);
  };

  const handleOpenCompleteDialog = (task: TaskDto) => {
    if (task.status !== "ACTIVE") {
      toast.error("Only active tasks can be completed");
      return;
    }
    setCompletingTaskId(task.id);
  };

  const handleSubmitCompletion = () => {
    if (!completingTaskId) return;

    const task = tasks.find((t) => t.id === completingTaskId);
    if (!task) return;

    if (
      task.completionRequirement === "PHOTO" &&
      (!completionProofs[completingTaskId] || completionProofs[completingTaskId]?.length === 0)
    ) {
      toast.error("Upload at least one proof photo before completing");
      return;
    }

    completeMutation.mutate(completingTaskId);
    setCompletingTaskId(null);
  };

  const handleDecline = () => {
    if (!declineReason.trim()) {
      toast.error("Please provide a decline reason");
      return;
    }
    declineMutation.mutate(declineReason.trim());
  };

  const handleOpenTerminateDialog = (task: TaskDto) => {
    if (task.status !== "ACTIVE" && task.status !== "ACCEPTED") {
      toast.error("Only active or accepted tasks can be terminated");
      return;
    }
    setTerminatingTaskId(task.id);
  };

  const handleSubmitTerminate = () => {
    if (!terminatingTaskId) return;
    if (!terminateReason.trim()) {
      toast.error("Please provide a termination reason");
      return;
    }
    terminateMutation.mutate({ taskId: terminatingTaskId, reason: terminateReason.trim() });
  };

  return (
    <div className="min-h-screen bg-neutral100 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="bg-white rounded-2xl border border-neutral200 p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-neutral500">Tracking ID</p>
              <h1 className="text-2xl font-semibold">{dispatchView.trackingNumber}</h1>
              {trackingId && trackingId !== dispatchView.trackingNumber && (
                <p className="text-sm text-red-500">
                  Warning: tracking ID mismatch. Verify your link.
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs uppercase text-neutral500">Aggregated Status</p>
              <p className="text-xl font-semibold">{formatStatus(displayStatus)}</p>
              <p className="text-sm text-neutral600">
                {completedActionableTasks}/{totalActionableTasks} tasks completed
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase text-neutral500">Company</p>
              <p className="font-medium">{dispatchView.companyName}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-neutral500">Order</p>
              <p className="font-medium">{dispatchView.orderNumber}</p>
            </div>
          </div>
        </header>

        {/* Urgent Call-to-Action Banner for New Tasks */}
        {dispatchedTasks.length > 0 && activeTab !== "review" && !isDeclined && (
          <div className="relative backdrop-blur-sm border-2 border-orange-400/60 rounded-2xl p-6 shadow-sm shadow-orange-500/5 animate-in slide-in-from-top-2 duration-500 overflow-hidden">
            {/* Ambient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400/5 to-amber-400/5 blur-xl"></div>

            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-4">
                {/* Animated icon with pulsing ring */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-emerald-50 rounded-full opacity-20 animate-ping"></div>
                  <div className="relative bg-emerald-50  p-3 rounded-full shadow-lg">
                    <AlertCircle className="size-6 text-white" strokeWidth={2.5} fill="none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="text-xl font-bold text-orange-900">
                      New Tasks Awaiting Review
                    </p>
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-orange-500 text-white shadow-md shadow-orange-500/30">
                      {dispatchedTasks.length}
                    </span>
                  </div>
                  <p className="text-sm text-orange-800/90 font-medium">
                    {dispatchedTasks.length === 1 ? "1 task needs" : `${dispatchedTasks.length} tasks need`} your attention. Review and accept to get started.
                  </p>
                </div>
              </div>

              <Button
                onClick={() => setActiveTab("review")}
                className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-semibold px-8 py-6 shadow-lg shadow-orange-500/40 hover:shadow-xl hover:shadow-orange-500/50 transition-all hover:scale-105 active:scale-100 border-0"
                size="lg"
              >
                Review Now →
              </Button>
            </div>
          </div>
        )}

        {/* Task Summary Banner */}
        {!allTasksCompleted && !isDeclined && (dispatchedTasks.length === 0 || activeTab === "review") && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-brand">
                  {activeTab === "review" && dispatchedTasks.length > 0
                    ? `Review ${dispatchedTasks.length} new ${dispatchedTasks.length === 1 ? "task" : "tasks"}`
                    : "Task Overview"}
                </p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600">To Review:</span>
                  <span className="font-semibold text-gray-600">
                    {dispatchedTasks.length}
                  </span>
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600">Ongoing:</span>
                  <span className={cn(
                    "font-semibold",
                    ongoingTasks.length > 0 ? "text-blue-600" : "text-neutral-900"
                  )}>
                    {ongoingTasks.length}
                  </span>
                </div>
                <span className="text-neutral-300">•</span>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-600">Completed:</span>
                  <span className="font-semibold text-green-600">
                    {completedTasks.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Completion Celebration - Full Screen */}
        {allTasksCompleted ? (
          <div className="min-h-[60vh] flex items-center justify-center py-12">
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-4 border-green-400 rounded-3xl p-12 text-center max-w-2xl space-y-8 shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-700">
              <div className="text-9xl animate-bounce">🎉</div>
              <div>
                <h1 className="text-4xl font-bold text-green-900 mb-3">
                  All Tasks Complete!
                </h1>
                <p className="text-xl text-green-700">
                  Outstanding work! All {tasks.length} task{tasks.length === 1 ? '' : 's'} successfully delivered.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-4xl font-bold text-green-600 mb-2">{tasks.length}</div>
                  <div className="text-sm text-neutral-600 uppercase tracking-wide">Tasks</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-2 truncate">
                    {dispatchView?.orderNumber ?? trackingId}
                  </div>
                  <div className="text-sm text-neutral-600 uppercase tracking-wide">Order</div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg">
                  <div className="text-4xl mb-2">✓</div>
                  <div className="text-sm text-neutral-600 uppercase tracking-wide">Done</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="bg-white border border-neutral200 rounded-xl p-2">
              <div className="flex gap-2">
                {dispatchedTasks.length > 0 && (
                  <button
                    onClick={() => setActiveTab("review")}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all",
                      activeTab === "review"
                        ? "bg-emerald-400 text-white shadow-md"
                        : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Review</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        activeTab === "review"
                          ? "bg-emerald-600 text-white"
                          : "bg-emerald-600 text-white"
                      )}>
                        {dispatchedTasks.length}
                      </span>
                    </div>
                  </button>
                )}

                {ongoingTasks.length > 0 && (
                  <button
                    onClick={() => setActiveTab("ongoing")}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all",
                      activeTab === "ongoing"
                        ? "bg-emerald-500 text-white shadow-md"
                        : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Ongoing</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        activeTab === "ongoing"
                          ? "bg-emerald-600 text-white"
                          : "bg-blue-100 text-emerald-700"
                      )}>
                        {ongoingTasks.length}
                      </span>
                    </div>
                  </button>
                )}

                {completedTasks.length > 0 && (
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-lg font-medium text-sm transition-all",
                      activeTab === "completed"
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>Completed</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-bold",
                        activeTab === "completed"
                          ? "bg-green-600 text-white"
                          : "bg-green-100 text-green-700"
                      )}>
                        {completedTasks.length}
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>

        {/* Tasks Section - Dynamic Based on Active Tab */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">
              {activeTab === "review" && "Tasks to Review"}
              {activeTab === "ongoing" && "Ongoing Tasks"}
              {activeTab === "completed" && "Completed Tasks"}
            </h2>
            <div className="text-sm text-neutral-600">
              {currentViewTasks.length} {currentViewTasks.length === 1 ? "task" : "tasks"}
            </div>
          </div>

          {currentViewTasks.length === 0 && (
            <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-8 text-center">
              <p className="text-neutral-600">
                {activeTab === "review" && "No tasks to review at the moment."}
                {activeTab === "ongoing" && "No ongoing tasks. Start a task to see it here."}
                {activeTab === "completed" && "No completed tasks yet."}
              </p>
            </div>
          )}

          {/* Task List */}
          <div className="space-y-6">
            {currentViewTasks.map((task) => {
              const isActive = task.status === "ACTIVE";
              const isAccepted = task.status === "ACCEPTED";
              const isTerminated = task.status === "DECLINED" || task.status === "TERMINATED";
              const isCompleted = task.status === "COMPLETED";

              return (
                  <div
                    key={task.id}
                    id={`task-${task.id}`}
                    className={cn(
                      "bg-white rounded-xl transition-all duration-200 relative border",
                      // ACTIVE task - subtle blue accent, minimal
                      isActive && "border-blue-600 shadow-lg",
                      // ACCEPTED task - clean border
                      isAccepted && !allowResponse && "border-neutral-300 shadow-md",
                      // Review mode - clean border
                      allowResponse && "border-neutral-300 shadow-sm",
                      // Terminated task - red/orange accent
                      isTerminated && "border-red-300 shadow-md",
                      // Completed task - green accent
                      isCompleted && "border-green-200 shadow-sm",
                      // Default
                      !isActive && !isAccepted && !allowResponse && !isTerminated && !isCompleted && "border-neutral-200"
                    )}
                  >
                  {/* Status Badge - Top Right */}
                  <div className="absolute top-6 right-6 z-10">
                    {isActive && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600">
                        <div className="size-1.5 rounded-full bg-blue-600 animate-pulse"></div>
                        In Progress
                      </div>
                    )}
                    {isAccepted && !allowResponse && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600">
                        <Circle className="size-4" />
                        Assigned
                      </div>
                    )}
                    {allowResponse && !isTerminated && (
                      <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-500">
                        <Circle className="size-4" />
                        Not Started
                      </div>
                    )}
                    {isTerminated && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-red-600">
                        <XCircle className="size-4" />
                        Cannot Complete
                      </div>
                    )}
                    {isCompleted && !isTerminated && (
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-green-600">
                        <CheckCircle2 className="size-4" />
                        Completed
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Task Header */}
                    <div className="flex flex-col gap-3 pr-32">
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-xs font-bold uppercase tracking-wide",
                          task.taskType === "PICKUP" && "text-gray-600",
                          task.taskType === "DROPOFF" && "text-gray-600",
                          task.taskType === "IN_HUB" && "text-neutral-600"
                        )}>
                          {task.taskType}
                        </span>
                        {task.completionRequirement && task.completionRequirement !== "NONE" && (
                          <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                            <span className="size-1 rounded-full bg-red-600"></span>
                            Photo Required
                          </span>
                        )}
                      </div>
                      <p className="text-xl font-semibold text-neutral-900">
                        {task.destinationAddress}
                      </p>
                      {task.notes && (
                        <div className="bg-neutral100 border border-dashed border-neutral300 rounded-lg p-3">
                          <p className="text-xs uppercase text-neutral500 tracking-wide mb-1">
                            Note
                          </p>
                          <p className="text-sm text-neutral700 leading-relaxed">
                            {task.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Dispatch Window Information */}
                    {(task.completeAfter || task.completeBefore) && (
                      <div className="pt-4 border-t border-neutral200 space-y-3">
                        <p className="text-xs uppercase text-neutral500 tracking-wide">Dispatch Window</p>

                        <div className="grid grid-cols-2 gap-4">
                          {task.completeAfter && (
                            <div>
                              <p className="text-xs text-neutral500 mb-1">Earliest Start</p>
                              <p className="text-sm font-semibold text-neutral-900">
                                {formatDate(task.completeAfter)}
                              </p>
                              <p className="text-sm text-neutral600">
                                {formatTo12Hour(task.completeAfter)}
                              </p>
                            </div>
                          )}

                          {task.completeBefore && (
                            <div>
                              <p className="text-xs text-neutral500 mb-1">Must Complete By</p>
                              <p className="text-sm font-semibold text-neutral-900">
                                {formatDate(task.completeBefore)}
                              </p>
                              <p className="text-sm text-neutral600">
                                {formatTo12Hour(task.completeBefore)}
                              </p>
                            </div>
                          )}
                        </div>

                        {task.completeAfter && task.completeBefore && (
                          <div className="bg-emerald-50 border border-emerald-400 rounded-lg p-3">
                            <p className="text-sm font-medium text-emerald-600">
                              {(() => {
                                const startDate = new Date(task.completeAfter);
                                const endDate = new Date(task.completeBefore);

                                // Check if same day
                                const sameDay =
                                  startDate.getFullYear() === endDate.getFullYear() &&
                                  startDate.getMonth() === endDate.getMonth() &&
                                  startDate.getDate() === endDate.getDate();

                                if (sameDay) {
                                  return `Complete ${getRelativeDate(task.completeAfter)} between ${formatTo12Hour(task.completeAfter)} and ${formatTo12Hour(task.completeBefore)}`;
                                } else {
                                  return `Start ${getRelativeDate(task.completeAfter)} at ${formatTo12Hour(task.completeAfter)}, complete by ${getRelativeDate(task.completeBefore)} at ${formatTo12Hour(task.completeBefore)}`;
                                }
                              })()}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Termination Reason Display */}
                    {isTerminated && (task.terminationReason || task.declineReason) && (
                      <div className="pt-4 border-t border-neutral200">
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 space-y-3">
                          <div className="flex items-center gap-2">
                            <XCircle className="size-5 text-red-600 flex-shrink-0" />
                            <p className="text-sm font-bold text-red-900 uppercase tracking-wide">
                              Task Could Not Be Completed
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs font-semibold text-red-800 uppercase tracking-wide">
                              Reason:
                            </p>
                            <p className="text-sm text-red-800 leading-relaxed bg-white rounded-lg p-3 border border-red-200">
                              {task.terminationReason || task.declineReason}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                {/* Task Actions Based on Status */}
                {task.status === "ACCEPTED" && !allowResponse && (
                  <div className="p-4 border-t border-neutral200 space-y-4">
                    <p className="text-sm text-neutral600">Ready to start this task?</p>
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => handleStart(task)}
                        disabled={startMutation.isPending}
                        loading={startMutation.isPending && startMutation.variables === task.id}
                        size="lg"
                        className="px-6 bg-emerald-600"
                      >
                        Start Task
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => handleOpenTerminateDialog(task)}
                        disabled={terminateMutation.isPending}
                        className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 px-6"
                      >
                        <XCircle className="size-4 mr-2" />
                        Cannot Complete Task
                      </Button>
                    </div>
                  </div>
                )}

                {task.status === "ACTIVE" && (
                  <>
                    {/* ETA Window Display */}
                    <div className="p-4 border-t border-neutral-200">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold">ETA Window</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEtaDialog(task)}
                            className="h-6 px-2 text-xs"
                          >
                            Update
                          </Button>
                        </div>
                        {task.estimatedTimeWindowStart && task.estimatedTimeWindowEnd ? (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-neutral-700">{formatTo12Hour(task.estimatedTimeWindowStart)}</span>
                            <span className="text-neutral-400">→</span>
                            <span className="text-neutral-700">{formatTo12Hour(task.estimatedTimeWindowEnd)}</span>
                            <span className="text-xs text-neutral-500">• {formatDate(task.estimatedTimeWindowStart)}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-neutral-500">Not set</p>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-4 border-t border-neutral200 space-y-4 bg-green-50">
                      <div className="flex items-center gap-2 text-sm text-green-800">
                        <CheckCircle2 className="size-4 text-green-600" />
                        <span className="font-medium">Everything done at this stop?</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => handleOpenCompleteDialog(task)}
                          disabled={completeMutation.isPending}
                          size="lg"
                          className="px-6 bg-emerald-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle2 className="size-4 mr-2" />
                          Mark Complete
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => handleOpenTerminateDialog(task)}
                          disabled={terminateMutation.isPending}
                          className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 px-6"
                        >
                          <XCircle className="size-4 mr-2" />
                          Cannot Complete Task
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {task.status === "COMPLETED" && (
                  <div className="px-6 pb-6 pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-green-500"></div>
                      <p className="text-xs text-neutral-500">
                        Completed successfully
                      </p>
                    </div>
                  </div>
                )}

                {isTerminated && (
                  <div className="px-6 pb-6 pt-4 border-t border-red-200 bg-red-50">
                    <div className="flex items-center gap-2">
                      <div className="size-1.5 rounded-full bg-red-500"></div>
                      <p className="text-xs text-red-700 font-medium">
                        Task could not be completed
                      </p>
                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        </section>

        {/* Accept/Decline Section - Show Only on Review Tab */}
        {activeTab === "review" && dispatchedTasks.length > 0 && !isDeclined && (
          <section className="bg-white rounded-2xl border border-neutral200 p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-lg font-semibold">Ready to Accept?</p>
                <p className="text-sm text-neutral500">
                  Reviewed all tasks above? Accept to start working or decline with a reason
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setAcceptDialogOpen(true)}
                  disabled={acceptMutation.isPending || isAccepted || isDeclined}
                >
                  Accept Tasks
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setDeclineDialogOpen(true)}
                  disabled={declineMutation.isPending || isAccepted || isDeclined}
                >
                  Decline Dispatch
                </Button>
              </div>
            </div>
            <p className="text-sm text-neutral500">
              Full task controls unlock after acceptance.
            </p>
          </section>
        )}
          </>
        )}
      </div>

      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Dispatch Tasks</DialogTitle>
            <DialogDescription>
              Confirm you want to accept {dispatchedTasks.length} new {dispatchedTasks.length === 1 ? "task" : "tasks"}.
            </DialogDescription>
          </DialogHeader>

          {/* Task Summary */}
          <div className="space-y-3 py-4 border-t border-neutral-200">
            <p className="text-sm font-semibold text-neutral-900">Task Summary:</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600">Tasks to Accept:</span>
                <span className="font-bold text-orange-600">
                  {dispatchedTasks.length}
                </span>
              </div>
              {ongoingTasks.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Already Ongoing:</span>
                  <span className="font-medium text-blue-600">
                    {ongoingTasks.length}
                  </span>
                </div>
              )}
              {completedTasks.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-neutral-600">Already Completed:</span>
                  <span className="font-medium text-green-600">
                    {completedTasks.length}
                  </span>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setAcceptDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => acceptMutation.mutate(undefined)}
              loading={acceptMutation.isPending}
            >
              Confirm & Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={declineDialogOpen} onOpenChange={setDeclineDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline dispatch</DialogTitle>
            <DialogDescription>
              Let us know why you're declining so the order can be reassigned.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason</label>
            <Textarea
              rows={4}
              placeholder="Explain why you cannot take this dispatch"
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeclineDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDecline}
              loading={declineMutation.isPending}
            >
              Submit reason
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Task Dialog */}
      <Dialog open={!!completingTaskId} onOpenChange={(open) => {
        if (!open) {
          setCompletingTaskId(null);
          setShowInternalNotes(false);
        }
      }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>
              Add any notes and upload proof photos if required
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {completingTaskId && (() => {
              const task = tasks.find((t) => t.id === completingTaskId);
              if (!task) return null;

              return (
                <>
                  {task.completionRequirement === "PHOTO" && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-yellow-800">
                        Photo proof required
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        Upload at least one photo to complete this task
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Message (Optional)</label>
                    <Textarea
                      rows={2}
                      value={completionMessages[task.id] ?? ""}
                      onChange={(e) =>
                        setCompletionMessages((prev) => ({
                          ...prev,
                          [task.id]: e.target.value,
                        }))
                      }
                      placeholder="e.g., 'Delivered to front desk' or 'Left at side door as requested'"
                    />
                    <p className="text-xs text-neutral-500">
                      Shared with customer and operator
                    </p>
                  </div>

                  {/* Collapsible Internal Notes */}
                  <div className="border-t border-neutral-200 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowInternalNotes(!showInternalNotes)}
                      className="text-xs text-neutral-600 hover:text-neutral-800 underline"
                    >
                      {showInternalNotes ? "Hide" : "Add"} internal notes
                    </button>

                    {showInternalNotes && (
                      <div className="mt-3 space-y-2">
                        <label className="text-sm font-medium text-neutral-700">Internal Notes</label>
                        <Textarea
                          rows={2}
                          value={completionNotes[task.id] ?? ""}
                          onChange={(e) =>
                            setCompletionNotes((prev) => ({
                              ...prev,
                              [task.id]: e.target.value,
                            }))
                          }
                          placeholder="Private notes for your records only"
                        />
                        <p className="text-xs text-neutral-500">
                          Only visible to you and your team
                        </p>
                      </div>
                    )}
                  </div>

                  {task.completionRequirement === "PHOTO" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Upload Photos
                      </label>
                      <div className="border-2 border-dashed border-neutral300 rounded-lg p-6 text-center hover:border-purple500 transition-colors cursor-pointer">
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          id="photo-upload"
                          onChange={(e) => {
                            const files = e.target.files
                              ? Array.from(e.target.files)
                              : [];
                            setCompletionProofs((prev) => ({
                              ...prev,
                              [task.id]: [...(prev[task.id] ?? []), ...files],
                            }));
                          }}
                        />
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer block"
                        >
                          <div className="text-neutral600 space-y-2">
                            <p className="text-sm font-medium">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-xs text-neutral500">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        </label>
                      </div>

                      {completionProofs[task.id]?.length ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium">
                            {completionProofs[task.id]?.length} photo(s) selected
                          </p>
                          <div className="space-y-2">
                            {completionProofs[task.id]?.map((file, index) => (
                              <div
                                key={file.name + index}
                                className="flex items-center justify-between bg-neutral100 px-3 py-2 rounded-md"
                              >
                                <span className="text-sm truncate mr-2">
                                  {file.name}
                                </span>
                                <button
                                  type="button"
                                  className="text-red-500 text-sm hover:text-red-700"
                                  onClick={() =>
                                    setCompletionProofs((prev) => {
                                      const current = prev[task.id] ?? [];
                                      const nextFiles = current.filter(
                                        (_, i) => i !== index
                                      );
                                      return {
                                        ...prev,
                                        [task.id]: nextFiles,
                                      };
                                    })
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}
                </>
              );
            })()}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCompletingTaskId(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCompletion}
              loading={completeMutation.isPending}
            >
              Complete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Terminate Task Dialog */}
      <Dialog open={!!terminatingTaskId} onOpenChange={(open) => !open && setTerminatingTaskId(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Terminate Task</DialogTitle>
            <DialogDescription>
              Explain why you cannot complete this task. This will cancel the task and notify the operator.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-medium text-red-800">
                This action cannot be undone
              </p>
              <p className="text-xs text-red-700 mt-1">
                The task will be marked as DECLINED and the operator will be notified to reassign it.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Termination Reason *</label>
              <Textarea
                rows={4}
                value={terminateReason}
                onChange={(e) => setTerminateReason(e.target.value)}
                placeholder="Explain the reason (e.g., 'Vehicle breakdown', 'Incorrect address', 'Customer unavailable')"
              />
              <p className="text-xs text-neutral-500">
                Be specific to help the operator reassign this task appropriately.
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setTerminatingTaskId(null);
                setTerminateReason("");
              }}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSubmitTerminate}
              loading={terminateMutation.isPending}
              disabled={!terminateReason.trim()}
            >
              Terminate Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update ETA Window Dialog */}
      <Dialog open={etaDialogOpen} onOpenChange={handleCloseEtaDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {startingTaskId ? "How long do you think this would take?" : "Update ETA"}
            </DialogTitle>
            <DialogDescription>
              {startingTaskId
                ? "Set an estimated arrival window to get started"
                : "Adjust your estimated arrival time"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Quick Duration Presets */}
            {startingTaskId ? (
              <div>
                <p className="text-sm font-medium mb-3">I'll be there in...</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEtaWindowPreset(1, 2)}
                    className="h-11"
                  >
                    1-2 hours
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEtaWindowPreset(2, 4)}
                    className="h-11"
                  >
                    2-4 hours
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEtaWindowPreset(4, 6)}
                    className="h-11"
                  >
                    4-6 hours
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEtaWindowTomorrow()}
                    className="h-11"
                  >
                    Tomorrow
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium mb-3">Quick adjustments</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Add 30 minutes to current ETA
                      if (draftEtaStart && draftEtaEnd) {
                        const newStart = new Date(new Date(draftEtaStart).getTime() + 30 * 60 * 1000);
                        const newEnd = new Date(new Date(draftEtaEnd).getTime() + 30 * 60 * 1000);
                        setDraftEtaStart(formatToDatetimeLocal(newStart));
                        setDraftEtaEnd(formatToDatetimeLocal(newEnd));
                      }
                    }}
                    className="h-11"
                  >
                    Running Late (+30m)
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      // Subtract 15 minutes from current ETA
                      if (draftEtaStart && draftEtaEnd) {
                        const newStart = new Date(new Date(draftEtaStart).getTime() - 15 * 60 * 1000);
                        const newEnd = new Date(new Date(draftEtaEnd).getTime() - 15 * 60 * 1000);
                        setDraftEtaStart(formatToDatetimeLocal(newStart));
                        setDraftEtaEnd(formatToDatetimeLocal(newEnd));
                      }
                    }}
                    className="h-11"
                  >
                    Ahead of Schedule (-15m)
                  </Button>
                </div>
              </div>
            )}

            {/* Custom Time Inputs */}
            <div className="pt-3 border-t border-neutral-200">
              <p className="text-xs text-neutral-500 mb-3">Or set a custom window:</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">From</label>
                  <Input
                    type="datetime-local"
                    value={draftEtaStart}
                    onChange={(e) => setDraftEtaStart(e.target.value)}
                    className="text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-neutral-600 uppercase tracking-wide">To</label>
                  <Input
                    type="datetime-local"
                    value={draftEtaEnd}
                    onChange={(e) => setDraftEtaEnd(e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button
              variant="outline"
              onClick={handleCloseEtaDialog}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEta}
              loading={etaWindowMutation.isPending || startMutation.isPending}
              disabled={!draftEtaStart || !draftEtaEnd}
              className="flex-1"
            >
              {startingTaskId ? "Start Task" : "Update ETA"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PublicDispatchPage;
