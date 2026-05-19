import { useEffect, useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import {
  useGetFranchiseAlertPreferences,
  useUpdateFranchiseAlertPreferences,
} from "@/queries/franchise/useFranchiseSettings";

// ─── Types ────────────────────────────────────────────────────────────────────

type AlertsFormValues = {
  pushNotifications:  boolean;
  smsNotifications:   boolean;
  emailNotifications: boolean;
  assignmentAlerts:   boolean;
  settlementUpdates:  boolean;
  qualityAlerts:      boolean;
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
    assignmentAlerts:   true,
    settlementUpdates:  true,
    qualityAlerts:      true,
  },
}: AlertsTabProps) {
  const { data: alertPreferences } = useGetFranchiseAlertPreferences();
  const { mutate, isPending, isSuccess } = useUpdateFranchiseAlertPreferences();
  const [form, setForm] = useState<AlertsFormValues>({
    pushNotifications:  defaultValues.pushNotifications  ?? true,
    smsNotifications:   defaultValues.smsNotifications   ?? false,
    emailNotifications: defaultValues.emailNotifications ?? true,
    assignmentAlerts:   defaultValues.assignmentAlerts    ?? true,
    settlementUpdates:  defaultValues.settlementUpdates   ?? true,
    qualityAlerts:      defaultValues.qualityAlerts       ?? true,
  });

  useEffect(() => {
    if (!alertPreferences) return;
    setForm(alertPreferences);
  }, [alertPreferences]);

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
          enabled={form.assignmentAlerts}
          onChange={() => toggle("assignmentAlerts")}
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
          disabled={isPending || isSuccess}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200
            ${isSuccess
              ? "bg-emerald-400 cursor-default"
              : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60"
            }`}
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : isSuccess ? (
            <CheckCircle size={15} />
          ) : (
            <Save size={15} />
          )}
          {isPending ? "Saving..." : isSuccess ? "Saved!" : "Save Preferences"}
        </button>
      </div>
    </div>
  );
}
