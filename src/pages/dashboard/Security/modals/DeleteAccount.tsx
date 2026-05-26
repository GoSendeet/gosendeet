import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiAlertTriangle } from "react-icons/fi";
import { deleteAccount } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function DeleteAccount() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      toast.success("Account deleted");
      localStorage.clear();
      navigate("/signin");
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="text-sm">
          Delete Account
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 max-w-md">
        <div className="flex items-center gap-3 mb-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <FiAlertTriangle size={18} />
          </span>
          <DialogTitle className="text-lg font-bold font-clash text-red-600">
            Delete Account?
          </DialogTitle>
        </div>
        <DialogDescription className="text-sm text-neutral500 mb-4">
          This will <strong>permanently</strong> remove your account and all associated data from GoSendeet. This action cannot be undone.
        </DialogDescription>

        <p className="text-xs text-neutral400 mb-6">
          By confirming, you agree to GoSendeet's{" "}
          <span className="text-brand underline cursor-pointer">terms</span> for account deletion.
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
            variant="destructive"
            className="flex-1"
            loading={isPending}
            onClick={() => mutate()}
          >
            Yes, Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
