import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { AddRoutesModal } from "./modals/AddRoutesModal";
import { FiEdit } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompanyServices,
  updateCompanyStatus,
} from "@/services/companies";
import { toast } from "sonner";
import { useGetCompanyServices } from "@/queries/admin/useGetAdminCompanies";
import DeleteModal from "@/components/modals/DeleteModal";
import { BiSolidTrashAlt } from "react-icons/bi";
import { allowOnlyNumbers } from "@/lib/utils";
import { ImageUpload } from "@/components/ImageUpload";

const AddCompany = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("id") ?? "";
  const [openRoutesModal, setOpenRoutesModal] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});
  const [type, setType] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<number | null>(null);

  const [, setActiveModalId] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);


  const { data: company_services } = useGetCompanyServices(companyId);
  const companyServices = company_services?.data?.content || [];

  const schema = z.object({
    name: z
      .string({ required_error: "Company name is required" })
      .min(3, { message: "Please enter company name" }),
    logo: z.string().url({ message: "Please provide a valid logo URL" }).optional(),
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
      .regex(/^[A-Za-z\s'-]+$/, { message: "Please enter a valid city" }),
    state: z
      .string({ required_error: "State is required" })
      .min(3, { message: "Please enter state" })
      .regex(/^[A-Za-z\s'-]+$/, { message: "Please enter a valid state" }),
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
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        setActiveModalId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (companyId) {
      const stored = sessionStorage.getItem("companyFormData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          reset(parsed);
        } catch (err) {
          console.error("Error parsing stored company data", err);
        }
      }
    }
    setIsHydrated(true);
  }, [companyId, reset]);

  const queryClient = useQueryClient();

  const { mutate: updateCompany } = useMutation({
    mutationFn: ({ status, data }: { status: string; data: any }) =>
      updateCompanyStatus(status, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const { mutate: create, isPending: pendingCreate } = useMutation({
    mutationFn: createCompany,
    onSuccess: (data) => {
      toast.success("Successful");
      const id = data?.data?.id;
      if (!id) { toast("Failed to get company ID."); return; }
      if (status === "PUBLISHED") {
        setTimeout(() => {
          updateCompany({ status: "PUBLISHED", data: { ids: [id] } });
        }, 3000);
      }
      reset(data?.data);
      sessionStorage.setItem("companyFormData", JSON.stringify(data?.data));
      navigate(`?${new URLSearchParams({ id }).toString()}`);
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (data: any) => toast.error(data?.message),
  });

  const { mutate: deleteService, isPending: pendingDeleteService } = useMutation({
    mutationFn: (id: string) => deleteCompanyServices(id),
    onSuccess: () => {
      toast.success("Successful");
      setOpenDeleteModal(null);
      queryClient.invalidateQueries({ queryKey: ["company_services"] });
    },
    onError: (error: any) => toast.error(error?.message || "Something went wrong"),
  });

  const onSubmit = (data: z.infer<typeof schema>) => create(data);

  return (
    <div className="md:px-20 px-6 py-8 bg-neutral100">
      <div className="flex lg:flex-row flex-col gap-4 justify-between items-center mb-8">
        <div className="flex justify-between items-center lg:w-[57%] w-full">
          <Button variant="ghost" size="ghost" onClick={() => navigate("/admin-dashboard")}>
            <FaArrowLeft />
            Back
          </Button>
          <h2 className="font-semibold md:text-[20px] text-brand text-md font-inter">
            Add New Company
          </h2>
        </div>
      </div>

      <div className="flex lg:flex-row flex-col gap-8 justify-between">
        {!isHydrated ? null : (
          <div className="lg:w-1/2 border border-neutral700 rounded-2xl md:px-6 px-4 py-10">
            <form className="flex flex-col gap-5 text-sm">
              <div className="flex flex-col w-full">
                <label className="font-inter text-brand font-semibold px-4">Company Name</label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("name")}
                    disabled={companyId !== ""}
                    placeholder="Enter company name"
                    className="w-full outline-0 border-b-0 py-2 px-4"
                  />
                </div>
                {errors.name && <p className="error text-xs text-[#FF0000] px-4">{errors.name.message}</p>}
              </div>

              <div className="flex flex-col w-full px-4">
                <ImageUpload
                  label="Company Logo"
                  imageUrl={watch("logo")}
                  onUrlChange={(url) => setValue("logo", url, { shouldValidate: true })}
                  error={errors.logo?.message}
                />
              </div>

              <div className="flex flex-col w-full">
                <label className="font-inter text-brand font-semibold px-4">Company Website</label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("website")}
                    disabled={companyId !== ""}
                    placeholder="Enter company website"
                    className="w-full outline-0 border-b-0 py-2 px-4"
                  />
                </div>
                {errors.website && <p className="error text-xs text-[#FF0000] px-4">{errors.website.message}</p>}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-inter text-brand font-semibold px-4">Company Email</label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("email")}
                    disabled={companyId !== ""}
                    placeholder="Enter company email"
                    className="w-full outline-0 border-b-0 py-2 px-4"
                  />
                </div>
                {errors.email && <p className="error text-xs text-[#FF0000] px-4">{errors.email.message}</p>}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-inter text-brand font-semibold px-4">Company Contact Number</label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("phone")}
                    disabled={companyId !== ""}
                    placeholder="Enter company number"
                    className="w-full outline-0 border-b-0 py-2 px-4"
                    onKeyDown={allowOnlyNumbers}
                  />
                </div>
                {errors.phone && <p className="error text-xs text-[#FF0000] px-4">{errors.phone.message}</p>}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-inter text-brand font-semibold px-4">Company Address</label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("address")}
                    disabled={companyId !== ""}
                    placeholder="Enter company address"
                    className="w-full outline-0 border-b-0 py-2 px-4"
                  />
                </div>
                {errors.address && <p className="error text-xs text-[#FF0000] px-4">{errors.address.message}</p>}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-inter text-brand font-semibold px-4">City</label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("city")}
                    disabled={companyId !== ""}
                    placeholder="Enter city"
                    className="w-full outline-0 border-b-0 py-2 px-4"
                  />
                </div>
                {errors.city && <p className="error text-xs text-[#FF0000] px-4">{errors.city.message}</p>}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-inter text-brand font-semibold px-4">State</label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("state")}
                    disabled={companyId !== ""}
                    placeholder="Enter state"
                    className="w-full outline-0 border-b-0 py-2 px-4"
                  />
                </div>
                {errors.state && <p className="error text-xs text-[#FF0000] px-4">{errors.state.message}</p>}
              </div>

              <div className="flex flex-col w-full">
                <label className="font-inter text-brand font-semibold px-4">Country</label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <Select
                    onValueChange={(val) => setValue("country", val)}
                    value={watch("country")}
                    disabled={companyId !== ""}
                  >
                    <SelectTrigger className="outline-0 focus-visible:border-transparent focus-visible:ring-transparent border-0 w-full p-4 mt-0">
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
                {errors.country && <p className="error text-xs text-[#FF0000] px-4">{errors.country.message}</p>}
              </div>
            </form>

            {companyId === "" && (
              <div className="flex gap-4 items-center w-full mt-8 justify-end">
                <Button
                  variant="outline"
                  className="md:text-base text-sm bg-brand-light border-brand text-brand"
                  onClick={() => handleSubmit((data) => { setStatus("DRAFT"); onSubmit(data); })()}
                  loading={pendingCreate && status === "DRAFT"}
                >
                  Save as draft
                </Button>
                <Button
                  variant="secondary"
                  className="md:text-base text-sm bg-brand"
                  onClick={() => handleSubmit((data) => { setStatus("PUBLISHED"); onSubmit(data); })()}
                  loading={pendingCreate && status === "PUBLISHED"}
                >
                  Save and Publish
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="lg:w-1/2 flex flex-col gap-8">
          <div className="w-full border border-neutral700 rounded-2xl px-6 py-10">
            <p className="font-semibold font-inter text-brand">Company Routes</p>
            <p className="text-sm mt-4 mb-6">
              Configure route configs with pricing and SLA details.
            </p>

            {companyServices?.length > 0
              ? companyServices.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 justify-between mb-4"
                >
                  <div className="bg-purple100 py-3 px-4 rounded-lg flex-1">
                    <p className="font-medium">
                      {item?.crossAreaRoute
                        ? `${item.crossAreaRoute.areaA} - ${item.crossAreaRoute.areaB}`
                        : "Route config"}
                    </p>
                    <div className="text-sm text-neutral700 mt-2 space-y-1">
                      <p>
                        <span className="font-medium">Base Price:</span> ₦{item?.basePrice ?? "-"}
                      </p>
                      <p>
                        <span className="font-medium">SLAs:</span>{" "}
                        {item?.slaConfigs?.map((s: any) => s.serviceLevelName).join(", ") || "-"}
                      </p>
                      <p>
                        <span className="font-medium">Package Types:</span>{" "}
                        {item?.packageTypes?.map((p: any) => p.name).join(", ") || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-center">
                    <Button
                      variant="ghost"
                      size="ghost"
                      className="text-neutral600"
                      onClick={() => { setServiceInfo(item); setOpenRoutesModal(true); setType("edit"); }}
                      disabled={companyId === ""}
                    >
                      <FiEdit size={20} /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="ghost"
                      className="text-[#F56630] hover:text-[#F56630]"
                      onClick={() => setOpenDeleteModal(index)}
                      disabled={companyId === ""}
                    >
                      <BiSolidTrashAlt size={20} className="text-[#F56630]" /> Delete
                    </Button>
                    <DeleteModal
                      open={openDeleteModal === index}
                      onOpenChange={(open) => setOpenDeleteModal(open ? index : null)}
                      title="Delete route config"
                      data={item?.crossAreaRoute
                        ? `${item.crossAreaRoute.areaA} - ${item.crossAreaRoute.areaB}`
                        : ""}
                      id={item?.id ?? ""}
                      handleDelete={(id: string) => deleteService(id)}
                      loading={pendingDeleteService}
                    />
                  </div>
                </div>
              ))
              : null}

            <Button
              variant={companyServices?.length > 0 ? "ghost" : "secondary"}
              size={companyServices?.length > 0 ? "ghost" : undefined}
              className={companyServices?.length > 0 ? "text-purple500" : ""}
              onClick={() => { setType("create"); setOpenRoutesModal(true); }}
              disabled={companyId === ""}
            >
              <FiEdit /> {companyServices?.length > 0 ? "Add another route" : "Add New Route"}
            </Button>
          </div>
        </div>
      </div>

      <AddRoutesModal
        companyId={companyId}
        openRoutesModal={openRoutesModal}
        setOpenRoutesModal={setOpenRoutesModal}
        info={serviceInfo}
        setInfo={setServiceInfo}
        type={type}
      />
    </div>
  );
};

export default AddCompany;
