import { zodResolver } from "@hookform/resolvers/zod";
import { vehicleTypes, packageWeight, packageType } from "@/constants";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
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

const VehicleTab = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<VehicleCapabilityFormData>({
    resolver: zodResolver(vehicleCapabilitySchema),
  });

  const {
    mutate: saveVehicle,
    isPending,
    isSuccess,
  } = useMutation({
    mutationFn: async (data: VehicleCapabilityFormData) => {
      console.log("Payload: ", data);
    },
    onSuccess: () => reset(),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700">Bank Account</h3>

        <p className="text-xs text-gray-400 mt-0.5">Vehicle & Capabilities</p>
      </div>

      <form
        onSubmit={handleSubmit((data) => saveVehicle(data))}
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
            <div className="flex items-center gap-2">
            {packageType.map((items) => (
              <span
                key={items.id}
                className="bg-emerald-100 py-1 px-2 rounded-full text-xs text-emerald-600"
              >
                {items.type}
              </span>
            ))}
            </div>
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
