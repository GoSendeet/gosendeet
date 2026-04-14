import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

type ContactSalesDialogProps = {
  triggerLabel?: string;
  triggerClassName?: string;
};

const ContactSalesDialog = ({
  triggerLabel = "Contact Sales",
  triggerClassName,
}: ContactSalesDialogProps) => {
  const [open, setOpen] = useState(false);
  const salesEmail = "info@gosendeet.com";
  const emailSubject = "Inquiry";
  const emailBody = "Hello, I would like to know more about your services.";
  const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    salesEmail,
  )}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
    emailBody,
  )}`;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(salesEmail);
      toast.success("Email address copied");
    } catch {
      toast.error("Unable to copy email. Please copy it manually.");
    }
  };

  const handleOpenGmail = () => {
    window.open(gmailComposeUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <button
        type="button"
        className={cn(
          "inline bg-transparent border-0 p-0 text-left cursor-pointer",
          triggerClassName,
        )}
        onClick={() => setOpen(true)}
      >
        {triggerLabel}
      </button>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-blue100">Contact Sales</DialogTitle>
        <DialogDescription>
          Continue with Gmail to send your message. If Gmail is not available,
          copy our email address and send from any provider.
        </DialogDescription>
        <div className="rounded-lg border border-grey200 bg-[#F8FAFC] p-4 text-sm text-blue100">
          <p className="font-semibold">Sales Email</p>
          <p className="break-all">{salesEmail}</p>
        </div>
        <DialogFooter className="gap-3 sm:flex-col sm:items-stretch">
          <Button className="w-full bg-brand" onClick={handleOpenGmail}>
            Open Gmail Compose
          </Button>
          <Button variant="outline" className="w-full" onClick={handleCopyEmail}>
            Copy Email Address
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactSalesDialog;
