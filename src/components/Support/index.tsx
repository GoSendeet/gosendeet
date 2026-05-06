import openWhatsAppSupport from "@/lib/openWhatsAppSupport";
import { Button } from "../ui/button";

const ContactSupport = () => {
  return (
    <Button
      variant={"secondary"}
      className="w-fit"
      onClick={() => openWhatsAppSupport()}
    >
      WhatsApp Support
    </Button>
  );
};

export default ContactSupport;
