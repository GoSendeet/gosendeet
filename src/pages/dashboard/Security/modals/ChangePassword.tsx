import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { changePassword } from "@/services/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

const schema = z
  .object({
    currentPassword: z
      .string({ required_error: "Current password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    password: z
      .string({ required_error: "New password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z
      .string({ required_error: "Please confirm your password" })
      .min(8, { message: "Password must be at least 8 characters" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

const emptyValues = { currentPassword: "", password: "", confirmPassword: "" };

const PasswordField = ({
  label,
  placeholder,
  error,
  registration,
}: {
  label: string;
  placeholder: string;
  error?: string;
  registration: any;
}) => {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-neutral500">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-neutral200 bg-neutral50 px-3 py-2.5 focus-within:border-brand transition-colors">
        <input
          type={show ? "text" : "password"}
          {...registration}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral400"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="shrink-0 text-neutral400 hover:text-brand transition-colors"
        >
          {show ? <FaRegEye size={16} /> : <FaRegEyeSlash size={16} />}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export function ChangePassword() {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
      setOpen(false);
      reset(emptyValues);
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutate({
      oldPassword: data.currentPassword,
      newPassword: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) reset(emptyValues);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="bg-brand text-white text-sm">
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="gap-0 max-w-md">
        <DialogTitle className="text-lg font-bold font-clash text-brand mb-1">
          Change Your Password
        </DialogTitle>
        <DialogDescription className="text-sm text-neutral500 mb-6">
          Enter your current password then choose a new one.
        </DialogDescription>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <PasswordField
            label="Current Password"
            placeholder="Enter your current password"
            registration={register("currentPassword")}
            error={errors.currentPassword?.message}
          />
          <PasswordField
            label="New Password"
            placeholder="At least 8 characters"
            registration={register("password")}
            error={errors.password?.message}
          />
          <PasswordField
            label="Confirm New Password"
            placeholder="Repeat your new password"
            registration={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              className="flex-1 bg-brand text-white"
              loading={isPending}
            >
              Update Password
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
