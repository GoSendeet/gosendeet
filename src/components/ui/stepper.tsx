import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export const Stepper = ({ steps, currentStep, className }: StepperProps) => {
  const currentLabel = steps[currentStep - 1]?.label;

  return (
    <div className={cn("w-full", className)}>
      <div className="rounded-xl border border-[#EAECF0] bg-white px-4 py-3 sm:hidden">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#667085]">
          Step {currentStep} of {steps.length}
        </p>
        <p className="mt-1 font-semibold text-[#111827]">{currentLabel}</p>
      </div>

      <div className="hidden w-full overflow-x-auto pb-2 sm:block">
        <div className="mx-auto flex min-w-[560px] max-w-4xl items-start">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={step.label} className="flex min-w-0 flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                <div className="h-px flex-1">
                  {index > 0 && (
                    <div
                      className={cn(
                        "h-full border-t-2",
                        isCompleted || isCurrent ? "border-green500" : "border-dashed border-[#D0D5DD]"
                      )}
                    />
                  )}
                </div>

                  <div
                    className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                    isCompleted && "border-green500 bg-green500 text-white",
                    isCurrent && "border-green100 bg-green100 text-white shadow-sm",
                    isUpcoming && "border-[#D0D5DD] bg-white text-[#667085]"
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <span className="text-xs font-semibold">{stepNumber}</span>
                    )}
                  </div>

                <div className="h-px flex-1">
                  {index < steps.length - 1 && (
                    <div
                      className={cn(
                        "h-full border-t-2",
                        isCompleted ? "border-green500" : "border-dashed border-[#D0D5DD]"
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="mt-3 w-full px-2 text-center">
                <p
                  className={cn(
                    "truncate text-sm font-semibold transition-colors",
                    (isCompleted || isCurrent) && "text-[#006B4F]",
                    isUpcoming && "text-[#667085]"
                  )}
                  title={step.label}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-1 truncate text-xs text-[#667085]">{step.description}</p>
                )}
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};
