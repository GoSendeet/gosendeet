import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleTypes, packageWeight, packageType } from "@/constants";
import { useForm, Controller } from "react-hook-form";
import { vehicleCapabilitySchema } from "@/schema/franchise/settings";
import { VehicleCapabilityFormData } from "@/schema/franchise/settings/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, Save } from "lucide-react";
import { useEffect } from "react";
import {
  useGetFranchiseVehicleCapabilities,
  useUpdateFranchiseVehicleCapabilities,
} from "@/queries/franchise/useFranchiseSettings";

const weightLabelToKg = (value: string) => Number(value.replace(/[^\d.]/g, ""));

const kgToWeightLabel = (value?: number | string | null) => {
  if (value === undefined || value === null || value === "") return "";
  const numeric = Number(value);
  return packageWeight.find((weight) => weightLabelToKg(weight.type) === numeric)?.type ?? "";
};

const VehicleTab = () => {
  const { data: vehicleCapabilities } = useGetFranchiseVehicleCapabilities();
  const {
    mutate: saveVehicle,
    isPending,
    isSuccess,
  } = useUpdateFranchiseVehicleCapabilities();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<VehicleCapabilityFormData>({
    resolver: zodResolver(vehicleCapabilitySchema),
    defaultValues: {
      vehicle_type: "",
      plate_number: "",
      package_weight: "",
      package_capabilities: [],
    },
  });

  useEffect(() => {
    if (!vehicleCapabilities) return;
    reset({
      vehicle_type: vehicleCapabilities.vehicleType ?? "",
      plate_number: vehicleCapabilities.plateNumber ?? "",
      package_weight: kgToWeightLabel(vehicleCapabilities.maxPackageWeightKg),
      package_capabilities: vehicleCapabilities.packageCapabilities ?? [],
    });
  }, [vehicleCapabilities, reset]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Bank Account</h3>

        <p className="text-xs text-gray-400 mt-0.5">Vehicle & Capabilities</p>
      </div>

      <form
        onSubmit={handleSubmit((data) =>
          saveVehicle({
            vehicleType: data.vehicle_type,
            plateNumber: data.plate_number,
            maxPackageWeightKg: weightLabelToKg(data.package_weight),
            packageCapabilities: data.package_capabilities,
          }),
        )}
        className="flex flex-col gap-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Vehicle Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Vehicle Type
            </label>
            <Controller
              name="vehicle_type"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50">
                    <SelectValue placeholder="Select a Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map((type) => (
                      <SelectItem key={type.id} value={type.type}>
                        {type.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.vehicle_type && (
              <p className="text-xs text-red-500">
                {errors.vehicle_type.message}
              </p>
            )}
          </div>

          {/* Plate Number */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Plate Number
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              placeholder="Enter vehicle plate number"
              {...register("plate_number")}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-300"
            />
            {errors.plate_number && (
              <p className="text-xs text-red-500">
                {errors.plate_number.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">
              Max Package Weight
            </label>
            <Controller
              name="package_weight"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full rounded-xl border border-gray-200 text-sm text-gray-700 bg-white focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50">
                    <SelectValue placeholder="Select a Weight" />
                  </SelectTrigger>
                  <SelectContent>
                    {packageWeight.map((type) => (
                      <SelectItem key={type.id} value={type.type}>
                        {type.type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.package_weight && (
              <p className="text-xs text-red-500">
                {errors.package_weight.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-xs font-medium text-gray-500">
              Package Types
            </label>
            <Controller
              name="package_capabilities"
              control={control}
              render={({ field }) => (
                <div className="flex flex-wrap items-center gap-2">
                  {packageType.map((items) => {
                    const selected = field.value?.includes(items.type);
                    return (
                      <button
                        type="button"
                        key={items.id}
                        onClick={() =>
                          field.onChange(
                            selected
                              ? field.value.filter((value) => value !== items.type)
                              : [...(field.value ?? []), items.type],
                          )
                        }
                        className={`py-1 px-2 rounded-full text-xs transition-colors ${
                          selected
                            ? "bg-emerald-500 text-white"
                            : "bg-emerald-100 text-emerald-600"
                        }`}
                      >
                        {items.type}
                      </button>
                    );
                  })}
                </div>
              )}
            />
            {errors.package_capabilities && (
              <p className="text-xs text-red-500">
                {errors.package_capabilities.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={isPending}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
                isSuccess
                  ? "bg-emerald-400 cursor-default"
                  : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              }`}
            >
              {isSuccess ? <CheckCircle size={15} /> : <Save size={15} />}
              {isPending ? "Saving..." : isSuccess ? "Saved!" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default VehicleTab;
