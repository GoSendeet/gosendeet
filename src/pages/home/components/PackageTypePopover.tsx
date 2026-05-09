import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { PopoverContent } from "@/components/ui/popover";
import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";
import { cn } from "@/lib/utils";
import { FiBox, FiCheck, FiFileText, FiPackage } from "react-icons/fi";
import { LuBackpack, LuPackageOpen } from "react-icons/lu";

interface PackageTypePopoverProps {
  selectedPackageId: string;
  currentWeight: string;
  currentDimensions: string;
  currentItemPrice: string;
  onOpenChange: (open: boolean) => void;
  onConfirm: (
    packageId: string,
    packageName: string,
    weight: string,
    dimensions: string,
    itemPrice: string,
    packageData: PackageTypeOption,
  ) => void;
}

interface PackageTypeOption {
  id: string | number;
  name: string;
  code?: string;
  description?: string;
  length?: string | number;
  width?: string | number;
  height?: string | number;
  dimensionUnit?: string;
  maxWeight?: string | number;
  weightUnit?: string;
  imageUrl?: string;
}

interface ResolvedPackageOption {
  key: string;
  label: string;
  helper: string;
  icon: ComponentType<{ className?: string }>;
  imageUrl?: string;
  defaultWeight: string;
  packageData: PackageTypeOption;
};

const WEIGHT_PRESETS = [
  { label: "0-1kg", value: "1", helper: "Very light" },
  { label: "1-5kg", value: "5", helper: "One hand" },
  { label: "5-10kg", value: "10", helper: "Two hands" },
  { label: "10-25kg", value: "25", helper: "Heavy" },
  { label: "25kg+", value: "30", helper: "Bulky" },
];

const normalizeName = (value?: string) => value?.toLowerCase().trim() || "";

const getFallbackIcon = (pkg: PackageTypeOption) => {
  const normalized = normalizeName(`${pkg.name} ${pkg.code || ""}`);

  if (normalized.includes("document") || normalized.includes("envelope")) {
    return FiFileText;
  }
  if (normalized.includes("bag") || normalized.includes("backpack")) {
    return LuBackpack;
  }
  if (
    normalized.includes("bulky") ||
    normalized.includes("crate") ||
    normalized.includes("pallet") ||
    normalized.includes("extra large")
  ) {
    return LuPackageOpen;
  }
  if (normalized.includes("box")) return FiBox;
  return FiPackage;
};

const getDefaultWeight = (pkg: PackageTypeOption) => {
  const maxWeight = Number(pkg.maxWeight);
  if (Number.isFinite(maxWeight) && maxWeight > 0) {
    return String(Math.min(maxWeight, 5));
  }
  return "5";
};

const getPackageHelper = (pkg: PackageTypeOption) => {
  const normalized = normalizeName(
    `${pkg.name} ${pkg.code || ""} ${pkg.description || ""}`,
  );

  if (
    normalized.includes("bulky") ||
    normalized.includes("crate") ||
    normalized.includes("pallet") ||
    normalized.includes("extra large") ||
    normalized.includes("furniture") ||
    normalized.includes("appliance")
  ) {
    return "Requires a van";
  }

  if (
    normalized.includes("large box") ||
    normalized.includes("medium box") ||
    normalized.includes("large") ||
    normalized.includes("car")
  ) {
    return "Requires a car";
  }

  return "Fits on a bike";
};

const formatDimensions = (pkg: PackageTypeOption) => {
  const unit = pkg?.dimensionUnit || "cm";
  if (pkg?.length && pkg?.width && pkg?.height) {
    return `${pkg.length} x ${pkg.width} x ${pkg.height} ${unit}`;
  }
  return "";
};

export function PackageTypePopover({
  selectedPackageId,
  currentWeight,
  currentItemPrice,
  onOpenChange,
  onConfirm,
}: PackageTypePopoverProps) {
  const {
    data: packageTypes,
    isLoading: isPackageTypesLoading,
    isError: isPackageTypesError,
  } = useGetPackageType({ minimize: true });

  const packages = useMemo<PackageTypeOption[]>(() => {
    if (Array.isArray(packageTypes?.data)) {
      return packageTypes.data as PackageTypeOption[];
    }
    return (packageTypes?.data?.content || []) as PackageTypeOption[];
  }, [packageTypes?.data]);

  const options = useMemo<ResolvedPackageOption[]>(() => {
    return packages.map((pkg) => ({
      key: String(pkg.id),
      label: pkg.name,
      helper: getPackageHelper(pkg),
      icon: getFallbackIcon(pkg),
      imageUrl: pkg.imageUrl,
      defaultWeight: getDefaultWeight(pkg),
      packageData: pkg,
    }));
  }, [packages]);

  const [selectedKey, setSelectedKey] = useState("");
  const [selectedWeight, setSelectedWeight] = useState("");
  const [manualWeight, setManualWeight] = useState("");
  const [showManualWeight, setShowManualWeight] = useState(false);

  useEffect(() => {
    if (options.length === 0) return;

    const matchingOption = options.find(
      (option) => String(option.packageData.id) === selectedPackageId,
    );
    const fallbackOption = matchingOption || options[0];

    setSelectedKey(fallbackOption.key);
    setSelectedWeight(currentWeight || fallbackOption.defaultWeight || "");
    setManualWeight(currentWeight || "");
    setShowManualWeight(false);
  }, [currentWeight, options, selectedPackageId]);

  const selectedOption =
    options.find((option) => option.key === selectedKey) || options[0];
  const effectiveWeight = showManualWeight ? manualWeight : selectedWeight;
  const canApply = Boolean(selectedOption?.packageData?.id && effectiveWeight);

  const handlePackageSelect = (key: string) => {
    const option = options.find((item) => item.key === key);
    if (!option) return;

    setSelectedKey(key);
    setShowManualWeight(false);
    setSelectedWeight(option.defaultWeight);
  };

  const handleApply = () => {
    if (!canApply || !selectedOption) return;

    onConfirm(
      String(selectedOption.packageData.id),
      selectedOption.label,
      effectiveWeight,
      formatDimensions(selectedOption.packageData),
      currentItemPrice,
      selectedOption.packageData,
    );
    onOpenChange(false);
  };

  return (
    <PopoverContent
      side="bottom"
      align="center"
      sideOffset={10}
      avoidCollisions={false}
      className="w-[min(640px,calc(100vw-32px))] rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
    >
      <div className="space-y-5">
        <div>
          <h3 className="text-sm font-bold text-[#0F172A]">
            1. Choose a package type
          </h3>
          <p className="mt-1 text-xs text-[#64748B]">
            Pick the closest match. You can enter exact weight manually.
          </p>
        </div>

        {isPackageTypesLoading && (
          <p className="text-sm text-gray-500">Loading package types...</p>
        )}

        {!isPackageTypesLoading && isPackageTypesError && (
          <p className="text-sm text-red-500">
            Unable to load package types right now.
          </p>
        )}

        {!isPackageTypesLoading && !isPackageTypesError && (
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {options.map((option) => {
              const Icon = option.icon;
              const isSelected = selectedKey === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => handlePackageSelect(option.key)}
                  className={cn(
                    "relative flex min-h-[64px] items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    isSelected
                      ? "border-brand bg-[#F0FDF4]"
                      : "border-gray-200 bg-white hover:border-brand",
                  )}
                >
                  {isSelected && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                      <FiCheck className="h-3 w-3" />
                    </span>
                  )}
                  {option.imageUrl ? (
                    <img
                      src={option.imageUrl}
                      alt=""
                      className="h-6 w-6 shrink-0 rounded-md object-contain"
                    />
                  ) : (
                    <Icon className="h-5 w-5 shrink-0 text-brand" />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-[#0F172A]">
                      {option.label}
                    </span>
                    <span className="block truncate text-[11px] text-[#64748B]">
                      {option.helper}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div>
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-[#0F172A]">
                2. Approximate weight
              </h3>
              <p className="mt-1 text-xs text-[#64748B]">
                Choose a preset or enter the exact weight.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowManualWeight(true)}
              className="shrink-0 text-xs font-bold text-brand underline underline-offset-4 hover:text-[#064E3B]"
            >
              Enter manually
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {WEIGHT_PRESETS.map((preset) => {
              const isSelected =
                !showManualWeight && selectedWeight === preset.value;

              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    setShowManualWeight(false);
                    setSelectedWeight(preset.value);
                  }}
                  className={cn(
                    "relative rounded-xl border px-3 py-3 text-center transition-colors",
                    isSelected
                      ? "border-brand bg-[#F0FDF4]"
                      : "border-gray-200 bg-white hover:border-brand",
                  )}
                >
                  {isSelected && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                      <FiCheck className="h-3 w-3" />
                    </span>
                  )}
                  <span className="block text-xs font-bold text-[#0F172A]">
                    {preset.label}
                  </span>
                  <span className="block text-[11px] text-[#64748B]">
                    {preset.helper}
                  </span>
                </button>
              );
            })}
          </div>

          {showManualWeight && (
            <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
              <label className="mb-1.5 block text-xs font-bold text-[#0F172A]">
                Exact weight in kg
              </label>
              <input
                type="text"
                value={manualWeight}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^\d*\.?\d*$/.test(value)) {
                    setManualWeight(value);
                  }
                }}
                placeholder="e.g. 3.5"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
          )}
        </div>

        <Button
          type="button"
          size="custom"
          onClick={handleApply}
          disabled={!canApply}
          className="w-full justify-center bg-[#064E3B] py-3 font-bold"
        >
          Apply
        </Button>
      </div>
    </PopoverContent>
  );
}
