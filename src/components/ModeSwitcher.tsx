import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { IconType } from "react-icons";
import { GoArrowSwitch } from "react-icons/go";
import { SlLocationPin } from "react-icons/sl";

export type FormMode = "gosendeet" | "compare" | "tracking";

export interface ModeTab {
  key: FormMode;
  label: string;
  icon: IconType;
}

interface ModeSwitcherProps {
  mode: FormMode;
  onModeChange: (mode: FormMode) => void;
  variant?: "card" | "pill" | "underline";
  className?: string;
  showLabels?: boolean;
  animate?: boolean;
}

const DEFAULT_TABS: ModeTab[] = [
  { key: "gosendeet", label: "Send Direct", icon: Rocket },
  { key: "compare", label: "Compare", icon: GoArrowSwitch },
  { key: "tracking", label: "Tracking", icon: SlLocationPin },
];

export const ModeSwitcher = ({
  mode,
  onModeChange,
  variant = "card",
  className,
  showLabels = true,
  animate = true,
}: ModeSwitcherProps) => {
  const tabs = DEFAULT_TABS;

  const containerClasses = cn(
    "flex justify-center items-center gap-0",
    className
  );

  if (variant === "pill") {
    return (
      <div className={containerClasses}>
        <div className="inline-flex items-center lg:w-[400px] px-1 py-2 lg:py-1 bg-white rounded-full shadow-sm" style={{ boxShadow: "0px 8px 30px 0px #0000000F", border: "1px solid #E2E8F0" }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = mode === tab.key;

            const Wrapper = animate ? motion.button : "button";
            const wrapperProps = animate
              ? { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }
              : {};

            return (
              <Wrapper
                key={tab.key}
                type="button"
                onClick={() => onModeChange(tab.key)}
                className={cn(
                  "md:px-6 px-4 py-3.5 lg:py-3.5 text-xs font-semibold rounded-full flex items-center gap-2 transition-all",
                  isActive
                    ? "bg-green900 text-white shadow-[0px_10px_15px_-3px_#00996640]"
                    : "text-[#62748E] hover:text-gray-800"
                )}
                {...wrapperProps}
              >
                <Icon className="w-4 h-4" />
                {showLabels && tab.label}
              </Wrapper>
            );
          })}
        </div>
      </div>
    );
  }

  if (variant === "underline") {
    return (
      <div className={containerClasses}>
        <div className="flex border-b border-gray-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = mode === tab.key;

            const Wrapper = animate ? motion.button : "button";
            const wrapperProps = animate
              ? { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 } }
              : {};

            return (
              <Wrapper
                key={tab.key}
                type="button"
                onClick={() => onModeChange(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 font-semibold transition-all relative",
                  isActive ? "text-[#064E3B]" : "text-gray-600 hover:text-gray-800"
                )}
                {...wrapperProps}
              >
                <Icon className="w-5 h-5" />
                {showLabels && <span className="text-sm">{tab.label}</span>}
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-1 bg-[#064E3B] rounded-t"
                    layoutId="underline"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </Wrapper>
            );
          })}
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className={containerClasses}>
      <div className="inline-flex bg-white rounded-t-2xl shadow-lg border border-gray-200 overflow-hidden">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = mode === tab.key;
          const isLast = index === tabs.length - 1;

          const Wrapper = animate ? motion.button : "button";
          const wrapperProps = animate
            ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } }
            : {};

          return (
            <Wrapper
              key={tab.key}
              type="button"
              onClick={() => onModeChange(tab.key)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-2 md:gap-1 md:px-6 md:py-3 lg:px-8 lg:py-4 transition-all duration-300 group relative",
                !isLast && "border-r border-gray-200",
                isActive
                  ? "border-b-4 border-b-amber-500 bg-amber-50 -mb-[2px]"
                  : "hover:bg-gray-50"
              )}
              {...wrapperProps}
            >
              <Icon
                className={cn(
                  "w-5 h-5 md:w-6 md:h-6 transition-colors",
                  isActive ? "text-amber-500" : "text-gray-500 group-hover:text-gray-700"
                )}
              />
              {showLabels && (
                <span
                  className={cn(
                    "text-[10px] md:text-xs font-bold transition-colors",
                    isActive ? "text-amber-600" : "text-gray-600 group-hover:text-gray-800"
                  )}
                >
                  {tab.label}
                </span>
              )}
            </Wrapper>
          );
        })}
      </div>
    </div>
  );
};

export default ModeSwitcher;
