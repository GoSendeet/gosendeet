import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertsFormValues = {
  pushNotifications:  boolean;
  smsNotifications:   boolean;
  emailNotifications: boolean;
  newAssignments:     boolean;
  settlementUpdates:  boolean;
  qualityAlerts:      boolean;
};


// ─── Mock useMutation (swap with react-query when backend is ready) ───────────

const useUpdateAlerts = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const mutate = async (data: AlertsFormValues) => {
    setIsLoading(true);
    // TODO: replace with real API call e.g:
    // await axios.put("/api/partner/alert-preferences", data)
    console.log("📤 Saving alert preferences:", data);
    await new Promise((r) => setTimeout(r, 700));
    console.log("✅ Alert preferences saved");
    setIsLoading(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  return { mutate, isLoading, isSuccess };
};


// ─── Toggle component ─────────────────────────────────────────────────────────

const Toggle = ({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (val: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors duration-200 shrink-0 focus:outline-none
      ${enabled ? "bg-gray-800" : "bg-gray-300"}`}
  >
    <span
      className={`inline-block w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200
        ${enabled ? "translate-x-6" : "translate-x-1"}`}
    />
  </button>
);


// ─── Section row ──────────────────────────────────────────────────────────────

const ToggleRow = ({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: (val: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div className="flex flex-col gap-0.5">
      <p className="text-sm font-semibold text-gray-800">{label}</p>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
    <Toggle enabled={enabled} onChange={onChange} />
  </div>
);

// ─── Section card ─────────────────────────────────────────────────────────────

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
    <h3 className="text-sm font-bold text-gray-800 mb-1">{title}</h3>
    <div className="divide-y divide-gray-100">{children}</div>
  </div>
);


type AlertsTabProps = {
  defaultValues?: Partial<AlertsFormValues>;
};

export default function AlertTab({
  defaultValues = {
    pushNotifications:  true,
    smsNotifications:   false,
    emailNotifications: true,
    newAssignments:     true,
    settlementUpdates:  true,
    qualityAlerts:      true,
  },
}: AlertsTabProps) {
  const [form, setForm] = useState<AlertsFormValues>({
    pushNotifications:  defaultValues.pushNotifications  ?? true,
    smsNotifications:   defaultValues.smsNotifications   ?? false,
    emailNotifications: defaultValues.emailNotifications ?? true,
    newAssignments:     defaultValues.newAssignments      ?? true,
    settlementUpdates:  defaultValues.settlementUpdates   ?? true,
    qualityAlerts:      defaultValues.qualityAlerts       ?? true,
  });

  const { mutate, isLoading, isSuccess } = useUpdateAlerts();

  const toggle = (key: keyof AlertsFormValues) =>
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => mutate(form);

  return (
    <div className="flex flex-col gap-4">
      {/* Notification Channels */}
      <Section title="Notification Channels">
        <ToggleRow
          label="Push Notifications"
          description="Receive alerts on your device"
          enabled={form.pushNotifications}
          onChange={() => toggle("pushNotifications")}
        />
        <ToggleRow
          label="SMS Notifications"
          description="Get text messages for critical alerts"
          enabled={form.smsNotifications}
          onChange={() => toggle("smsNotifications")}
        />
        <ToggleRow
          label="Email Notifications"
          description="Weekly summaries and settlements"
          enabled={form.emailNotifications}
          onChange={() => toggle("emailNotifications")}
        />
      </Section>

      {/* Alert Preferences */}
      <Section title="Alert Preferences">
        <ToggleRow
          label="New Assignments"
          description="When new deliveries are assigned"
          enabled={form.newAssignments}
          onChange={() => toggle("newAssignments")}
        />
        <ToggleRow
          label="Settlement Updates"
          description="Payment and payout notifications"
          enabled={form.settlementUpdates}
          onChange={() => toggle("settlementUpdates")}
        />
        <ToggleRow
          label="Quality Alerts"
          description="Ratings and feedback notifications"
          enabled={form.qualityAlerts}
          onChange={() => toggle("qualityAlerts")}
        />
      </Section>

      {/* Save */}
      <div>
        <button
          onClick={handleSave}
          disabled={isLoading || isSuccess}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200
            ${isSuccess
              ? "bg-emerald-400 cursor-default"
              : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60"
            }`}
        >
          {isLoading ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : isSuccess ? (
            <CheckCircle size={15} />
          ) : (
            <Save size={15} />
          )}
          {isLoading ? "Saving…" : isSuccess ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
