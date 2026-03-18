import React from "react";
import StarRating from "@/components/ui/StarRating";

type BaseProps = {
  title: string;
  value: string;
  subvalue?: string;
  icon?: React.ElementType;
  iconBg?: string;
  iconColor?: string;
  iconSize?: number;
};

type DefaultVariant = BaseProps & {
  variant?: "default";
}

type ProgressVariant = BaseProps & {
  variant: "progress";
  percentage: number;       
  target: string;           
  barColor?: string;
};

type RatingVariant = BaseProps & {
  variant: "rating";
  outOf: number;           
  totalRatings: number;
  ratingValue: number;
};

type ComplaintVariant = BaseProps & {
  variant: "complaint";
  totalDeliveries: number;
  period?: string;
};

type FranchiseCardProps = DefaultVariant | ProgressVariant | RatingVariant | ComplaintVariant;

export const FranchiseCard = ({
  title,
  value,
  subvalue,
  icon: Icon,
  iconBg = "#ECFDF5",
  iconColor = "#009966",
  iconSize = 20,
}: BaseProps) => {
  return (
    <div className="flex font-inter items-start justify-between w-full max-w-328 min-h-28 rounded-2xl shadow-sm p-3 md:p-6 bg-white">
      <div className="flex flex-col gap-3 md:gap-1">
        <h3 className="text-frch-text-gray font-light text-xs md:text-sm w-20 md:w-full">
          {title}
        </h3>
        <p className="text-[#101828] font-bold text-sm md:text-lg">{value}</p>
        {subvalue && (
          <p className="text-frch-text-gray font-light text-xs md:text-sm">
            {subvalue}
          </p>
        )}
      </div>
      {Icon && (
        <div
          className="p-2.5 md:p-2 rounded-md shrink-0"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={iconSize - 5} color={iconColor} className="md:hidden" />
          <Icon size={iconSize} color={iconColor} className="hidden md:block" />
        </div>
      )}
    </div>
  );
};

export const FranchiseCardEarning = ({
  title,
  value,
  subvalue,
  icon: Icon,
  iconBg = "#ECFDF5",
  iconColor = "#009966",
  iconSize = 20,
}: BaseProps) => {
  return (
    <div className="flex items-start gap-3 w-full font-inter max-w-328 min-h-28 max-h-28 rounded-2xl shadow-sm p-3 md:p-6 bg-white">
      {Icon && (
        <div
          className="w-fit h-fit p-3 rounded-md"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={iconSize} color={iconColor} />
        </div>
      )}
      <div className="flex flex-col gap-1.5 md:gap-1">
        <h3 className="text-frch-text-gray font-light text-xs md:text-sm w-20 md:w-full">
          {title}
        </h3>
        <p className="text-[#101828] font-bold text-base md:text-lg">{value}</p>
        {subvalue && (
          <span className="text-frch-text-gray font-light text-xs -mt-1">
            {subvalue}
          </span>
        )}
      </div>
    </div>
  );
};

export const FranchiseCardPerformance = (props : FranchiseCardProps) => {
  const {
    title,
    value,
    icon: Icon,
    iconBg = "#ECFDF5",
    iconColor = "#009966",
    iconSize = 20,
  } = props;
  return (
     <div className="flex items-start gap-3 w-full font-inter rounded-2xl shadow-sm p-4 md:p-5 bg-white border border-gray-100 max-w-328 min-h-32 max-h-32">
        {/* Icon */}
        {Icon && (
          <div
            className="w-9 h-9 flex items-center justify-center rounded-xl shrink-0"
            style={{ backgroundColor: iconBg }}
          >
            <Icon size={iconSize} color={iconColor} />
          </div>
        )}
        
      {/* Content */}
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        {/* Title */}
        <h3 className="text-xs font-medium text-gray-400 truncate">{title}</h3>

        {/* Value */}
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-bold text-gray-900 leading-tight tracking-tight">
            {value}
          </p>
          {props.variant === "rating" && (
            <span className="text-sm text-gray-400 font-normal">
              / {props.outOf}.0
            </span>
          )}
        </div>

        {/* Variant-specific bottom section */}
        {props.variant === "progress" && (
          <div className="flex flex-col gap-1.5 mt-1">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${props.barColor ?? "bg-blue-500"}`}
                style={{ width: `${Math.min(props.percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-400">Target: {props.target}</p>
          </div>
        )}

        {props.variant === "rating" && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <StarRating rating={props.ratingValue} outOf={props.outOf} />
            <span className="text-xs text-gray-400">({props.totalRatings} ratings)</span>
          </div>
        )}

        {props.variant === "complaint" && (
          <p className="text-xs text-gray-400 mt-0.5">
            Out of{" "}
            <span className="font-semibold text-gray-600">{props.totalDeliveries}</span>{" "}
            deliveries {props.period ?? "this month"}
          </p>
        )}

        {(!props.variant || props.variant === "default") && props.subvalue && (
          <p className="text-xs text-gray-400 -mt-0.5">{props.subvalue}</p>
        )}
      </div>
    </div>
  );
};
