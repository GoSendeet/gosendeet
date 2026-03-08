import { useEffect } from "react";

const BASE_URL = import.meta.env.VITE_CHATWOOT_BASE_URL || "https://backoffice-customer-support.gosendeet.com";
const WEBSITE_TOKEN = import.meta.env.VITE_CHATWOOT_WEBSITE_TOKEN || "eyUmt8EsXQsDgRVdgQ1w6wum";

export default function ChatwootWidget() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${BASE_URL}/packs/js/sdk.js`;
    script.async = true;
    script.onload = () => {
      (window as any).chatwootSDK.run({
        websiteToken: WEBSITE_TOKEN,
        baseUrl: BASE_URL,
      });
    };
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}
