import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbLockPassword } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { resetPassword } from "@/services/auth";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {Check} from 'lucide-react'
const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resetToken = queryParams.get("resetToken") || "";
  const [isSuccess, setIsSuccess] = useState(false);

  const [toggle, setToggle] = useState(false);

  const schema = z
    .object({
      password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),
      confirmPassword: z
        .string({ required_error: "Please confirm your password" })
        .min(8, { message: "Password must be at least 8 characters" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"], // Error will show on confirmPassword field
      message: "Passwords do not match",
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success("Successful");
      setIsSuccess(true);
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutate({
      resetToken,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <AuthLayout>
      <div className="md:px-20 px-6 md:py-20 py-8">
        <div className="xl:w-1/2 md:w-[80%] mx-auto bg-neutral900 py-12 md:px-10 px-4">
          {isSuccess ? (
            // ✅ Success Screen
            <div className="flex flex-col justify-center items-center text-center min-h-[350px] my-auto">
              <div className="bg-green500 w-20 h-20 mx-auto flex rounded-full font-bold justify-center items-center text-white">
            <Check size={40}/>
              </div>
              <h1 className="text-2xl text-neutral600 font-semibold font-inter tracking-tight my-3">
                Password reset was successful!
              </h1>
              <p className="text-neutral600 lg:w-3/4">
                You have successfully reset password for your account
              </p>
              <Link to={"/signin"}>
                <Button className="mt-6 bg-green500 hover:bg-green800">Proceed to Login</Button>
              </Link>
            </div>
          ) : (
            <>
              <h1 className="lg:text-[40px] text-[30px] font-semibold font-inter tracking-tight mb-1">
                Choose a Password
              </h1>
              <p className="font-medium text-neutral800">
                Your new password must be different from previous used
                passwords.{" "}
              </p>

              <div className="py-4 text-sm mt-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                    <TbLockPassword className="text-green500 text-2xl" />
                    <div className="flex flex-col gap-2 w-full">
                      <label
                        htmlFor="password"
                        className="font-inter tracking-tight font-semibold"
                      >
                        Create Your Password
                      </label>
                      <div className="flex justify-between gap-2">
                        <input
                          type={toggle ? "text" : "password"}
                          {...register("password")}
                          placeholder="********"
                          className="w-full outline-0 border-b-0"
                        />

                        <span
                          className="cursor-pointer text-green500 text-xl"
                          onClick={() => setToggle(!toggle)}
                        >
                          {toggle ? <FaRegEye /> : <FaRegEyeSlash />}
                        </span>
                      </div>
                      {errors.password && (
                        <p className="error text-xs text-[#FF0000]">
                          {errors.password.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                    <TbLockPassword className="text-green500 text-2xl" />
                    <div className="flex flex-col gap-2 w-full">
                      <label
                        htmlFor="confirmPassword"
                        className="font-inter tracking-tight font-semibold"
                      >
                        Confirm Password
                      </label>
                      <div className="flex justify-between gap-2">
                        <input
                          type={toggle ? "text" : "password"}
                          {...register("confirmPassword")}
                          placeholder="********"
                          className="w-full outline-0 border-b-0"
                        />

                        <span
                          className="cursor-pointer text-green500 text-xl"
                          onClick={() => setToggle(!toggle)}
                        >
                          {toggle ? <FaRegEye /> : <FaRegEyeSlash />}
                        </span>
                      </div>
                      {errors.confirmPassword && (
                        <p className="error text-xs text-[#FF0000]">
                          {errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    className=" w-full my-1 bg-green100 hover:bg-green800"
                    loading={isPending}
                  >
                    Reset Password
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
