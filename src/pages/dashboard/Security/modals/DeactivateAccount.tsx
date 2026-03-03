import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { activateAccount } from "@/services/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export function DeactivateAccount() {
  const [open, setOpen] = useState(false);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: activateAccount,
    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"} className="w-fit bg-brand">Deactivate my account</Button>
      </DialogTrigger>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] font-semibold font-clash mb-2">
          Deactivate Account?
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          Removes your account giving you a chance to reactivate it when you
          want{" "}
        </DialogDescription>
        <>
          <div className="py-4 text-sm">
            <p className="text-neutral600 mt-2 mb-8">
              By clicking “Deactivate”, you agree with GoSendeet{" "}
              <span className="text-purple500">terms</span> for account
              deactivation
            </p>

            <Button
              variant={"secondary"}
              className=" w-fit"
              loading={isPending}
              onClick={() => mutate("inactive")}
            >
              Deactivate
            </Button>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
