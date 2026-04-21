import { Button } from "@/components/ui/button";
import AuthLayout from "@/layouts/AuthLayout";
import { useForm, Controller } from "react-hook-form";
import google from "@/assets/icons/google.png";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { signup } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { SignupModal } from "./SignupModal";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ShieldCheck,
  Store,
  User,
} from "lucide-react";
import companies from "@/assets/images/companies.png";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { googleSignup } from "@/services/auth";
import { isNonProductionEmailValidationEnv } from "@/utils/environment";
import { createSignupUsername } from "@/utils/username";
import { useSearchParams } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const getInitialUserType = (
  typeParam: string | null,
): "customer" | "franchise" =>
  typeParam === "franchise" ? "franchise" : "customer";

const Signup = () => {
  // remove showFranchiseForm or comment this out to revert to old logic
  const showFranchiseForm =
    import.meta.env.DEV ||
    window.location.hostname
      .toLowerCase()
      .includes("gosendeet-beta.vercel.app");
  const skipEmailValidation = isNonProductionEmailValidationEnv();
  const [searchParams] = useSearchParams();
  const requestedUserType = getInitialUserType(searchParams.get("type"));
  const [userType, setUserType] = useState<"customer" | "franchise">(
    requestedUserType,
  );
  //Remove this isFranchiseComingSoon to revert to old logic
  const isFranchiseComingSoon = userType === "franchise" && !showFranchiseForm;
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const emailSchema = skipEmailValidation
    ? z.string({ required_error: "Email address is required" }).trim().min(1, {
        message: "Email address is required",
      })
    : z
        .string({ required_error: "Email address is required" })
        .trim()
        .email({ message: "Invalid email address" });

  const companyEmailSchema = skipEmailValidation
    ? z.string({ required_error: "Company email is required" }).trim().min(1, {
        message: "Company email is required",
      })
    : z
        .string({ required_error: "Company email is required" })
        .trim()
        .email({ message: "Invalid company email" });

  const customerSchema = z
    .object({
      firstName: z
        .string({ required_error: "First Name is required" })
        .trim()
        .min(1, { message: "First Name name cannot be empty" }),
      lastName: z
        .string({ required_error: "Last Name is required" })
        .trim()
        .min(1, { message: "Last Name cannot be empty" }),
      email: emailSchema,
      phone: z
        .string({ required_error: "Phone number is required" })
        .min(10, { message: "Invalid phone number" }),
      password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),
      confirmPassword: z
        .string({ required_error: "Please confirm your password" })
        .min(8, { message: "Password must be at least 8 characters" }),
      agreedToTerms: z.literal(true, {
        errorMap: () => ({
          message:
            "You must agree to the Terms & Conditions and Privacy Policy",
        }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const franchiseSchema = z
    .object({
      firstName: z
        .string({ required_error: "First Name is required" })
        .trim()
        .min(1, { message: "First Name name cannot be empty" }),
      lastName: z
        .string({ required_error: "Last Name is required" })
        .trim()
        .min(1, { message: "Last Name cannot be empty" }),
      companyName: z
        .string({ required_error: "Company name is required" })
        .trim()
        .min(1, { message: "Company name cannot be empty" }),
      email: emailSchema,
      companyEmail: companyEmailSchema,
      phone: z
        .string({ required_error: "Phone number is required" })
        .min(10, { message: "Invalid phone number" }),
      password: z
        .string({ required_error: "Password is required" })
        .min(8, { message: "Password must be at least 8 characters" }),
      confirmPassword: z
        .string({ required_error: "Please confirm your password" })
        .min(8, { message: "Password must be at least 8 characters" }),
      agreedToTerms: z.literal(true, {
        errorMap: () => ({
          message:
            "You must agree to the Terms & Conditions and Privacy Policy",
        }),
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Passwords do not match",
    });

  const schema =
    userType === "franchise" && showFranchiseForm
      ? franchiseSchema
      : customerSchema;

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(schema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      setOpen(true);
      reset();
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const onSubmit = (data: any) => {
    setEmail(data.email);
    mutate({
      ...data,
      username: createSignupUsername(data.firstName, data.lastName),
      role: userType === "franchise" && showFranchiseForm ? "FRANCHISE" : "USER",
      // USE this role for reverting to old logic
      //role: userType === "franchise" ? "FRANCHISE" : "USER",
    });
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    googleSignup();
  };

  return (
    <AuthLayout>
      <div className="bg-neutral900 md:px-20 px-3.5 py-10 md:py-20 font-arial">
        <div className="flex lg:flex-row flex-col gap-10">
          {/* Left Section */}
          <div className="xl:w-[40%] lg:w-[50%] flex flex-col justify-center self-start lg:sticky lg:top-8">
            {/* Heading */}
            <div className="mb-2 md:mb-8">
              <p className="bg-green300 mb-4 border border-green600 w-fit px-6 py-2 flex items-center gap-2 rounded-full md:text-sm text-xs font-bold shadow-md relative z-10">
                <span className="w-2.5 h-2.5 bg-green700 rounded-full"></span>
                <span className="uppercase text-green800 font-inter">
                  Now Accepting Partners
                </span>
              </p>
              <h1 className="text-2xl lg:text-5xl font-extrabold text-blue100 tracking-tighter leading-tight">
                Join Nigeria's Most <br />
                Trusted <span className="text-green500">Logistics Network</span>
              </h1>
            </div>

            {/* Description */}
            <p className="hidden md:flex text-grey300 text-xl leading-relaxed mb-8 max-w-md">
              Register today to experience reliable deliveries or grow your
              business with our extensive franchise network.
            </p>

            {/* Trust Badge */}
            <div className="hidden md:flex bg-black h-125 relative flex flex-col justify-end items-end bg-signup text-white rounded-2xl p-6 mb-6">
              <div className="absolute inset-0 sign-gradient rounded-2xl z-10"></div>
              <div className="  mb-4 h-fit z-20">
                <h4 className="font-bold mb-2 text-green-500 flex items-start gap-3">
                  <ShieldCheck size={24} /> Secure & Insured
                </h4>
                <p className=" text-white">
                  "Since joining as a partner, our delivery efficiency has
                  improved by 40% across Lagos."
                </p>
              </div>
            </div>

            {/* Trust Count */}
            <div className="hidden md:flex items-center gap-3">
              <img src={companies} alt="companies" />
              <p className="text-grey300">
                Trusted by{" "}
                <span className="font-bold text-blue100">2,000+</span>{" "}
                businesses
              </p>
            </div>
          </div>

          {/* Right Section - Form */}
          <div className="xl:w-[60%] lg:w-[50%] bg-white p-4 flex flex-col rounded-xl">
            <div className=" mx-auto w-full">
              <Button
                type="button"
                variant={"outline"}
                className="border-neutral500 bg-transparent w-full mt-1 mb-4 hover:bg-white hover:border-0"
                onClick={handleGoogleLogin}
                loading={loading}
              >
                <img src={google} alt="google" className="w-[20px]" />
                <span>Continue with Google</span>
              </Button>
              <p className="text-center text-gray-600">OR</p>

              {/* User Type Toggle */}
              <p className="mb-8 text-grey300">Register as a:</p>
              <div className="relative bg-green4000 rounded-2xl p-1 flex mb-8">
                {/* sliding pill */}
                <div
                  className={`absolute inset-y-1.5 bg-white rounded-xl shadow-sm transition-all duration-500 ease-in-out ${
                    userType === "customer"
                      ? "w-[calc(50%-6px)] left-1.5"
                      : "w-[calc(50%-6px)] left-[50%]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setUserType("customer")}
                  className={`relative z-10 flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors duration-500 ${
                    userType === "customer" ? "text-blue100" : "text-grey300"
                  }`}
                >
                  <User size={16} />
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setUserType("franchise")}
                  className={`relative z-10 flex-1 py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors duration-500 ${
                    userType === "franchise" ? "text-blue100" : "text-grey300"
                  }`}
                >
                  <Store size={16} />
                  Franchise
                </button>
              </div>

              {/* Form / Coming Soon - remove isFranchiseComingSoon rapper to revert to old logic  */}
              {isFranchiseComingSoon ? (
                <div className="rounded-2xl border border-green200 bg-green300 p-6">
                  <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-wide text-green800">
                    <Store size={14} />
                    Franchise Partner
                  </p>
                  <h3 className="mt-4 text-2xl font-bold text-blue100">
                    Coming Soon
                  </h3>
                  <p className="mt-2 text-sm text-grey300">
                    Franchise partner onboarding on gosendeet.com will be
                    available soon. Please check back shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setUserType("customer")}
                    className="mt-5 cursor-pointer rounded-xl bg-green100 px-4 py-2 text-sm font-semibold text-white hover:bg-green800"
                  >
                    Continue as Customer
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm  text-blue100 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        {...register("firstName")}
                        placeholder="e.g. Adeola"
                        className="w-full px-4 py-3 border border-grey200 rounded-lg focus:outline-none focus:border-green500"
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500 mt-1">
                          {(errors.firstName as any)?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm  text-blue100 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        {...register("lastName")}
                        placeholder="e.g. Okafor"
                        className="w-full px-4 py-3 border border-grey200 rounded-lg focus:outline-none focus:border-green500"
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500 mt-1">
                          {(errors.lastName as any)?.message}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Email */}
                  <div>
                    <label className="block text-sm  text-blue100 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register("email")}
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 border border-grey200 rounded-lg focus:outline-none focus:border-green500"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-1">
                        {(errors.email as any)?.message}
                      </p>
                    )}
                  </div>

                  {/* remove showFranchiseForm for revert */}
                  {showFranchiseForm && userType === "franchise" && (
                    <>
                      <div>
                        <label className="block text-sm  text-blue100 mb-2">
                          Company Name
                        </label>
                        <input
                          type="text"
                          {...register("companyName" as any)}
                          placeholder="Your company name"
                          className="w-full px-4 py-3 border border-grey200 rounded-lg focus:outline-none focus:border-green500"
                        />
                        {errors?.companyName && (
                          <p className="text-xs text-red-500 mt-1">
                            {(errors.companyName as any)?.message}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  {/* Company Email (Franchise Only) remove showFranchiseForm for revert */}
                  {showFranchiseForm && userType === "franchise" && (
                    <div>
                      <label className="block text-sm  text-blue100 mb-2">
                        Company Email
                      </label>
                      <input
                        type="email"
                        {...register("companyEmail" as any)}
                        placeholder="company@example.com"
                        className="w-full px-4 py-3 border border-grey200 rounded-lg focus:outline-none focus:border-green500"
                      />
                      {errors?.companyEmail && (
                        <p className="text-xs text-red-500 mt-1">
                          {(errors.companyEmail as any)?.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm  text-blue100 mb-2">
                      Phone Number
                    </label>
                    <Controller
                      name="phone"
                      control={control}
                      render={({ field }) => (
                        <PhoneInput
                          country="ng"
                          countryCodeEditable={false}
                          value={field.value}
                          onChange={(value) => field.onChange(value)}
                          inputClass="!w-full !h-full !text-base !bg-transparent"
                          buttonClass="!bg-transparent"
                          containerClass="custom-phone-container"
                          dropdownClass="custom-phone-dropdown"
                          inputStyle={{ border: "none" }}
                        />
                      )}
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-1">
                        {(errors.phone as any)?.message}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm  text-blue100 mb-2">
                      Password
                    </label>
                    <div className="flex items-center gap-2 relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register("password")}
                        placeholder="Min. 8 characters"
                        className="w-full px-4 py-3 border border-grey200 rounded-lg focus:outline-none focus:border-green500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 text-gray-400 -translate-y-1/2 p-0.5 bg-white"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <FiEyeOff size={20} />
                        ) : (
                          <FiEye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-xs text-red-500 mt-1">
                        {(errors.password as any)?.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm  text-blue100 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register("confirmPassword")}
                        placeholder="Repeat password"
                        className="w-full px-4 py-3 border border-grey200 rounded-lg focus:outline-none focus:border-green500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 text-gray-400 -translate-y-1/2 p-0.5 bg-white"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? (
                          <FiEyeOff size={20} />
                        ) : (
                          <FiEye size={20} />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1">
                        {(errors.confirmPassword as any)?.message}
                      </p>
                    )}
                  </div>

                  {/* Terms */}
                  <div className="py-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("agreedToTerms")}
                        className="mt-0.5 w-4 h-4 accent-green-600 cursor-pointer flex-shrink-0"
                      />
                      <span className="text-sm text-grey300">
                        I agree to the{" "}
                        <Link to="/terms">
                          <span className="text-green500 bold hover:underline">
                            Terms & Conditions
                          </span>
                        </Link>{" "}
                        and{" "}
                        <Link to="/privacy">
                          <span className="text-green500 bold hover:underline">
                            Privacy Policy
                          </span>
                        </Link>
                      </span>
                    </label>
                    {errors.agreedToTerms && (
                      <p className="text-xs text-red-500 mt-1">
                        {
                          (errors.agreedToTerms as { message?: string })
                            ?.message
                        }
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    loading={isPending}
                    className="w-full bg-green100 hover:bg-green800 text-white font-bold py-3 rounded-full text-base"
                  >
                    Get Started
                    <ArrowRight size={20} />
                  </Button>
                </form>
              )}

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-grey300 text-sm">
                  Already have an account?{" "}
                  <Link to="/signin">
                    <span className="text-blue100 font-semibold hover:underline">
                      Log In
                    </span>
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SignupModal open={open} setOpen={setOpen} email={email} />
    </AuthLayout>
  );
};

export default Signup;
