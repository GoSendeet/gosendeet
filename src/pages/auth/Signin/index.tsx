import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import google from "@/assets/icons/google.png";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";
import { googleLogin, validateEmail } from "@/services/auth";
import { toast } from "sonner";
import { useState } from "react";

const Signin = () => {
  const navigate = useNavigate();

  const schema = z.object({
    email: z
      .string({ required_error: "Email Address is required" })
      .min(1, { message: "Email Address cannot be empty" })
      .email({ message: "Invalid email address" })
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: validateEmail,
    onSuccess: (data) => {
      toast.success("Successful");
      navigate("/login", {
        state: {
          username: data?.data?.username,
          email: data?.data?.email,
        },
      });
    },
    onError: (data) => {
      toast.error(data?.message);
      if (data?.message.endsWith(`not found`)) {
        navigate("/signup");
      }
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    mutate(data.email);
  };

  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    googleLogin();
  };

  return (
    <AuthLayout>
      <div className="md:px-20 px-6 md:py-20 py-8">
        <div className="xl:w-1/2 md:w-[80%] mx-auto bg-neutral900 py-12 md:px-10 px-4 rounded-3xl">
          <h1 className="lg:text-[40px] text-[30px] font-semibold font-inter mb-1 tracking-tight">
            Login or Signup
          </h1>
          <p className="font-medium text-neutral800">
            Enter your details to access your account
          </p>

          <Button
            variant={"outline"}
            className="border-neutral500 bg-transparent w-full mt-8 mb-4 hover:bg-white hover:border-0"
            onClick={handleGoogleLogin}
            loading={loading}
          >
            <img src={google} alt="google" className="w-[20px]" />
            <span>Continue with Google</span>
          </Button>

          <p className="text-center font-medium text-neutral800">OR</p>

          <div className="py-4 text-sm">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex gap-3 items-center py-3 md:px-4 border-b mb-5">
                <MdOutlineMailOutline className="text-green500 text-xl" />
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="email" className="font-inter font-semibold">
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

              <Link
                to={"/forgot-password"}
                className="text-green500 border-b border-b-green500 text-base"
              >
                Forgot Password?
              </Link>
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

export default Signin;
