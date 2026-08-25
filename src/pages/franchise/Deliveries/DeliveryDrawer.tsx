import {
  X,
  Circle,
  Truck,
  CheckCircle2,
  Package,
  User,
  Phone,
  FileText,
  LockKeyhole,
} from "lucide-react";
import { useEffect, useState } from "react";
import { formatDateTime } from "@/utils/date";
import {
  DeliveryType,
  DeliveryTask,
  TaskType,
  TaskStatus,
} from "@/schema/franchise/delivery/type";
import {
  OneTimePasswordField,
  OneTimePasswordFieldInput,
} from "@radix-ui/react-one-time-password-field";


type DeliveryDrawerProps = {
  delivery: DeliveryType | null;
  open: boolean;
  onClose: () => void;
  onAcceptTask?: (task: DeliveryTask) => void;
  onDeclineTask?: (task: DeliveryTask) => void;
  onStartTask?: (task: DeliveryTask) => void;
  onCompleteTask?: (task: DeliveryTask, proofPhotos: File[], otpCode: string) => void;
  taskActionPendingId?: string | null;
};


const buildWindowSummary = (after: string, before: string) => {
  const start = formatDateTime(after);
  const end = formatDateTime(before);

  if (start.dateString === end.dateString) {
    return `Complete ${start.month} ${start.day} between ${start.time} and ${end.time}`;
  }
  return `Start ${start.month} ${start.day} at ${start.time}, complete by ${end.month} ${end.day} at ${end.time}`;
};

// Mask phone: 0801 234 5678 to 0801****234
const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return phone;
  return `${digits.slice(0, 4)}****${digits.slice(-3)}`;
};

// Abbreviate name: "Chukwuemeka Obi" to "Chukwuemeka O."
const abbreviateName = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return name;
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
};

const taskTypeStyles: Record<
  TaskType,
  { label: string; color: string; bg: string; numberBg: string }
> = {
  PICKUP: {
    label: "PICKUP",
    color: "text-gray-500",
    bg: "bg-blue-50",
    numberBg: "bg-blue-100 text-blue-600",
  },
  IN_HUB: {
    label: "IN HUB",
    color: "text-gray-500",
    bg: "bg-amber-50",
    numberBg: "bg-amber-100 text-amber-600",
  },
  DROPOFF: {
    label: "DROPOFF",
    color: "text-gray-500",
    bg: "bg-violet-50",
    numberBg: "bg-violet-100 text-violet-600",
  },
};

const getDropoffLockReason = (
  task: DeliveryTask,
  tasks: DeliveryTask[],
): string | null => {
  if (task.taskType !== "DROPOFF" || ["COMPLETED", "CANCELLED"].includes(task.status)) {
    return null;
  }

  const declaredPrerequisites = task.dependsOn.length
    ? tasks.filter(
        (candidate) =>
          task.dependsOn.includes(candidate.id) && candidate.taskType !== "DROPOFF",
      )
    : [];
  const fallbackPrerequisites = tasks.filter(
    (candidate) => candidate.id !== task.id && candidate.taskType !== "DROPOFF",
  );
  const prerequisites = declaredPrerequisites.length
    ? declaredPrerequisites
    : fallbackPrerequisites;

  if (
    prerequisites.length === 0 ||
    prerequisites.every((candidate) => candidate.status === "COMPLETED")
  ) {
    return null;
  }

  const pendingTypes = new Set(
    prerequisites
      .filter((candidate) => candidate.status !== "COMPLETED")
      .map((candidate) => candidate.taskType),
  );

  if (pendingTypes.has("PICKUP") && pendingTypes.has("IN_HUB")) {
    return "Complete pickup and hub tasks first to unlock dropoff.";
  }
  if (pendingTypes.has("IN_HUB")) {
    return "Complete the hub task first to unlock dropoff.";
  }
  return "Complete the pickup task first to unlock dropoff.";
};

const taskStatusConfig: Record<
  TaskStatus,
  { label: string; icon: React.ReactNode }
> = {
  PENDING_DISPATCH: {
    label: "Waiting",
    icon: <Circle size={14} className="text-gray-300" />,
  },
  DRAFT: {
    label: "To Review",
    icon: <Circle size={14} className="text-amber-400" />,
  },
  DISPATCHED: {
    label: "Accepted",
    icon: <Truck size={14} className="text-blue-400" />,
  },
  STARTED: {
    label: "In Progress",
    icon: <Truck size={14} className="text-gray-400" />,
  },
  COMPLETED: {
    label: "Completed",
    icon: <CheckCircle2 size={14} className="text-emerald-500" />,
  },
  CANCELLED: {
    label: "Cancelled",
    icon: <X size={14} className="text-red-400" />,
  },
};

const EarningsCard = ({ delivery }: { delivery: DeliveryType }) => (
  <div
    className="flex items-center justify-between rounded-2xl px-5 py-4"
    style={{ background: "linear-gradient(90deg, #ECFDF5 0%, #FFFFFF 100%)" }}
  >
    <div>
      <p className="text-xs text-emerald-600 font-medium">
        You earn for this delivery
      </p>
      <p className="text-xl font-black text-emerald-700 mt-0.5">
        {delivery.earnings}
      </p>
    </div>

    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
      <FileText size={18} className="text-emerald-500" />
    </div>
  </div>
);

const specialHandlingLabels = (d: DeliveryType): string[] => {
  const flags: string[] = [];
  if (d.isFragile) flags.push("Fragile");
  if (d.isPerishable) flags.push("Perishable");
  if (d.isExclusive) flags.push("High Value");
  if (d.isHazardous) flags.push("Hazardous");
  return flags;
};

const PackageDetails = ({ delivery }: { delivery: DeliveryType }) => {
  const handlingFlags = specialHandlingLabels(delivery);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Package size={15} className="text-emerald-400" />
        <h3 className="text-sm font-bold text-gray-800">Package Details</h3>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
            Type
          </p>
          <p className="text-sm font-semibold text-gray-800">
            {delivery.package}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
            Weight
          </p>
          <p className="text-sm font-semibold text-gray-800">{delivery.weight}</p>
        </div>
        {delivery.itemValue != null && delivery.itemValue > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
              Item Value
            </p>
            <p className="text-sm font-semibold text-gray-800">
              ₦{delivery.itemValue.toLocaleString()}
            </p>
          </div>
        )}
        {handlingFlags.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
              Handling
            </p>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {handlingFlags.map((flag) => (
                <span
                  key={flag}
                  className="inline-block rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-semibold text-amber-700"
                >
                  {flag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {delivery.deliveryInstructions && (
        <div>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Delivery Instructions
          </p>
          <p className="text-sm text-gray-600">{delivery.deliveryInstructions}</p>
        </div>
      )}
    </div>
  );
};

const CustomerSection = ({ delivery }: { delivery: DeliveryType }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-1">
    <div className="flex items-center gap-2 mb-2">
      <User size={15} className="text-violet-400" />
      <h3 className="text-sm font-bold text-gray-800">Customer</h3>
    </div>

    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-bold text-gray-800">
          {abbreviateName(delivery.customerName)}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {maskPhone(delivery.customerPhone)}
        </p>
      </div>

      <a
        href={`tel:${delivery.customerPhone.replace(/\s/g, "")}`}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Phone size={13} className="text-gray-500" />
        Call
      </a>
    </div>
  </div>
);

const TaskCard = ({
  task,
  actionsEnabled,
  onAcceptTask,
  onDeclineTask,
  onStartTask,
  onCompleteTask,
  pending,
  lockedReason,
}: {
  task: DeliveryTask;
  actionsEnabled: boolean;
  onAcceptTask?: (task: DeliveryTask) => void;
  onDeclineTask?: (task: DeliveryTask) => void;
  onStartTask?: (task: DeliveryTask) => void;
  onCompleteTask?: (task: DeliveryTask, proofPhotos: File[], otpCode: string) => void;
  pending?: boolean;
  lockedReason?: string | null;
}) => {
  const [proofPhotos, setProofPhotos] = useState<File[]>([]);
  const [otpCode, setOtpCode] = useState("");
  const typeStyle = taskTypeStyles[task.taskType];
  const status = taskStatusConfig[task.status];
  const hasWindow = Boolean(task.completeAfter || task.completeBefore);
  const afterDt = formatDateTime(task.completeAfter ?? "");
  const beforeDt = formatDateTime(task.completeBefore ?? "");
  const summary = hasWindow ? buildWindowSummary(task.completeAfter ?? "", task.completeBefore ?? "") : null;
  const needsPhoto = task.completionRequirement === "PHOTO";
  const needsSig = task.completionRequirement === "SIGNATURE";
  const needsOtp = task.taskType === "PICKUP" || task.taskType === "DROPOFF";
  const isLocked = Boolean(lockedReason);

  return (
    <div
      className={`rounded-2xl border p-5 flex flex-col gap-4 transition-colors ${
        isLocked
          ? "bg-gray-50 border-amber-200 shadow-inner"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs font-bold tracking-widest ${typeStyle.color}`}
          >
            {typeStyle.label}
          </span>
          {(needsPhoto || needsSig) && (
            <span className="flex items-center gap-1 text-[11px] text-red-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
              {needsPhoto ? "Photo Required" : "Signature Required"}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 shrink-0">
          {isLocked ? <LockKeyhole size={14} className="text-amber-500" /> : status.icon}
          <span>{status.label}</span>
        </div>
      </div>

      {lockedReason && (
        <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <LockKeyhole size={15} className="text-amber-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-bold text-amber-800">Dropoff locked</p>
            <p className="text-xs text-amber-700 mt-0.5">{lockedReason}</p>
          </div>
        </div>
      )}

      {/* Address */}
      <p className={`text-base font-bold leading-snug ${isLocked ? "text-gray-500" : "text-gray-900"}`}>
        {task.destinationAddress}
      </p>

      {/* Notes */}
      {task.notes && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Note
          </p>
          <p className="text-sm text-gray-500">{task.notes}</p>
        </div>
      )}

      {/* Dispatch window */}
      {hasWindow && (
        <div className="flex flex-col gap-3">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            Dispatch Window
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[11px] text-gray-400 mb-0.5">Earliest Start</p>
              <p className="text-sm font-bold text-gray-800">{afterDt.date}</p>
              <p className="text-xs text-gray-500">{afterDt.time}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 mb-0.5">Must Complete By</p>
              <p className="text-sm font-bold text-gray-800">{beforeDt.date}</p>
              <p className="text-xs text-gray-500">{beforeDt.time}</p>
            </div>
          </div>

          {summary && (
            <div className="bg-emerald-50 border border-violet-100 rounded-xl px-4 py-2.5">
              <p className="text-xs text-emerald-700 font-medium">{summary}</p>
            </div>
          )}
        </div>
      )}

      {task.status === "PENDING_DISPATCH" && (
        <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
          <Circle size={14} className="text-gray-400 shrink-0" />
          <p className="text-sm font-semibold text-gray-500">
            Waiting to be dispatched
          </p>
        </div>
      )}

      {task.status === "DRAFT" && (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={pending || isLocked}
            onClick={() => onAcceptTask?.(task)}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {isLocked ? "Locked" : pending ? "Working..." : `Accept ${typeStyle.label.toLowerCase()}`}
          </button>
          <button
            type="button"
            disabled={pending || isLocked}
            onClick={() => onDeclineTask?.(task)}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-red-600 border border-red-500 bg-white hover:bg-red-50 transition-colors disabled:opacity-60"
          >
            Decline
          </button>
        </div>
      )}

      {actionsEnabled && task.status === "DISPATCHED" && (
        <button
          type="button"
          disabled={pending || isLocked}
          onClick={() => onStartTask?.(task)}
          className="w-full py-2.5 rounded-xl text-sm font-bold text-emerald-700 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 transition-colors disabled:opacity-60"
        >
          {isLocked ? "Locked" : pending ? "Starting..." : `Start ${typeStyle.label.toLowerCase()}`}
        </button>
      )}

      {actionsEnabled && task.status === "STARTED" && !isLocked && (
        <div className="flex flex-col gap-3">
          {needsPhoto && (
            <label className="flex flex-col gap-2 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
              <span className="text-xs font-semibold text-gray-500">
                Upload proof photo
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(event) =>
                  setProofPhotos(Array.from(event.target.files ?? []))
                }
                className="text-xs text-gray-500"
              />
            </label>
          )}
          {needsOtp && (
            <label className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3">
              <span className="text-xs font-semibold text-gray-500">
                Confirmation OTP
              </span>
              <OneTimePasswordField
                value={otpCode}
                onValueChange={(value) => setOtpCode(value.slice(0, 4))}
                validationType="numeric"
                autoComplete="one-time-code"
                className="flex items-center gap-2"
                aria-label="Confirmation OTP"
              >
                {Array.from({ length: 4 }).map((_, index) => (
                  <OneTimePasswordFieldInput
                    key={index}
                    index={index}
                    className="h-11 w-11 rounded-lg border border-gray-200 bg-white text-center text-base font-bold text-gray-900 outline-none transition-colors focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:opacity-60"
                  />
                ))}
              </OneTimePasswordField>
              <span className="text-[11px] text-gray-400">
                Ask the sender for pickup or the receiver for drop-off.
              </span>
            </label>
          )}
          <button
            type="button"
            disabled={pending || (needsPhoto && proofPhotos.length === 0) || (needsOtp && otpCode.length !== 4)}
            onClick={() => onCompleteTask?.(task, proofPhotos, otpCode)}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            {pending ? "Completing..." : `Complete ${typeStyle.label.toLowerCase()}`}
          </button>
        </div>
      )}
    </div>
  );
};

const DeliveryDrawer = ({
  delivery,
  open,
  onClose,
  onAcceptTask,
  onDeclineTask,
  onStartTask,
  onCompleteTask,
  taskActionPendingId,
}: DeliveryDrawerProps) => {
  const tasks = delivery?.tasks ?? [];
  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const ongoing = tasks.filter(
    (t) => t.status === "STARTED" || t.status === "DISPATCHED",
  ).length;
  const toReview = tasks.filter((t) => t.status === "DRAFT").length;

  const isPending = delivery?.status === "Pending";
  const taskActionsEnabled =
    !!delivery &&
    !["Pending", "Declined", "Delivered"].includes(delivery.status);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Backdrop for drawer */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-lg bg-gray-50 z-50 shadow-2xl flex flex-col
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Header ── */}
        <div className="bg-white border-b border-gray-100 px-5 pt-5 pb-4 flex flex-col gap-4 shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                Tracking ID
              </p>
              <p className="text-md lg:2xl font-black text-gray-900 tracking-tight">
                {delivery?.id ?? "—"}
              </p>

              <div className="grid grid-cols-3 gap-x-2 gap-y-2">
                <div className="grid-col-2">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Company
                  </p>
                  <p className="text-sm font-semibold text-gray-700 mt-0.5">
                    {tasks[0]?.companyName ?? "GoSendeet"}
                  </p>
                </div>
                {/* <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Order
                  </p>
                  <p className="text-xs font-medium text-gray-500 mt-0.5 truncate">
                    {tasks[0]?.bookingId ?? "—"}
                  </p>
                </div> */}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2 shrink-0">
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
              <div className="text-right">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                  Aggregated Status
                </p>
                <p className="text-base font-black text-gray-900 mt-0.5">
                  {delivery?.status ?? "—"}
                </p>
                <p className="text-xs text-gray-400">
                  {completed}/{totalTasks} tasks completed
                </p>
              </div>
            </div>
          </div>

          {/* Review banner */}
          {toReview > 0 && (
            <div className="mx-auto">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  To Review:{" "}
                  <strong className="text-gray-700">{toReview}</strong>
                </span>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1">
                  Ongoing: <strong className="text-gray-700">{ongoing}</strong>
                </span>
                <span className="text-gray-300">·</span>
                <span className="flex items-center gap-1">
                  Completed:{" "}
                  <strong className="text-emerald-500">{completed}</strong>
                </span>
              </div>
            </div>
          )}

          {/* Review CTA */}
          {isPending && toReview > 0 && (
            <button className="hidden lg:flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-sm font-bold transition-colors ">
              Review
              <span className="bg-white/30 text-emerald-600 text-xs font-bold px-2 py-0.5 rounded-full">
                {toReview}
              </span>
            </button>
          )}
        </div>

        {/* ── Scrollable task list ── */}
        <div
          className={`flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 ${!isPending ? "mb-14 sm:mb-0" : ""}`}
        >
          {/* Earnings */}
          {delivery && <EarningsCard delivery={delivery} />}

          {/* Package Details */}
          {delivery && <PackageDetails delivery={delivery} />}
          {/* Customer */}
          {delivery && <CustomerSection delivery={delivery} />}

          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-gray-800">Tasks</h3>
            {tasks.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-300 text-sm">
                No tasks found
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-[11px] text-gray-400 text-center">
                  Review each assigned task, then accept or decline it individually.
                </p>
                {tasks.map((task) => {
                  const lockedReason = getDropoffLockReason(task, tasks);

                  return (
                    <TaskCard
                      key={task.id}
                      task={task}
                      actionsEnabled={taskActionsEnabled}
                      onAcceptTask={onAcceptTask}
                      onDeclineTask={onDeclineTask}
                      onStartTask={onStartTask}
                      onCompleteTask={onCompleteTask}
                      pending={taskActionPendingId === task.id}
                      lockedReason={lockedReason}
                    />
                  );
                })}
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
};

export default DeliveryDrawer;
