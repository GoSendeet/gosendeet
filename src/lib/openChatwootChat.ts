import { type MouseEvent } from "react";
import { openChatwootWidget } from "./chatwoot";
import { toast } from "sonner";
 
 const openChatwootChat = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const opened = openChatwootWidget();
    if (!opened) {
      toast.info("Support chat is still loading. Please try again in a moment.");
    }
  };

export default openChatwootChat;