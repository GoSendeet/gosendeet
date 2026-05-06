const SUPPORT_NUMBER = import.meta.env.VITE_SUPPORT_WHATSAPP ?? "";

/**
 * Opens WhatsApp on the user's device pointed at the GoSendeet support number.
 * Works on mobile (native app) and desktop (web.whatsapp.com).
 *
 * @param message - Optional pre-filled message to send to support.
 */
const openWhatsAppSupport = (message?: string) => {
  if (!SUPPORT_NUMBER) {
    console.warn("VITE_SUPPORT_WHATSAPP is not set in .env");
    return;
  }

  const query = message ? `?text=${encodeURIComponent(message)}` : "";
  window.open(`https://wa.me/${SUPPORT_NUMBER}${query}`, "_blank", "noopener,noreferrer");
};

export default openWhatsAppSupport;
