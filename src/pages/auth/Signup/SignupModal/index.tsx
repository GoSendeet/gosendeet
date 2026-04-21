import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

export function SignupModal({
  open,
  setOpen,
  email,
}: {
  open: boolean;
  setOpen: any;
  email: string;
}) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] font-semibold font-inter mb-2">
          Thanks for signing up!
        </DialogTitle>
        <DialogDescription className="font-semibold text-sm text-black">
          You're Almost In!
        </DialogDescription>
        <>
          <div className="py-4 text-sm">
            <p className="mb-2">
              We’ve just sent a verification link to <b>{email}</b>.
            </p>
            <p className="mb-4">
              Please check your inbox (and your spam folder, just in case) and
              click the link to verify your email and complete your
              registration.
            </p>
          </div>

          <Button
            variant={"secondary"}
            className="w-fit mb-2"
            onClick={() => {
              setOpen(false);
              navigate("/signin", { replace: true });
            }}
          >
            Continue
          </Button>
        </>
      </DialogContent>
    </Dialog>
  );
}
