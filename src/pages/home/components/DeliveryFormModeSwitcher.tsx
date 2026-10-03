import ModeSwitcher, { type FormMode, type ModeTab } from "@/components/ModeSwitcher";
import { FiMapPin, FiTruck } from "react-icons/fi";
import "./quote-form/appearance.css";

const tabs: ModeTab[] = [
  { key: "compare", label: "Compare prices", icon: FiTruck },
  { key: "tracking", label: "Track a delivery", icon: FiMapPin },
];

export default function DeliveryFormModeSwitcher({ mode, onModeChange }: {
  mode: FormMode;
  onModeChange: (mode: FormMode) => void;
}) {
  return <ModeSwitcher mode={mode} onModeChange={onModeChange} variant="landing" tabs={tabs} />;
}
