import { Spinner } from "@/components/Spinner";
import { useGetRoutingConfig, useUpdateRoutingConfig } from "@/queries/admin/useGetAdminSettings";
import { CheckCircle, MapPin, Save } from "lucide-react";
import { useEffect, useState } from "react";

type FormState = {
  offerTimeoutSeconds: number;
  maxAttempts: number;
  heartbeatTimeoutMinutes: number;
  weightOnTimeRate: number;
  weightAcceptanceRate: number;
  weightLoadPenalty: number;
  weightProximity: number;
  proximityReferenceKm: number;
};

const DEFAULT: FormState = {
  offerTimeoutSeconds: 240,
  maxAttempts: 5,
  heartbeatTimeoutMinutes: 5,
  weightOnTimeRate: 0.4,
  weightAcceptanceRate: 0.3,
  weightLoadPenalty: 0.3,
  weightProximity: 0,
  proximityReferenceKm: 50,
};

const WeightRow = ({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  onChange: (v: number) => void;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{hint}</p>
      </div>
      <span className="text-sm font-semibold text-brand w-10 text-right">
        {value.toFixed(2)}
      </span>
    </div>
    <input
      type="range"
      min={0}
      max={1}
      step={0.05}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-emerald-500"
    />
  </div>
);

const RoutingConfig = () => {
  const { data, isLoading, isError } = useGetRoutingConfig();
  const { mutate: save, isPending: isSaving, isSuccess } = useUpdateRoutingConfig();

  const [form, setForm] = useState<FormState>(DEFAULT);
  const [proximityEnabled, setProximityEnabled] = useState(false);

  useEffect(() => {
    if (!data) return;
    setForm({
      offerTimeoutSeconds: data.offerTimeoutSeconds ?? DEFAULT.offerTimeoutSeconds,
      maxAttempts: data.maxAttempts ?? DEFAULT.maxAttempts,
      heartbeatTimeoutMinutes: data.heartbeatTimeoutMinutes ?? DEFAULT.heartbeatTimeoutMinutes,
      weightOnTimeRate: Number(data.weightOnTimeRate) || DEFAULT.weightOnTimeRate,
      weightAcceptanceRate: Number(data.weightAcceptanceRate) || DEFAULT.weightAcceptanceRate,
      weightLoadPenalty: Number(data.weightLoadPenalty) || DEFAULT.weightLoadPenalty,
      weightProximity: Number(data.weightProximity) || 0,
      proximityReferenceKm: data.proximityReferenceKm ?? DEFAULT.proximityReferenceKm,
    });
    setProximityEnabled(Number(data.weightProximity) > 0);
  }, [data]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleProximityToggle = (enabled: boolean) => {
    setProximityEnabled(enabled);
    if (!enabled) set("weightProximity", 0);
    else if (form.weightProximity === 0) set("weightProximity", 0.2);
  };

  const handleSave = () => {
    save({
      ...form,
      weightProximity: proximityEnabled ? form.weightProximity : 0,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500 py-8 text-center">
        Failed to load routing settings. Please refresh and try again.
      </p>
    );
  }

  return (
    <div className="max-w-full space-y-8">

      {/* Proximity toggle — top of page, most important */}
      <div className="p-5 rounded-2xl border border-emerald-100 bg-emerald-50">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-emerald-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Route orders to the nearest franchise
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                When enabled, the system will prefer franchise partners whose business
                address is closest to the pickup location. Pairs well with the other
                scoring factors below.
              </p>
            </div>
          </div>
          {/* Toggle switch */}
          <button
            type="button"
            onClick={() => handleProximityToggle(!proximityEnabled)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ${
              proximityEnabled ? "bg-emerald-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                proximityEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {proximityEnabled && (
          <div className="mt-4 pt-4 border-t border-emerald-100">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Reference distance</p>
                  <p className="text-xs text-gray-400">
                    Franchises within this radius score highest for proximity
                  </p>
                </div>
                <span className="text-sm font-semibold text-brand">
                  {form.proximityReferenceKm} km
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={200}
                step={5}
                value={form.proximityReferenceKm}
                onChange={(e) => set("proximityReferenceKm", parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>5 km</span>
                <span>200 km</span>
              </div>
            </div>

            <div className="mt-4">
              <WeightRow
                label="Proximity weight"
                hint="How much proximity influences the final franchise score"
                value={form.weightProximity}
                onChange={(v) => set("weightProximity", v)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Offer timeout */}
      <div className="space-y-4">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          Offer timing
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Offer window (seconds)
            </label>
            <p className="text-xs text-gray-400">
              How long a franchise has to accept an order before the system moves on
            </p>
            <input
              type="number"
              min={60}
              max={600}
              value={form.offerTimeoutSeconds}
              onChange={(e) => set("offerTimeoutSeconds", parseInt(e.target.value) || 60)}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">
              Heartbeat threshold (minutes)
            </label>
            <p className="text-xs text-gray-400">
              A franchise is considered offline if no activity is seen within this window
            </p>
            <input
              type="number"
              min={1}
              max={60}
              value={form.heartbeatTimeoutMinutes}
              onChange={(e) => set("heartbeatTimeoutMinutes", parseInt(e.target.value) || 1)}
              className="mt-1 w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Scoring weights */}
      <div className="space-y-5">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Scoring weights
          </p>
          <p className="text-xs text-gray-400 mt-1">
            These control how much each factor influences which franchise gets the order.
            Higher weight = more influence.
          </p>
        </div>
        <WeightRow
          label="On-time delivery rate"
          hint="Franchises with better delivery records score higher"
          value={form.weightOnTimeRate}
          onChange={(v) => set("weightOnTimeRate", v)}
        />
        <WeightRow
          label="Acceptance rate"
          hint="Franchises that regularly accept offers score higher"
          value={form.weightAcceptanceRate}
          onChange={(v) => set("weightAcceptanceRate", v)}
        />
        <WeightRow
          label="Load penalty"
          hint="Franchises with fewer active deliveries score higher"
          value={form.weightLoadPenalty}
          onChange={(v) => set("weightLoadPenalty", v)}
        />
      </div>

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
          isSuccess
            ? "bg-emerald-400 cursor-default"
            : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        }`}
      >
        {isSuccess ? <CheckCircle size={15} /> : <Save size={15} />}
        {isSaving ? "Saving..." : isSuccess ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
};

export default RoutingConfig;
