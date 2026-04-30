import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { MdOutlineMailOutline } from "react-icons/md";
import { FiEye, FiEyeOff } from "react-icons/fi";

import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { storeAuthSession } from "@/lib/authSession";
import { getDefaultRouteForRole } from "@/lib/roles";
import { login } from "@/services/auth";

const schema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(1, { message: "Password cannot be empty" }),
});

type LoginFormValues = z.infer<typeof schema>;

type LoginState = {
  email?: string;
  username?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const state = (location.state ?? {}) as LoginState;

  const email = useMemo(() => state.email ?? "", [state.email]);
  const username = useMemo(() => state.username ?? "", [state.username]);

  useEffect(() => {
    if (!email) {
      navigate("/signin", { replace: true });
    }
  }, [email, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginFormValues) => login({ email, password: data.password }),
    onSuccess: (response) => {
      const user = response?.data?.user;
      if (!user) {
        toast.error("Invalid login response");
        return;
      }

      storeAuthSession(user);

      toast.success("Login Successful");
      navigate(getDefaultRouteForRole(user.role));
    },
    onError: (error: { message?: string }) => {
      toast.error(error?.message || "Login failed");
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <AuthLayout>
      <div className="md:px-20 px-6 md:py-20 py-8">
        <div className="xl:w-1/2 md:w-[80%] mx-auto bg-neutral900 py-12 md:px-10 px-4 rounded-3xl">
          <h1 className="lg:text-[40px] text-[30px] font-semibold font-inter mb-1 tracking-tight">
            Welcome back
          </h1>
          <p className="font-medium text-neutral800">
            Enter your password to continue
          </p>

          <div className="py-8 text-sm">
            <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
              <MdOutlineMailOutline className="text-green500 text-xl" />
              <div className="flex flex-col gap-1 w-full">
                <label htmlFor="email" className="font-inter font-semibold">
                  Email Address
                </label>
                <p className="text-neutral800 break-all">{email}</p>
                {username ? (
                  <p className="text-xs text-neutral800">Signing in as {username}</p>
                ) : null}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="password" className="font-inter font-semibold">
                    Password
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter your password"
                      className="w-full outline-0 bg-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="text-green500"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {errors.password ? (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.password.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <Link
                to="/forgot-password"
                className="text-green500 border-b border-b-green500 text-base"
              >
                Forgot Password?
              </Link>

              <Button loading={isPending} className="w-full my-5 bg-green100 hover:bg-green800">
                Login
              </Button>
            </form>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
