import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";
import { toast } from "sonner";

const Login = () => {
  const [toggle, setToggle] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { username, email } = location.state || {};

  const schema = z.object({
    email: z
      .string({ required_error: "Email address is required" })
      .min(1, { message: "Email address cannot be empty" })
      .email({ message: "Invalid email address" }),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters" }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const isUnauthenticated =
        sessionStorage.getItem("unauthenticated") === "true";

      sessionStorage.setItem("authToken", data.data.token);
      sessionStorage.setItem("userId", data.data.user.id);
      sessionStorage.setItem("role", data.data.user.role);
      sessionStorage.setItem("sessionExpired", "false");
      toast.success("Login Successful");
      if (isUnauthenticated) {
        navigate("/cost-calculator");
      } else {
        data.data.user.role === "user" && navigate("/dashboard");
        data.data.user.role === "super_admin" && navigate("/admin-dashboard");
      }
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutate(data);
  };

  return (
    <AuthLayout>
      <div className="md:px-20 px-6 md:py-20 py-8">
        <div className="xl:w-1/2 md:w-[80%] mx-auto bg-neutral900 py-12 md:px-10 px-4 rounded-3xl">
          <h1 className="lg:text-[40px] text-[30px] font-semibold font-inter mb-1 tracking-tight">
            Welcome {username}
          </h1>
          <Link
            to={"/signin"}
            className="text-green500 border-b border-b-green500 text-base"
          >
            Not you?
          </Link>

          <div className="py-4 text-sm mt-8">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                <MdOutlineMailOutline className="text-green500 text-2xl" />
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="email" className="font-inter font-semibold">
                    Email Address
                  </label>
                  <input
                    type="text"
                    {...register("email")}
                    value={email}
                    disabled={true}
                    placeholder="Enter your email address"
                    className="w-full outline-0 cursor-not-allowed text-gray-600"
                  />
                  {errors.email && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                <TbLockPassword className="text-green500 text-2xl" />
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="password"
                    className="font-inter font-semibold"
                  >
                    Your Password
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

              <div className="flex items-center justify-between lg:text-base text-xs">
                {/* <div className="flex items-center md:gap-2 gap-1">
                  <input type="checkbox" name="" id="" className="mt-[1px]" />
                  <span>Remember me</span>
                </div> */}

                <Link
                  to={"/forgot-password"}
                  className="text-green500 border-b border-b-green500"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                // variant={"secondary"}
                loading={isPending}
                className=" w-full my-5 bg-green100 hover:bg-green800"
              >
                Continue
              </Button>
            </form>
          </div>
          <p className="font-medium text-neutral800 text-center lg:text-base text-sm">
            By continuing, you accept our{" "}
            <Link to="/terms">
              <span className="border-b border-b-neutral800">Terms of Use</span>{" "}
            </Link>
            and{" "}
            <Link to="/privacy">
              <span className="border-b border-b-neutral800">
                Privacy Policy
              </span>
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
