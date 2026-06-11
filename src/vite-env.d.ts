/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_MAPS_KEY: string;
  readonly VITE_APP_ENV?: string;
  readonly VITE_ENABLE_GOOGLE_AUTH?: string;
  readonly VITE_SUPPORT_WHATSAPP?: string;
  readonly VITE_POSTHOG_KEY?: string;
  readonly VITE_POSTHOG_HOST?: string;
  readonly VITE_SHOW_FRANCHISE_FORM?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
