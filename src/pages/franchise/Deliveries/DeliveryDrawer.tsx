import {
  X,
  Circle,
  Truck,
  CheckCircle2,
  Package,
  User,
  Phone,
  FileText,
} from "lucide-react";
import { useEffect } from "react";
import { formatDateTime } from "@/utils/date";
import {
  DeliveryType,
  DeliveryTask,
  TaskType,
  TaskStatus,
  CompletionRequirement,
} from "@/schema/franchise/delivery/type";

type DeliveryDrawerProps = {
  delivery: DeliveryType | null;
  open: boolean;
  onClose: () => void;
  onAccept?: (delivery: DeliveryType) => void;
  onDecline?: (delivery: DeliveryType) => void;
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

const getTaskRequirementLabel = (
  req: CompletionRequirement,
  type: TaskType,
): string => {
  if (req === "PHOTO")
    return type === "PICKUP"
      ? "Photo required at pickup"
      : "Proof photo/signature required";
  if (req === "SIGNATURE") return "Signature required";
  return type === "PICKUP" ? "Standard pickup" : "Standard delivery";
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
  DROPOFF: {
    label: "DROPOFF",
    color: "text-gray-500",
    bg: "bg-violet-50",
    numberBg: "bg-violet-100 text-violet-600",
  },
};

const taskStatusConfig: Record<
  TaskStatus,
  { label: string; icon: React.ReactNode }
> = {
  DRAFT: {
    label: "Not Started",
    icon: <Circle size={14} className="text-gray-300" />,
  },
  DISPATCHED: {
    label: "Dispatched",
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

const PackageDetails = ({ delivery }: { delivery: DeliveryType }) => (
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
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
          Dimensions
        </p>
        <p className="text-sm font-semibold text-gray-800">
          {delivery.package === "Document" ? "A4 Envelope" : "Standard Box"}
        </p>
      </div>
    </div>

    {/* Notes from first task */}
    {delivery.tasks?.[0]?.notes && (
      <div>
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
          Notes
        </p>
        <p className="text-sm text-gray-600">{delivery.tasks[0].notes}</p>
      </div>
    )}
  </div>
);

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

const TasksSummary = ({ tasks }: { tasks: DeliveryTask[] }) => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-3">
    <h3 className="text-sm font-bold text-gray-800">Tasks</h3>

    <div className="flex flex-col gap-2">
      {tasks.map((task, i) => {
        const cfg = taskTypeStyles[task.taskType];
        const status = taskStatusConfig[task.status];
        const reqLabel = getTaskRequirementLabel(
          task.completionRequirement,
          task.taskType,
        );

        return (
          <div
            key={task.id}
            className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100"
          >
            {/* Number badge */}
            <span
              className={`w-6 h-6 text-white rounded-full text-xs font-bold flex items-center justify-center shrink-0 bg-gray-300`}
            >
              {i + 1}
            </span>

            {/* Label + description */}
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold tracking-widest ${cfg.color}`}>
                {cfg.label}
              </p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">
                {reqLabel}
              </p>
            </div>

            {/* Status */}
            <div className="flex items-center gap-1 shrink-0">
              {status.icon}
              <span className="text-xs text-gray-400 hidden sm:inline">
                {status.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

const TaskCard = ({ task }: { task: DeliveryTask }) => {
  const typeStyle = taskTypeStyles[task.taskType];
  const afterDt = formatDateTime(task.completeAfter);
  const beforeDt = formatDateTime(task.completeBefore);
  const summary = buildWindowSummary(task.completeAfter, task.completeBefore);
  const needsPhoto = task.completionRequirement === "PHOTO";
  const needsSig = task.completionRequirement === "SIGNATURE";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex flex-col gap-4">
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
          <Circle size={14} className="text-gray-300" />
          <span>Not Started</span>
        </div>
      </div>

      {/* Address */}
      <p className="text-base font-bold text-gray-900 leading-snug">
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

        {/* Summary pill */}
        <div className="bg-emerald-50 border border-violet-100 rounded-xl px-4 py-2.5">
          <p className="text-xs text-emerald-700 font-medium">{summary}</p>
        </div>
      </div>
    </div>
  );
};

const DeliveryDrawer = ({
  delivery,
  open,
  onClose,
  onAccept,
  onDecline,
}: DeliveryDrawerProps) => {
  const tasks = delivery?.tasks ?? [];
  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === "COMPLETED").length;
  const ongoing = tasks.filter(
    (t) => t.status === "STARTED" || t.status === "DISPATCHED",
  ).length;
  const toReview = tasks.filter((t) => t.status === "DRAFT").length;

  const isPending = delivery?.status === "Pending";

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

          {tasks.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-gray-300 text-sm">
              No tasks found
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))
          )}
          {/* Package Details */}
          {delivery && <PackageDetails delivery={delivery} />}
          {/* Customer */}
          {delivery && <CustomerSection delivery={delivery} />}
          {/* Tasks summary strip */}
          {tasks.length > 0 && <TasksSummary tasks={tasks} />}
        </div>

        {/* ── Footer CTA for Pending only ── */}
        {isPending && (
          <div className="bg-white border-t border-gray-100 px-5 py-5 shrink-0 mb-14 md:mb-0">
            <div className="mb-3">
              <p className="text-sm font-bold text-gray-800">
                Ready to Accept?
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Reviewed all tasks above? Accept to start working or decline
                with a reason
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => delivery && onAccept?.(delivery)}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors"
              >
                Accept Tasks
              </button>
              <button
                onClick={() => delivery && onDecline?.(delivery)}
                className="flex-1 py-3 rounded-xl bg-white hover:bg-red-600 text-red-600 border border-red-600 text-sm font-bold transition-colors"
              >
                Decline Dispatch
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-3">
              Full task controls unlock after acceptance.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DeliveryDrawer;
