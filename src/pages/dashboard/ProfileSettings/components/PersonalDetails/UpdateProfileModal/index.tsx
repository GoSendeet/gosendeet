import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries } from "@/constants";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useEffect } from "react";
import { updateUserProfile } from "@/services/user";
import { allowOnlyNumbers } from "@/lib/utils";

export function UpdateProfileModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: any;
  data: any;
}) {
  const userId = data?.id ?? "";
  const schema = z.object({
    username: z
      .string({ required_error: "Username is required" })
      .min(1, { message: "Please enter username" }),
    phone: z
      .string({ required_error: "Phone number is required" })
      .regex(/^\+?[0-9]{11,15}$/, {
        message: "Invalid phone number",
      }),
    address: z
      .string({ required_error: "Address is required" })
      .min(1, { message: "Please enter address" }),
    postalCode: z
      .string({ required_error: "Postal code is required" })
      .min(1, { message: "Please enter postal code" }),
    state: z
      .string({ required_error: "State is required" })
      .min(1, { message: "Please enter state" }),
    country: z
      .string({ required_error: "Country is required" })
      .min(1, { message: "Please enter country" }),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (data && open) {
      reset({
        username: data.username ?? "",
        postalCode: data.postalCode ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        state: data.state ?? "",
        country: data.country ?? "",
      });
    }
  }, [data, open, reset]);

  const queryClient = useQueryClient();

  const { mutate: updateProfile, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateUserProfile(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateProfile({
      id: userId,
      data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] font-semibold font-inter mb-2">
          Update Profile
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-neutral600">
          Edit basic details about your profile
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col md:gap-8 gap-4"
            >
              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="name" className="font-inter font-semibold">
                    Username
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("username")}
                      // defaultValue={data?.name}
                      placeholder="Enter username"
                      className="w-full outline-0 border-b-0 py-2 "
                    />
                  </div>
                  {errors.username && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.username.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="phone" className="font-inter font-semibold">
                    Phone Number
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("phone")}
                      // defaultValue={data?.phone}
                      placeholder="Enter phone number"
                      className="w-full outline-0 border-b-0 py-2"
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.phone && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="email" className="font-inter font-semibold">
                    Postal Code
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("postalCode")}
                      // defaultValue={data?.email}
                      placeholder="Enter postal code"
                      className="w-full outline-0 border-b-0 py-2 "
                      onKeyDown={allowOnlyNumbers}
                    />
                  </div>
                  {errors.postalCode && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="address" className="font-inter font-semibold">
                    Address
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("address")}
                      // defaultValue={data?.address}
                      placeholder="Enter your address"
                      className="w-full outline-0 border-b-0 py-2"
                    />
                  </div>
                  {errors.address && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.address.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="state" className="font-inter font-semibold">
                    State
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("state")}
                      // defaultValue={data?.state}
                      placeholder="Enter state"
                      className="w-full outline-0 border-b-0 py-2 "
                    />
                  </div>
                  {errors.state && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.state.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="country" className="font-inter font-semibold">
                    Country
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <Select
                      onValueChange={(val) => setValue("country", val)}
                      value={watch("country")}
                      // defaultValue={data?.country}
                    >
                      <SelectTrigger className="outline-0 focus-visible:border-transparent focus-visible:ring-transparent border-0 w-full py-2 px-0 mt-0">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem value={country.label} key={country.key}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.country && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <Button
                variant={"secondary"}
                className=" w-fit bg-brand text-white "
                loading={pendingUpdate}
              >
                Update
              </Button>
            </form>
          </div>
        </>
      </DialogContent>
    </Dialog>
  );
}
