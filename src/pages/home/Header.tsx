import FormHorizontalBar from "./components/FormHorizontalBar";
import type { FormMode } from "@/components/ModeSwitcher";
import DeliveryFormModeSwitcher from "./components/DeliveryFormModeSwitcher";

interface HeaderProps {
  mode: FormMode;
  onModeChange: (mode: FormMode) => void;
}

export default function Header({ mode, onModeChange }: HeaderProps) {
  return (
    <section className="landing-header" aria-labelledby="landing-heading">
      <div className="landing-hero">
        <img src="/images/landing/hero.webp" alt="" className="landing-hero-photo" fetchPriority="high" />
        <div className="landing-shell landing-hero-copy">
          <h1 id="landing-heading">A simpler way<br /><span>to send.</span></h1>
          <p>Compare delivery prices in one place. Choose a courier,<br className="landing-desktop-break" /> book your delivery and follow its progress.</p>
        </div>
      </div>
      <div className="landing-shell landing-booking-wrap" id="delivery-form">
        <div className="landing-booking-panel">
          <DeliveryFormModeSwitcher mode={mode} onModeChange={onModeChange} />
          <FormHorizontalBar variant="minimal" appearance="landing" activeMode={mode} autoFocusPickup />
        </div>
      </div>
    </section>
  );
}
