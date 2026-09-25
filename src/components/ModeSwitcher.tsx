import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
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
  const activeIndex = Math.max(
    0,
    tabs.findIndex((tab) => tab.key === mode),
  );

  const containerClasses = cn(
    "flex justify-center items-center gap-0",
    className
  );

  if (variant === "pill") {
    return (
      <div className={containerClasses}>
        <div
          className="relative grid grid-cols-2 items-center w-full min-w-[280px] max-w-[300px] p-1 bg-white rounded-full shadow-sm overflow-hidden"
          style={{ boxShadow: "0px 8px 30px 0px #0000000F", border: "1px solid #E2E8F0" }}
        >
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = index === activeIndex;

            const Wrapper = animate ? motion.button : "button";
            const wrapperProps = animate
              ? { whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 } }
              : {};

            return (
              <Wrapper
                key={tab.key}
                type="button"
                onClick={() => onModeChange(tab.key)}
                className={cn(
                  "relative justify-center px-3 py-3.5 text-xs font-semibold rounded-full flex items-center gap-2 transition-colors",
                  isActive ? "text-white" : "text-[#62748E] hover:text-gray-800"
                )}
                {...wrapperProps}
              >
                {isActive && animate && (
                  <motion.span
                    layoutId="pill-indicator"
                    className="absolute -inset-1 rounded-full bg-green900 shadow-[0px_10px_15px_-3px_#00996640]"
                    transition={{ type: "tween", duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  />
                )}
                {isActive && !animate && (
                  <span className="absolute -inset-1 rounded-full bg-green900 shadow-[0px_10px_15px_-3px_#00996640]" />
                )}
                <Icon className="relative z-10 w-4 h-4" />
                {showLabels && <span className="relative z-10 text-[12.5px]">{tab.label}</span>}
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
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = index === activeIndex;

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
      <div className="relative grid grid-cols-2 bg-white rounded-t-2xl shadow-lg border border-gray-200 overflow-hidden">
        {animate ? (
          <>
            <motion.span
              className="absolute inset-y-0 left-0 bg-amber-50"
              style={{ width: "50%" }}
              animate={{ x: `${activeIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            />
            <motion.span
              className="absolute bottom-0 left-0 h-1 bg-amber-500"
              style={{ width: "50%" }}
              animate={{ x: `${activeIndex * 100}%` }}
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
            />
          </>
        ) : (
          <>
            <span
              className="absolute inset-y-0 bg-amber-50"
              style={{ left: `${activeIndex * 50}%`, width: "50%" }}
            />
            <span
              className="absolute bottom-0 h-1 bg-amber-500"
              style={{ left: `${activeIndex * 50}%`, width: "50%" }}
            />
          </>
        )}
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = index === activeIndex;
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
                "flex flex-col items-center gap-0.5 px-4 py-2 md:gap-1 md:px-6 md:py-3 lg:px-8 lg:py-4 transition-colors duration-300 group relative z-10",
                !isLast && "border-r border-gray-200",
                isActive ? "text-amber-600" : "hover:bg-gray-50"
              )}
              {...wrapperProps}
            >
              <Icon
                className={cn(
                  "relative z-10 w-5 h-5 md:w-6 md:h-6 transition-colors",
                  isActive ? "text-amber-500" : "text-gray-500 group-hover:text-gray-700"
                )}
              />
              {showLabels && (
                <span
                  className={cn(
                    "relative z-10 text-[10px] md:text-xs font-bold transition-colors",
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
