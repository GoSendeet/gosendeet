import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";
import { cn } from "@/lib/utils";
import { FiCheck } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import packageIcon from "@/assets/icons/size.png";
import { useState, useEffect } from "react";

// Step Indicator Component (brand color and number for complete)
const StepIndicator = ({ stepNumber, isComplete, isActive }: { stepNumber: number; isComplete: boolean; isActive: boolean }) => {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors",
        isComplete
          ? "bg-brand text-white border-2 border-brand"
          : isActive
            ? "bg-[#E5E7EB] text-gray150 border-2 border-grey100"
            : "bg-gray-200 text-gray-500 border-2 border-gray-200"
      )}
    >
      {stepNumber}
    </div>
  );
};

interface PackageTypeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedPackageId: string;
  currentWeight: string;
  currentDimensions: string;
  currentItemPrice: string;
  onConfirm: (
    packageId: string,
    packageName: string,
    weight: string,
    dimensions: string,
    itemPrice: string,
    packageData: any
  ) => void;
}

export function PackageTypeModal({
  open,
  onOpenChange,
  selectedPackageId,
  currentWeight,
  currentDimensions,
  currentItemPrice,
  onConfirm,
}: PackageTypeModalProps) {
  const { data: packageTypes } = useGetPackageType({ minimize: true });
  const packages = packageTypes?.data || [];

  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [itemPrice, setItemPrice] = useState("");

  // Step validation states
  const step1Complete = selectedPackage && length && width && height &&
    parseFloat(length) > 0 && parseFloat(width) > 0 && parseFloat(height) > 0;
  const step2Complete = step1Complete && weight && parseFloat(weight) > 0 &&
    !(selectedPackage?.maxWeight && parseFloat(weight) > selectedPackage.maxWeight);
  const step3Complete = step2Complete && itemPrice && parseFloat(itemPrice) > 0;

  // Initialize from current values when modal opens
  useEffect(() => {
    if (open) {
      setWeight(currentWeight || "");
      setItemPrice(currentItemPrice || "");

      // Parse current dimensions if exists
      if (currentDimensions) {
        const parts = currentDimensions.split(/\s*[×x]\s*/).map(p => p.trim().replace(/[^\d.]/g, ''));
        if (parts.length >= 3) {
          setLength(parts[0] || "");
          setWidth(parts[1] || "");
          setHeight(parts[2] || "");
        }
      } else {
        // Reset dimensions if no current dimensions
        setLength("");
        setWidth("");
        setHeight("");
      }

      // Find and set selected package
      if (selectedPackageId && packages.length > 0) {
        const pkg = packages.find((p: any) => String(p.id) === selectedPackageId);
        if (pkg) {
          setSelectedPackage(pkg);
        }
      } else {
        setSelectedPackage(null);
      }
    }
  }, [open, currentWeight, currentDimensions, currentItemPrice, selectedPackageId, packages]);

  const handlePackageSelect = (pkg: any) => {
    setSelectedPackage(pkg);

    // Auto-fill dimensions from package
    if (pkg.length && pkg.width && pkg.height) {
      setLength(String(pkg.length));
      setWidth(String(pkg.width));
      setHeight(String(pkg.height));
    }
  };

  const handleNumberInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>) => {
    if (/^\d*\.?\d*$/.test(value)) {
      setter(value);
    }
  };

  // Generate named weight presets based on package max weight
  const getWeightPresets = () => {
    if (!selectedPackage?.maxWeight) return [];

    const max = selectedPackage.maxWeight;

    return [
      { label: 'Light', value: Number((max * 0.25).toFixed(2)) },
      { label: 'Medium', value: Number((max * 0.5).toFixed(2)) },
      { label: 'Heavy', value: Number((max * 0.75).toFixed(2)) },
      { label: 'Max', value: max }
    ];
  };

  const handleConfirm = () => {
    if (!selectedPackage) return;

    const currentWeight = parseFloat(weight) || 0;
    const maxWeight = selectedPackage.maxWeight;
    const price = parseFloat(itemPrice) || 0;

    // Validate weight
    if (currentWeight <= 0) return;
    if (maxWeight && currentWeight > maxWeight) return;

    // Validate dimensions
    if (!length || !width || !height) return;
    if (parseFloat(length) <= 0 || parseFloat(width) <= 0 || parseFloat(height) <= 0) return;

    // Validate item price
    if (price <= 0) return;

    const formattedDimensions = `${length} × ${width} × ${height} ${selectedPackage.dimensionUnit}`;

    onConfirm(
      String(selectedPackage.id),
      selectedPackage.name,
      weight,
      formattedDimensions,
      itemPrice,
      selectedPackage
    );
    onOpenChange(false);
  };

  const weightPresets = getWeightPresets();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        <DialogTitle className="text-xl font-clash font-bold text-gray-900">Package Details</DialogTitle>
        <DialogDescription className="text-sm text-gray-600">
          Complete the steps below to configure your package
        </DialogDescription>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto mt-4 pr-2 pb-6">

          {/* Step 1: Package & Dimensions */}
          <div className="flex gap-3 relative transition-opacity">
            <div className="flex flex-col items-center">
              <StepIndicator stepNumber={1} isComplete={step1Complete} isActive={true} />
              {/* No vertical connecting line */}
            </div>

            <div className="flex-1 overflow-x-hidden">
              <h3 className="font-semibold text-sm text-gray-900 mb-1">How big is your package?</h3>

              {/* Package Type Label - Outside Scroll */}
              <label className="block text-xs text-brand mb-2">Select package type</label>

              {/* Package Cards - Horizontal Scroll ONLY */}
              <div
                className="overflow-x-auto overflow-y-visible mb-3 -mx-2 px-2 custom-scrollbar"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="flex gap-4 py-2 min-w-max">
                {packages.map((pkg: any) => {
                  const isSelected = selectedPackage?.id === pkg.id;
                  return (
                    <button
                      key={pkg.id}
                      type="button"
                      onClick={() => handlePackageSelect(pkg)}
                      className={cn(
                        "relative shrink-0 w-[108px] h-[94px] p-2 rounded-lg border flex flex-col items-center",
                        isSelected
                          ? "border-brand bg-[#F0FDF480]"
                          : "border-gray-300 hover:border-brand bg-white"
                      )}
                    >
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full flex items-center justify-center">
                          <FiCheck className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}

                      <div className=
                        "w-8 h-8 mt-3 rounded mb-1 flex justify-center items-center "
                        
                      >
                        <img
                          src={pkg.imageUrl || packageIcon}
                          alt={pkg.name}
                          className="w-5 h-5 object-center"
                          onError={(e) => {
                            // Fallback to default icon if custom image fails to load
                            (e.target as HTMLImageElement).src = packageIcon;
                          }}
                        />
                      </div>

                      <h4 className={cn(
                        "font-medium py-3 text-xs text-center truncate line-clamp-1 w-full",
                        isSelected ? "text-brand" : "text-gray-900"
                      )}>
                        {pkg.name}
                      </h4>
                    </button>
                  );
                })}
                </div>
              </div>

              {/* Dimensions */}
              {selectedPackage && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-600 mb-2">
                    Dimensions ({selectedPackage.dimensionUnit})
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={length}
                      onChange={(e) => handleNumberInput(e.target.value, setLength)}
                      placeholder="L"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-center focus:border-brand focus:outline-none"
                    />
                    <span className="text-gray-400 text-sm">×</span>
                    <input
                      type="text"
                      value={width}
                      onChange={(e) => handleNumberInput(e.target.value, setWidth)}
                      placeholder="W"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-center focus:border-brand focus:outline-none"
                    />
                    <span className="text-gray-400 text-sm">×</span>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => handleNumberInput(e.target.value, setHeight)}
                      placeholder="H"
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded text-center focus:border-brand focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Weight */}
          <div className={cn("flex gap-3 relative mt-6 transition-opacity", !step1Complete && "opacity-80 pointer-events-none")}>            
            <div className="flex flex-col items-center">
              <StepIndicator stepNumber={2} isComplete={step2Complete} isActive={step1Complete && !step2Complete} />
              {/* No vertical connecting line */}
            </div>

            <div className="flex-1">
              <h3 className={cn("font-semibold text-sm mb-3", step1Complete ? "text-gray-900" : "text-gray-400")}>How heavy is it?</h3>

              <label className={cn("block text-xs mb-2", step1Complete ? "text-gray-600" : "text-gray-400")}>
                Max weight: {selectedPackage?.maxWeight}{selectedPackage?.weightUnit}
              </label>

              {/* Bold Money-Style Weight Display */}
              <div className={cn(
                "relative p-4 rounded-lg border-2 transition-all overflow-hidden mb-3",
                step1Complete
                  ? "border-brand bg-white shadow-sm"
                  : "border-gray-200 bg-gray-50"
              )}>
                <label className={cn("block text-xs font-medium mb-1", step1Complete ? "text-gray-700" : "text-gray-400")}>
                  Weight
                </label>
                <div className="flex items-baseline gap-2">
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => handleNumberInput(e.target.value, setWeight)}
                    disabled={!step1Complete}
                    style={{ width: '0' }}
                    className={cn(
                      "flex-1 bg-transparent outline-none font-bold text-3xl tabular-nums",
                      step1Complete ? "text-gray-900" : "text-gray-400"
                    )}
                    placeholder="0"
                  />
                  <span className={cn("text-lg font-semibold whitespace-nowrap", step1Complete ? "text-gray-600" : "text-gray-400")}>
                    {selectedPackage?.weightUnit || 'kg'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {weightPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setWeight(String(preset.value))}
                    disabled={!step1Complete}
                    className={cn(
                      "py-2.5 px-3 rounded-lg text-xs font-semibold transition-all shadow-sm",
                      weight === String(preset.value)
                        ? "border border-brand bg-brand-light text-brand"
                        : "bg-white cursor-pointer text-gray-700 border border-gray-200 hover:border-brand hover:bg-brand-light hover:text-brand"
                    )}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {weight && selectedPackage?.maxWeight && parseFloat(weight) > selectedPackage.maxWeight && (
                <p className="text-xs text-red-600 mt-2">Exceeds max weight</p>
              )}
            </div>
          </div>

          {/* Step 3: Insurance Value */}
          <div className={cn("flex gap-3 mt-6 transition-opacity", !step2Complete && "opacity-80 pointer-events-none")}>            
            <StepIndicator stepNumber={3} isComplete={step3Complete} isActive={step2Complete && !step3Complete} />

            <div className="flex-1">
              <h3 className={cn("font-semibold text-sm mb-3", step2Complete ? "text-gray-900" : "text-gray-400")}>How much is it worth?</h3>

              <label className={cn("block text-xs mb-3", step2Complete ? "text-gray-600" : "text-gray-400")}>
                Item value for insurance coverage
              </label>

              {/* Bold Money-Style Amount Display */}
              <div className={cn(
                "relative p-4 rounded-lg border-2 transition-all overflow-hidden",
                step2Complete
                  ? "border-brand bg-white shadow-sm"
                  : "border-gray-200 bg-gray-50"
              )}>
                <label className={cn("block text-xs font-medium mb-1", step2Complete ? "text-gray-700" : "text-gray-400")}>
                  Item Value
                </label>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-2xl font-bold whitespace-nowrap", step2Complete ? "text-gray-900" : "text-gray-400")}>
                    ₦
                  </span>
                  <input
                    type="text"
                    value={itemPrice}
                    onChange={(e) => handleNumberInput(e.target.value, setItemPrice)}
                    disabled={!step2Complete}
                    placeholder="0.00"
                    style={{ width: '0' }}
                    className={cn(
                      "flex-1 bg-transparent outline-none font-bold text-3xl tabular-nums",
                      step2Complete ? "text-gray-900" : "text-gray-400"
                    )}
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
        {/* Action Bar */}
        <div className="mt-2 pt-4 border-t border-gray-200 bg-white">
          <Button
            type="button"
            onClick={handleConfirm}
            variant="secondary"
            size="custom"
            className="w-full py-2.5 text-sm font-bold"
            disabled={!step3Complete}
          >
            Confirm Package Details
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
