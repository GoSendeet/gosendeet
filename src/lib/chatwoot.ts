export const openChatwootWidget = (): boolean => {
  if (typeof window === "undefined") return false;

  const chatwoot = (window as any).$chatwoot;
  if (!chatwoot) return false;

  try {
    // Make sure the widget is visible before opening.
    if (typeof chatwoot.show === "function") {
      chatwoot.show();
    }

    if (typeof chatwoot.toggle === "function") {
      chatwoot.toggle("open");
      return true;
    }

    if (typeof chatwoot.open === "function") {
      chatwoot.open();
      return true;
    }
  } catch {
    return false;
  }

  return false;
};
