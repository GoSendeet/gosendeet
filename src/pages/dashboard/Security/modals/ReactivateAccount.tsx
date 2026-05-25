import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiUserCheck } from "react-icons/fi";
import { activateAccount } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function ReactivateAccount() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: activateAccount,
    onSuccess: () => {
      toast.success("Account reactivated");
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="bg-brand text-white text-sm">
          Reactivate
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0FDF4] text-brand">
            <FiUserCheck size={18} />
          </span>
          <DialogTitle className="text-lg font-bold font-clash text-neutral800">
            Reactivate Account?
          </DialogTitle>
        </div>
        <DialogDescription className="text-sm text-neutral500 mb-4">
          Your account will be fully restored. You'll regain access to all platform features immediately.
        </DialogDescription>

        <p className="text-xs text-neutral400 mb-6">
          By confirming, you agree to GoSendeet's{" "}
          <span className="text-brand underline cursor-pointer">terms</span> for account reactivation.
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="secondary"
            className="flex-1 bg-brand text-white"
            loading={isPending}
            onClick={() => mutate("active")}
          >
            Yes, Reactivate
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
