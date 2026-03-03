import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatchPreview } from "@/queries/tasks/useTasks";
import {
  DispatchPreviewData,
  DispatchResponse,
  dispatchBooking,
} from "@/services/tasks";
import { Spinner } from "@/components/Spinner";
import { formatStatus, getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { RefreshCw } from "lucide-react";

interface DispatchPreviewDialogProps {
  bookingId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDispatched: () => void;
}

const DispatchPreviewDialog = ({
  bookingId,
  open,
  onOpenChange,
  onDispatched,
}: DispatchPreviewDialogProps) => {
  const [dispatchSummary, setDispatchSummary] = useState<
    DispatchResponse["summary"] | null
  >(null);

  const { data, isPending: isLoadingPreview, isError, refetch } = useDispatchPreview(
    bookingId,
    { enabled: open }
  );

  // Handle both wrapped and unwrapped API responses
  const preview: DispatchPreviewData | undefined =
    data?.data ?? (data as DispatchPreviewData | undefined);

  const { mutate, isPending: isDispatching } = useMutation({
    mutationFn: () => dispatchBooking(bookingId),
    onSuccess: (response) => {
      toast.success(response?.message ?? "Dispatch completed");
      setDispatchSummary(response?.summary ?? null);
      onDispatched();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Unable to dispatch booking"));
    },
  });

  const hasBlockingErrors =
    (preview?.validationErrors?.length ?? 0) > 0 || (preview?.draftTasksReady ?? 0) === 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-brand">Review & Dispatch</DialogTitle>
          <DialogDescription>
            {dispatchSummary
              ? "Dispatch completed successfully. Copy links below to share with partners."
              : "Review all tasks and assignments before sending to dispatch partners."}
          </DialogDescription>
        </DialogHeader>

        {isLoadingPreview && (
          <div className="py-10 flex justify-center">
            <Spinner />
          </div>
        )}

        {isError && (
          <div className="py-6 text-center text-sm text-red-500">
            Unable to load preview. Please retry.
          </div>
        )}

        {!isLoadingPreview && !isError && preview && (
          <div className="space-y-6">
            {/* Single Column Summary List */}
            <div className="border-2 border-neutral-300 rounded-xl p-5 bg-white shadow-sm space-y-0 divide-y divide-neutral-200">
              {/* Order Number - With Color */}
              <div className="flex items-center justify-between py-3 first:pt-0">
                <span className="text-sm font-semibold text-brand">Order Number</span>
                <span className="text-sm font-bold text-gray800 tracking-wide">
                  {preview.orderNumber || "—"}
                </span>
              </div>

              {/* Companies Affected */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-brand">Companies affected</span>
                <span className="text-lg font-semibold text-neutral-900">
                  {preview.companiesAffected}
                </span>
              </div>

              {/* Draft Tasks Ready */}
              <div className="flex items-center justify-between py-3">
                <span className="text-sm font-medium text-brand">Draft tasks ready</span>
                <span className="text-lg font-semibold text-neutral-900">
                  {preview.draftTasksReady}
                </span>
              </div>

              {/* Warnings */}
              <div className="flex items-center justify-between py-3 last:pb-0">
                <span className="text-sm font-medium text-brand">Warnings</span>
                <span className="text-lg font-semibold text-neutral-900">
                  {preview.warnings?.length ?? 0}
                </span>
              </div>
            </div>

            {preview.validationErrors.length > 0 && (
              <div className="border border-red-200 bg-red-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-600 mb-2">
                  Validation Errors
                </p>
                <ul className="list-disc pl-5 text-sm text-red-700 space-y-1">
                  {preview.validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {preview.warnings.length > 0 && (
              <div className="border border-yellow-200 bg-yellow-50 rounded-xl p-4">
                <p className="text-sm font-semibold text-yellow-800 mb-2">
                  Warnings
                </p>
                <ul className="list-disc pl-5 text-sm text-yellow-900 space-y-1">
                  {preview.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              {Object.values(preview.companyDetails || {}).map((company) => (
                <CompanyPreviewCard key={company.companyId} company={company} />
              ))}

              {(!preview.companyDetails ||
                Object.keys(preview.companyDetails).length === 0) && (
                <p className="text-sm text-neutral600">
                  No companies have draft tasks yet. Assign tasks before dispatching.
                </p>
              )}
            </div>
          </div>
        )}

        {dispatchSummary && (
          <div className="mt-6 border-2 border-green-200 bg-green-50 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="size-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div>
                <p className="text-base font-semibold text-green-900">
                  Dispatch Completed
                </p>
                <p className="text-sm text-green-700">
                  {dispatchSummary.companiesNotified} {dispatchSummary.companiesNotified === 1 ? "partner" : "partners"} notified • {dispatchSummary.totalTasksDispatched} {dispatchSummary.totalTasksDispatched === 1 ? "task" : "tasks"} dispatched
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-neutral800">
                  Dispatch Links
                </p>
                <p className="text-xs text-neutral500">
                  Share these with your dispatch partners
                </p>
              </div>
              <div className="space-y-2">
                {Object.entries(dispatchSummary.dispatchTokens || {}).map(
                  ([companyId, token]) => {
                    const dispatchLink = `${typeof window !== "undefined" ? window.location.origin : ""}/dispatch/${preview?.orderNumber || ""}/${token}`;
                    return (
                      <div
                        key={companyId}
                        className="flex items-center gap-2 p-3 bg-neutral50 rounded-lg border border-neutral200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral800 truncate">
                            {preview?.companyDetails?.[companyId]?.companyName || companyId}
                          </p>
                          <p className="text-xs text-neutral500 truncate">
                            {dispatchLink}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="shrink-0"
                          onClick={() => {
                            if (typeof navigator !== "undefined" && navigator?.clipboard?.writeText) {
                              navigator.clipboard
                                .writeText(dispatchLink)
                                .then(() => toast.success("Link copied to clipboard"))
                                .catch(() => toast.error("Failed to copy link"));
                            }
                          }}
                        >
                          Copy Link
                        </Button>
                      </div>
                    );
                  }
                )}
                {Object.keys(dispatchSummary.dispatchTokens || {}).length === 0 && (
                  <p className="text-sm text-neutral500 text-center py-4">
                    No dispatch tokens generated
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:justify-between gap-3 pt-4 border-t border-neutral200">
          {dispatchSummary ? (
            <Button
              variant="outline"
              onClick={() => {
                setDispatchSummary(null);
                onOpenChange(false);
              }}
              className="w-full md:w-auto"
            >
              Close
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="border-neutral300 text-brand"
                onClick={() => refetch()}
                disabled={isLoadingPreview || isDispatching}
              >
                <RefreshCw className="size-4" />
                Refresh Preview
              </Button>
              <Button
                onClick={() => mutate()}
                disabled={hasBlockingErrors || isLoadingPreview || isDispatching || !preview}
                loading={isDispatching}
                size="lg"
                className="md:min-w-[160px] bg-brand text-white"
              >
                {hasBlockingErrors
                  ? "Cannot Dispatch"
                  : `Dispatch to ${preview?.companiesAffected || 0} ${preview?.companiesAffected === 1 ? "Partner" : "Partners"}`}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const CompanyPreviewCard = ({
  company,
}: {
  company: DispatchPreviewData["companyDetails"][string];
}) => {
  const tasks = company.tasks ?? [];

  return (
    <div className="border border-neutral200 rounded-2xl p-4 space-y-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-base font-semibold">{company.companyName}</p>
          <p className="text-sm text-neutral500">{company.email}</p>
        </div>
        <div className="text-sm text-neutral600">
          <span className="px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
            {company.taskCount} {company.taskCount === 1 ? "Task" : "Tasks"}
          </span>
        </div>
      </div>

      <div className="border border-dashed border-neutral200 rounded-xl p-3 space-y-2 bg-neutral50">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-sm"
          >
            <div className="font-medium">
              {task.taskType} • {task.destinationAddress}
            </div>
            <div className="flex gap-2 text-xs">
              <span className="px-2 py-1 rounded-full bg-neutral200 text-neutral700">
                {formatStatus(task.status)}
              </span>
              <span className="px-2 py-1 rounded-full bg-neutral200 text-neutral700">
                {task.completionRequirement
                  ? formatStatus(task.completionRequirement)
                  : "No requirement"}
              </span>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <p className="text-sm text-neutral500">No tasks available.</p>
        )}
      </div>
    </div>
  );
};

export default DispatchPreviewDialog;
