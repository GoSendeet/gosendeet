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
import { updateSingleCompany } from "@/services/companies";
import { toast } from "sonner";
import { useEffect } from "react";
import { allowOnlyNumbers } from "@/lib/utils";

export function UpdateCompanyModal({
  open,
  setOpen,
  data,
}: {
  open: boolean;
  setOpen: any;
  data: any;
}) {
  const companyId = data?.id ?? "";
  const schema = z.object({
    name: z
      .string({ required_error: "Company name is required" })
      .min(3, { message: "Please enter company name" }),

    website: z
      .string({ required_error: "Company website is required" })
      .url({ message: "Please enter valid url with https://" })
      .regex(
        /^https?:\/\/[^\s]+\.[a-zA-Z]{2,}(\/.*)?$/,
        "Please enter a valid website domain"
      ),
    email: z
      .string({ required_error: "Company email is required" })
      .email({ message: "Please enter valid email" }),
    phone: z
      .string({ required_error: "Company number is required" })
      .regex(/^(?:\+?[1-9]\d{10,14}|0\d{10})$/, {
        message: "Invalid phone number",
      }),
    address: z
      .string({ required_error: "Company address is required" })
      .min(3, { message: "Please enter company address" }),
    city: z
      .string({ required_error: "City is required" })
      .min(3, { message: "Please enter a valid city" })
      .regex(/^[A-Za-z\s'-]+$/, {
        message: "Please enter a valid city",
      }),
    state: z
      .string({ required_error: "State is required" })
      .min(3, { message: "Please enter state" })
      .regex(/^[A-Za-z\s'-]+$/, {
        message: "Please enter a valid state",
      }),
    country: z
      .string({ required_error: "Country is required" })
      .min(3, { message: "Please enter country" }),
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
        name: data.name ?? "",
        website: data.website ?? "",
        email: data.email ?? "",
        phone: data.phone ?? "",
        address: data.address ?? "",
        city: data.city ?? "",
        state: data.state ?? "",
        country: data.country ?? "",
      });
    }
  }, [data, open, reset]);

  const queryClient = useQueryClient();

  const { mutate: updateCompany, isPending: pendingUpdate } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateSingleCompany(id, data), // ✅ call with correct shape

    onSuccess: () => {
      toast.success("Successful");
      setOpen(false);
      reset();
      queryClient.invalidateQueries({
        queryKey: ["single_company"],
      });
      queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
    },

    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: z.infer<typeof schema>) => {
    updateCompany({
      id: companyId,
      data,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="gap-0">
        <DialogTitle className="text-[20px] text-brand font-semibold font-inter mb-2">
          Update Company Info
        </DialogTitle>
        <DialogDescription className="font-medium text-sm text-brand">
          Edit basic details about the company
        </DialogDescription>
        <>
          <div className="py-4 text-sm mt-4">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-8"
            >
              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="name" className="font-inter text-brand font-semibold">
                    Company Name
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("name")}
                      // defaultValue={data?.name}
                      placeholder="Enter company name"
                      className="w-full outline-0 border-b-0 py-2 "
                    />
                  </div>
                  {errors.name && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="website" className="font-inter text-brand font-semibold">
                    Company Website
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("website")}
                      // defaultValue={data?.website}
                      placeholder="Enter company website"
                      className="w-full outline-0 border-b-0 py-2 "
                    />
                  </div>
                  {errors.website && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.website.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="email" className="font-inter text-brand font-semibold">
                    Company Email
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("email")}
                      // defaultValue={data?.email}
                      placeholder="Enter company email"
                      className="w-full outline-0 border-b-0 py-2 "
                    />
                  </div>
                  {errors.email && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="phone" className="font-inter font-semibold">
                    Company Contact Number
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("phone")}
                      // defaultValue={data?.phone}
                      placeholder="Enter company number"
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
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="address" className="font-inter text-brand font-semibold">
                    Company Address
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("address")}
                      // defaultValue={data?.address}
                      placeholder="Enter company address"
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
                  <label htmlFor="city" className="font-inter text-brand font-semibold">
                    City
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("city")}
                      // defaultValue={data?.city}
                      placeholder="Enter city"
                      className="w-full outline-0 border-b-0 py-2 "
                    />
                  </div>
                  {errors.city && (
                    <p className="error text-xs text-[#FF0000]">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex md:flex-row flex-col gap-4 items-center">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="state" className="font-inter text-brand font-semibold">
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
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="country" className="font-inter text-brand font-semibold">
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
                className="w-fit bg-brand text-white"
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
