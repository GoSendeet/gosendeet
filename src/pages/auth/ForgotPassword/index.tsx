import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdOutlineMailOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "@/services/auth";
import { toast } from "sonner";
import { ResetPasswordModal } from "./ResetPasswordModal";
import { useState } from "react";

const ForgotPassword = () => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const schema = z.object({
    email: z
      .string({ required_error: "Email Address is required" })
      .min(1, { message: "Email Address cannot be empty" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      setOpen(true);
      reset();
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    setEmail(data.email);
    mutate(data.email);
  };

  return (
    <AuthLayout>
      <div className="md:px-20 px-6 md:py-20 py-8">
        <div className="xl:w-1/2 md:w-[80%] mx-auto bg-neutral900 py-12 md:px-10 px-4">
          <h1 className="lg:text-[40px] text-[30px] font-semibold font-inter tracking-tight mb-1">
            Reset your password
          </h1>
          <p className="font-medium text-neutral800 lg:w-[90%]">
            Please enter your email and we'll send you a password reset link if
            your account is found active
          </p>

          <div className="py-4 text-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                <MdOutlineMailOutline className="text-green500 text-xl" />
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="email" className="font-inter tracking-tight font-semibold">
                    Email Address
                  </label>
                  <input
                    type="text"
                    {...register("email")}
                    placeholder="Enter your email address"
                    className="w-full outline-0"
                  />
                  {errors.email && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                className=" w-full my-5 bg-green100 hover:bg-green800"
                loading={isPending}
              >
                Get reset link
              </Button>
            </form>
          </div>
          <p className="font-medium text-neutral500 text-center lg:text-base text-sm">
            By continuing, you accept our{" "}
            <span className="border-b border-b-neutral800">Terms of Use</span>{" "}
            and{" "}
            <span className="border-b border-b-neutral800">Privacy Policy</span>
          </p>
        </div>
      </div>

      <ResetPasswordModal open={open} setOpen={setOpen} email={email} />
    </AuthLayout>
  );
};

export default ForgotPassword;
