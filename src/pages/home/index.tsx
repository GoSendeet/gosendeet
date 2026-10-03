import { useState } from "react";
import Layout from "@/layouts/HomePageLayout";
import PageMeta from "@/components/PageMeta";
import type { FormMode } from "@/components/ModeSwitcher";
import Header from "./Header";
import LandingSections from "./LandingSections";
import "./landing.css";

export default function Home() {
  const [mode, setMode] = useState<FormMode>("compare");
  const startQuote = () => {
    setMode("compare");
    requestAnimationFrame(() => {
      document.getElementById("delivery-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
      document.getElementById("compare-pickup-location-input")?.focus({ preventScroll: true });
    });
  };
  return (
    <div className="landing-page">
      <PageMeta title="GoSendeet | Courier & Delivery Service in Nigeria"
        description="Compare courier prices or book a direct pickup across Lagos and Ibadan. Get delivery quotes and follow your parcel's progress."
        path="/" />
      <Layout>
        <Header mode={mode} onModeChange={setMode} />
        <LandingSections onStartQuote={startQuote} />
      </Layout>
    </div>
  );
}
