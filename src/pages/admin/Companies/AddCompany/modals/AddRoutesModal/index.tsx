import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useGetCrossAreaRoute,
  useGetPackageType,
  useGetServiceLevel,
} from "@/queries/admin/useGetAdminSettings";
import {
  createCompanyServices,
  updateCompanyServices,
} from "@/services/companies";
import { allowOnlyNumbers } from "@/lib/utils";
import { CustomInput } from "@/components/CustomInput";
import { Switch } from "@/components/ui/switch";
import { FiTrash2 } from "react-icons/fi";

interface SlaEntry {
  id?: string;
  serviceLevelId: string;
  serviceLevelName: string;
  multiplier: string;
  minDeliveryDays: string;
  maxDeliveryDays: string;
  isActive: boolean;
}

const schema = z.object({
  crossAreaRouteId: z
    .string({ required_error: "Cross area route is required" })
    .min(1, "Please select a route"),
  packageTypeIds: z
    .array(z.string())
    .nonempty({ message: "Select at least one package type" }),
  basePrice: z.string().min(1, "Base price is required"),
  costPerKg: z.string().min(1, "Cost per kg is required"),
  costPerKm: z.string().min(1, "Cost per km is required"),
  doorstepPickupFee: z.string().optional(),
  storeDropoffFee: z.string().optional(),
  doorstepPickupEnabled: z.boolean().optional(),
  storeDropoffEnabled: z.boolean().optional(),
  bulkyMultiplier: z.string().optional(),
  bulkyThresholdKgOverride: z.string().optional(),
  discount: z.string().optional(),
  description: z.string().optional(),
});

export function AddRoutesModal({
  companyId,
  openRoutesModal,
  setOpenRoutesModal,
  info,
  type,
  setInfo,
}: {
  companyId: string;
  openRoutesModal: boolean;
  setOpenRoutesModal: any;
  info: any;
  type: string;
  setInfo: any;
}) {
  const [selectedPackageTypes, setSelectedPackageTypes] = useState<string[]>([]);
  const [slaEntries, setSlaEntries] = useState<SlaEntry[]>([]);
  const [selectedSlaId, setSelectedSlaId] = useState("");
  const [slaError, setSlaError] = useState("");

  const { data: service_levels } = useGetServiceLevel({ minimize: true });
  const { data: package_types } = useGetPackageType({ minimize: true });
  const { data: cross_area_routes } = useGetCrossAreaRoute({ minimize: true });

  const serviceLevelOptions = service_levels?.data?.map((item: any) => ({
    label: item.name,
    value: item.id,
  })) ?? [];

  const packageOptions = package_types?.data?.map((item: any) => ({
    label: (
      <div className="flex flex-col">
        <span className="text-gray-900 font-semibold">{item.name}</span>
        <span className="font-light text-[0.6rem]">Max weight: ({item.maxWeight} kg)</span>
      </div>
    ),
    value: item.id,
  })) ?? [];

  const routeOptions = cross_area_routes?.data?.map((item: any) => ({
    label: item.areaA + " - " + item.areaB,
    value: item.id,
  })) ?? [];

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      crossAreaRouteId: "",
      packageTypeIds: [],
      basePrice: "",
      costPerKg: "",
      costPerKm: "",
      doorstepPickupFee: "",
      storeDropoffFee: "",
      doorstepPickupEnabled: true,
      storeDropoffEnabled: true,
      bulkyMultiplier: "",
      bulkyThresholdKgOverride: "",
      discount: "",
      description: "",
    },
  });

  useEffect(() => {
    if (openRoutesModal && type === "edit" && info) {
      reset({
        crossAreaRouteId: info?.crossAreaRoute?.id ?? "",
        packageTypeIds: info?.packageTypes?.map((p: any) => p.id) ?? [],
        basePrice: info?.basePrice?.toString() ?? "",
        costPerKg: info?.costPerKg?.toString() ?? "",
        costPerKm: info?.costPerKm?.toString() ?? "",
        doorstepPickupFee: info?.doorstepPickupFee?.toString() ?? "",
        storeDropoffFee: info?.storeDropoffFee?.toString() ?? "",
        bulkyMultiplier: info?.bulkyMultiplier?.toString() ?? "",
        bulkyThresholdKgOverride: info?.bulkyThresholdKgOverride?.toString() ?? "",
        doorstepPickupEnabled: info?.doorstepPickupEnabled ?? true,
        storeDropoffEnabled: info?.storeDropoffEnabled ?? true,
        discount: info?.discount?.toString() ?? "",
        description: info?.description ?? "",
      });
      const pkgIds = info?.packageTypes?.map((p: any) => p.id) ?? [];
      setSelectedPackageTypes(pkgIds);

      const entries: SlaEntry[] = (info?.slaConfigs ?? []).map((s: any) => ({
        id: s.id,
        serviceLevelId: s.serviceLevelId,
        serviceLevelName: s.serviceLevelName,
        multiplier: s.multiplier?.toString() ?? "1.0",
        minDeliveryDays: s.minDeliveryDays?.toString() ?? "1",
        maxDeliveryDays: s.maxDeliveryDays?.toString() ?? "2",
        isActive: s.isActive ?? true,
      }));
      setSlaEntries(entries);
    } else if (openRoutesModal && type === "create") {
      setInfo(null);
      reset({
        crossAreaRouteId: "",
        packageTypeIds: [],
        basePrice: "",
        costPerKg: "",
        costPerKm: "",
        doorstepPickupFee: "",
        storeDropoffFee: "",
        doorstepPickupEnabled: true,
        storeDropoffEnabled: true,
        bulkyMultiplier: "",
        bulkyThresholdKgOverride: "",
        discount: "",
        description: "",
      });
      setSelectedPackageTypes([]);
      setSlaEntries([]);
      setSlaError("");
      setSelectedSlaId("");
    }
  }, [openRoutesModal, info, type, reset]);

  const addSlaEntry = (id?: string) => {
    const idToAdd = id ?? selectedSlaId;
    if (!idToAdd) return;
    if (slaEntries.some((e) => e.serviceLevelId === idToAdd)) return;
    const found = service_levels?.data?.find((s: any) => s.id === idToAdd);
    setSlaEntries((prev) => [
      ...prev,
      {
        serviceLevelId: idToAdd,
        serviceLevelName: found?.name ?? "",
        multiplier: "1.0",
        minDeliveryDays: "1",
        maxDeliveryDays: "2",
        isActive: true,
      },
    ]);
    setSelectedSlaId("");
    setSlaError("");
  };

  const removeSlaEntry = (id: string) =>
    setSlaEntries((prev) => prev.filter((e) => e.serviceLevelId !== id));

  const updateSlaField = (id: string, field: keyof SlaEntry, value: string | boolean) =>
    setSlaEntries((prev) =>
      prev.map((e) => (e.serviceLevelId === id ? { ...e, [field]: value } : e))
    );

  const availableSlaOptions = serviceLevelOptions.filter(
    (o: { label: string; value: string }) => !slaEntries.some((e) => e.serviceLevelId === o.value)
  );

  const queryClient = useQueryClient();

  const { mutate: createServices, isPending: pendingCreate } = useMutation({
    mutationFn: createCompanyServices,
    onSuccess: () => {
      toast.success("Successful");
      setOpenRoutesModal(false);
      queryClient.invalidateQueries({ queryKey: ["company_services"] });
    },
    onError: (data: any) => toast.error(data?.message),
  });

  const { mutate: updateServices, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateCompanyServices(id, data),
    onSuccess: () => {
      toast.success("Successful");
      setOpenRoutesModal(false);
      queryClient.invalidateQueries({ queryKey: ["company_services"] });
    },
    onError: (error: any) => toast.error(error?.message || "Something went wrong"),
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (slaEntries.length === 0) {
      setSlaError("Add at least one SLA config");
      return;
    }
    const payload = {
      companyId,
      crossAreaRouteId: data.crossAreaRouteId,
      packageTypeIds: data.packageTypeIds,
      basePrice: parseFloat(data.basePrice),
      costPerKg: parseFloat(data.costPerKg),
      costPerKm: parseFloat(data.costPerKm),
      doorstepPickupFee: data.doorstepPickupFee ? parseFloat(data.doorstepPickupFee) : 0,
      storeDropoffFee: data.storeDropoffFee ? parseFloat(data.storeDropoffFee) : 0,
      doorstepPickupEnabled: data.doorstepPickupEnabled ?? true,
      storeDropoffEnabled: data.storeDropoffEnabled ?? true,
      bulkyMultiplier: data.bulkyMultiplier ? parseFloat(data.bulkyMultiplier) : undefined,
      bulkyThresholdKgOverride: data.bulkyThresholdKgOverride
        ? parseFloat(data.bulkyThresholdKgOverride)
        : undefined,
      discount: data.discount ? parseFloat(data.discount) : undefined,
      description: data.description || undefined,
      slaConfigs: slaEntries.map((e) => ({
        ...(e.id && { id: e.id }),
        serviceLevelId: e.serviceLevelId,
        multiplier: parseFloat(e.multiplier) || 1.0,
        minDeliveryDays: parseInt(e.minDeliveryDays) || 1,
        maxDeliveryDays: parseInt(e.maxDeliveryDays) || 2,
        isActive: e.isActive,
      })),
    };

    if (type === "create") createServices(payload);
    if (type === "edit") updateServices({ id: info?.id, data: payload });
  };

  return (
    <Dialog open={openRoutesModal} onOpenChange={setOpenRoutesModal}>
      <DialogContent className="gap-0 max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogTitle className="text-[20px] text-brand font-semibold font-inter mb-2">
          {type === "create" ? "Add a new route" : "Edit company route"}
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          {type === "create" ? "Create" : "Edit"} a route config with pricing and SLA details.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 py-4 text-sm mt-2">
          {/* Route + Package Types */}
          <input type="hidden" {...register("crossAreaRouteId")} />
          <CustomInput
            inputType="select"
            label="Cross Area Route"
            placeholder="Select route"
            value={info?.crossAreaRoute?.id}
            options={routeOptions}
            error={errors.crossAreaRouteId?.message}
            wrapperClassName="w-full"
            disabled={type === "edit"}
            onValueChange={(val) => setValue("crossAreaRouteId", val, { shouldValidate: true })}
          />

          <CustomInput
            inputType="multiSelect"
            label="Package Types"
            placeholder="Select package types"
            value={selectedPackageTypes}
            options={packageOptions}
            error={errors.packageTypeIds?.message}
            wrapperClassName="w-full"
            onChange={(val) => {
              setSelectedPackageTypes(val);
              setValue("packageTypeIds", val as [string, ...string[]], { shouldValidate: true });
            }}
          />

          {/* Pricing fields */}
          <p className="font-semibold text-brand mt-2">Pricing</p>

          <div className="flex md:flex-row flex-col gap-4">
            <CustomInput
              inputType="number"
              label="Base Price"
              inputProps={{ placeholder: "e.g. 2620", onKeyDown: allowOnlyNumbers }}
              registration={register("basePrice")}
              error={errors.basePrice?.message}
            />
            <CustomInput
              inputType="number"
              label="Cost per Kg"
              inputProps={{ placeholder: "e.g. 25", onKeyDown: allowOnlyNumbers }}
              registration={register("costPerKg")}
              error={errors.costPerKg?.message}
            />
          </div>

          <div className="flex md:flex-row flex-col gap-4">
            <CustomInput
              inputType="number"
              label="Cost per Km"
              inputProps={{ placeholder: "e.g. 20", onKeyDown: allowOnlyNumbers }}
              registration={register("costPerKm")}
              error={errors.costPerKm?.message}
            />
            <CustomInput
              inputType="number"
              label="Bulky Multiplier"
              inputProps={{ placeholder: "e.g. 1.4", onKeyDown: allowOnlyNumbers, step: "any" }}
              registration={register("bulkyMultiplier")}
              error={errors.bulkyMultiplier?.message}
            />
          </div>

          <CustomInput
            inputType="number"
            label="Bulky Threshold Override (kg)"
            inputProps={{ placeholder: "Leave blank to use company default", onKeyDown: allowOnlyNumbers }}
            registration={register("bulkyThresholdKgOverride")}
            error={errors.bulkyThresholdKgOverride?.message}
            wrapperClassName="w-full md:w-1/2"
          />

          {/* Discount */}
          <p className="font-semibold text-brand mt-2">Discount</p>
          <div className="flex md:flex-row flex-col gap-4">
            <CustomInput
              inputType="number"
              label="Discount (%)"
              inputProps={{ placeholder: "e.g. 10", onKeyDown: allowOnlyNumbers }}
              registration={register("discount")}
              error={errors.discount?.message}
            />
            <CustomInput
              inputType="text"
              label="Description"
              inputProps={{ placeholder: "e.g. Promo rate for Q2" }}
              registration={register("description")}
              error={errors.description?.message}
            />
          </div>

          {/* PUDO Config */}
          <p className="font-semibold text-brand mt-2">PUDO Config</p>

          <div className="border border-neutral300 rounded-xl divide-y divide-neutral300">
            {/* Doorstep Pickup */}
            <div className="flex items-center justify-between gap-4 px-4 py-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={watch("doorstepPickupEnabled") ?? true}
                  onCheckedChange={(val) => setValue("doorstepPickupEnabled", val)}
                />
                <span className="text-sm font-medium text-brand">Doorstep Pickup</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral600">Fee</span>
                <input
                  type="number"
                  placeholder="e.g. 500"
                  {...register("doorstepPickupFee")}
                  disabled={!watch("doorstepPickupEnabled")}
                  onKeyDown={allowOnlyNumbers}
                  className="w-24 border-b border-neutral300 outline-none py-1 px-1 text-sm disabled:opacity-40"
                />
              </div>
            </div>

            {/* Store Drop-off */}
            <div className="flex items-center justify-between gap-4 px-4 py-2">
              <div className="flex items-center gap-3">
                <Switch
                  checked={watch("storeDropoffEnabled") ?? true}
                  onCheckedChange={(val) => setValue("storeDropoffEnabled", val)}
                />
                <span className="text-sm font-medium text-brand">Store Drop-off</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral600">Fee</span>
                <input
                  type="number"
                  placeholder="e.g. 0"
                  {...register("storeDropoffFee")}
                  disabled={!watch("storeDropoffEnabled")}
                  onKeyDown={allowOnlyNumbers}
                  className="w-24 border-b border-neutral300 outline-none py-1 px-1 text-sm disabled:opacity-40"
                />
              </div>
            </div>
          </div>

          {/* SLA Configs */}
          <p className="font-semibold text-brand mt-2">SLA Configs</p>

          <CustomInput
            inputType="select"
            label="Add Service Level"
            placeholder="Select a service level to add"
            value={selectedSlaId}
            options={availableSlaOptions}
            onValueChange={(val) => {
              setSelectedSlaId(val);
              addSlaEntry(val);
            }}
          />

          {slaError && <p className="text-xs text-red-500">{slaError}</p>}

          {slaEntries.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-2 bg-brand-light px-3 py-2 text-xs font-semibold text-brand">
                <span>Service Level</span>
                <span>Multiplier</span>
                <span>Min Days</span>
                <span>Max Days</span>
                <span>Active</span>
                <span></span>
              </div>
              {slaEntries.map((entry) => (
                <div
                  key={entry.serviceLevelId}
                  className={`grid grid-cols-[2fr_1fr_1fr_1fr_auto_auto] gap-2 px-3 py-2 border-t items-center text-sm ${!entry.isActive ? "opacity-50" : ""}`}
                >
                  <span className="font-medium truncate">{entry.serviceLevelName}</span>
                  <input
                    type="text"
                    value={entry.multiplier}
                    onKeyDown={allowOnlyNumbers}
                    onChange={(e) => updateSlaField(entry.serviceLevelId, "multiplier", e.target.value)}
                    className="border-b outline-none py-1 w-full"
                    disabled={!entry.isActive}
                  />
                  <input
                    type="text"
                    value={entry.minDeliveryDays}
                    onKeyDown={allowOnlyNumbers}
                    onChange={(e) => updateSlaField(entry.serviceLevelId, "minDeliveryDays", e.target.value)}
                    className="border-b outline-none py-1 w-full"
                    disabled={!entry.isActive}
                  />
                  <input
                    type="text"
                    value={entry.maxDeliveryDays}
                    onKeyDown={allowOnlyNumbers}
                    onChange={(e) => updateSlaField(entry.serviceLevelId, "maxDeliveryDays", e.target.value)}
                    className="border-b outline-none py-1 w-full"
                    disabled={!entry.isActive}
                  />
                  <Switch
                    checked={entry.isActive}
                    onCheckedChange={(val) => updateSlaField(entry.serviceLevelId, "isActive", val)}
                    title={entry.isActive ? "Disable SLA" : "Enable SLA"}
                  />
                  <button
                    type="button"
                    onClick={() => removeSlaEntry(entry.serviceLevelId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="secondary"
            className="w-fit bg-brand mt-2"
            loading={type === "create" ? pendingCreate : pendingUpdate}
          >
            {type === "create" ? "Add Route" : "Save Changes"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
