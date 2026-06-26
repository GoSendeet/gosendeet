import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export function ResetPasswordModal({
  open,
  setOpen,
  email,
}: {
  open: boolean;
  setOpen: any;
  email: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] font-semibold font-clash mb-2">
          Password Reset!
        </DialogTitle>
        <DialogDescription className="font-semibold text-sm text-black hidden">
          You're Almost In!
        </DialogDescription>
        <>
          <div className="py-4 text-sm">
            <p className="mb-2">
              If an active account exists for <b>{email}</b>, we’ll send a
              password reset link to that inbox.
            </p>
            <p className="mb-4">
              Please check your inbox and spam folder. If you do not receive an
              email, confirm the address or create an account.
            </p>
          </div>

          <Button
            variant={"secondary"}
            className="w-fit mb-2"
            onClick={() => setOpen(false)}
          >
            Continue
          </Button>
        </>
      </DialogContent>
    </Dialog>
  );
}
