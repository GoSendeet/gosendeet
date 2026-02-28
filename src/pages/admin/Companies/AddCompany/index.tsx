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
import { AddServiceModal } from "./modals/AddServiceModal";
import { AddPricingModal } from "./modals/AddPricingModal";
import { FiEdit, FiInfo } from "react-icons/fi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompanyPricing,
  deleteCompanyServices,
  updateCompanyStatus,
} from "@/services/companies";
import { toast } from "sonner";
import {
  useGetCompanyPricing,
  useGetCompanyServices,
} from "@/queries/admin/useGetAdminCompanies";
import DeleteModal from "@/components/modals/DeleteModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSolidTrashAlt } from "react-icons/bi";
import { allowOnlyNumbers } from "@/lib/utils";

const AddCompany = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("id") ?? ""; //?id=a3f93a6d-13b6-4684-bef4-171889b1cbc1
  const [openService, setOpenService] = useState(false);
  const [serviceInfo, setServiceInfo] = useState({});

  const [openPricing, setOpenPricing] = useState(false);
  const [pricingInfo, setPricingInfo] = useState({});

  const [type, setType] = useState("");
  const [isHydrated, setIsHydrated] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState<number | null>(null);
  const handleDeleteModal = () => setOpenDeleteModal(null);

  const [openDeletePricingModal, setOpenDeletePricingModal] = useState<
    number | null
  >(null);
  const handleDeletePricingModal = () => setOpenDeletePricingModal(null);

  const { data: company_services } = useGetCompanyServices(companyId);
  const { data: company_pricing } = useGetCompanyPricing(companyId);

  const companyServices = company_services?.data?.content || [];
  const companyPricing = company_pricing?.data?.content || [];

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

  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  const showModal = (id: number) => {
    setActiveModalId((prevId) => (prevId === id ? null : id)); // Toggle modal on/off
  };

  // Close modal on outside click
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // if (isDialogOpen) return; // Skip if dialog is open

      const target = event.target as Node;
      if (modalRef.current && !modalRef.current.contains(target)) {
        setActiveModalId(null); // Close parent modal
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
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
      updateCompanyStatus(status, data), // ✅ call with correct shape

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
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

      if (!id) {
        toast("Failed to get company ID.");
        return;
      }
      if (status === "PUBLISHED") {
        setTimeout(() => {
          updateCompany({
            status: "PUBLISHED",
            data: {
              ids: [id],
            },
          });
        }, 3000);
      }
      reset(data?.data);
      sessionStorage.setItem("companyFormData", JSON.stringify(data?.data));
      const params = new URLSearchParams({ id: id });

      navigate(`?${params.toString()}`);
      queryClient.invalidateQueries({
        queryKey: ["companies"],
      });
    },
    onError: (data) => {
      toast.error(data?.message);
    },
  });

  const { mutate: deleteService, isPending: pendingDeleteService } =
    useMutation({
      mutationFn: (id: string) => deleteCompanyServices(id), // ✅ call with correct shape

      onSuccess: () => {
        toast.success("Successful");
        handleDeleteModal();
        queryClient.invalidateQueries({
          queryKey: ["company_services"],
        });
      },

      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong");
      },
    });

  const handleDeleteService = (id: string) => deleteService(id);

  const { mutate: deletePricing, isPending: pendingDeletePricing } =
    useMutation({
      mutationFn: deleteCompanyPricing, // ✅ call with correct shape

      onSuccess: () => {
        toast.success("Successful");
        handleDeletePricingModal();
        queryClient.invalidateQueries({
          queryKey: ["company_pricing"],
        });
      },

      onError: (error: any) => {
        toast.error(error?.message || "Something went wrong");
      },
    });

  const handleDeletePricing = (id: string) => deletePricing({ ids: [id] });

  const onSubmit = (data: z.infer<typeof schema>) => {
    create(data);
  };

  return (
    <div className="md:px-20 px-6 py-8 bg-neutral100">
      <div className=" flex lg:flex-row flex-col gap-4 justify-between items-center mb-8">
        <div className="flex justify-between items-center lg:w-[57%] w-full">
          <Button
            variant={"ghost"}
            size={"ghost"}
            onClick={() => navigate("/admin-dashboard")}
          >
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
            <form
              // onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5 text-sm"
            >
              <div className="flex flex-col w-full">
                <label htmlFor="name" className="font-inter text-brand font-semibold px-4">
                  Company Name
                </label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("name")}
                    disabled={companyId !== ""}
                    placeholder="Enter company name"
                    className="w-full outline-0 border-b-0 py-2 px-4 "
                  />
                </div>
                {errors.name && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="website"
                  className="font-inter text-brand font-semibold px-4"
                >
                  Company Website
                </label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("website")}
                    disabled={companyId !== ""}
                    placeholder="Enter company website"
                    className="w-full outline-0 border-b-0 py-2 px-4 "
                  />
                </div>
                {errors.website && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.website.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="email"
                  className="font-inter text-brand font-semibold px-4"
                >
                  Company Email
                </label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("email")}
                    disabled={companyId !== ""}
                    placeholder="Enter company email"
                    className="w-full outline-0 border-b-0 py-2 px-4 "
                  />
                </div>
                {errors.email && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="phone"
                  className="font-inter text-brand font-semibold px-4"
                >
                  Company Contact Number
                </label>
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
                {errors.phone && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.phone.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="address"
                  className="font-inter text-brand font-semibold px-4"
                >
                  Company Address
                </label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("address")}
                    disabled={companyId !== ""}
                    placeholder="Enter company address"
                    className="w-full outline-0 border-b-0 py-2 px-4"
                  />
                </div>
                {errors.address && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.address.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="city" className="font-inter text-brand font-semibold px-4">
                  City
                </label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("city")}
                    disabled={companyId !== ""}
                    placeholder="Enter city"
                    className="w-full outline-0 border-b-0 py-2 px-4 "
                  />
                </div>
                {errors.city && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.city.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="state"
                  className="font-inter text-brand font-semibold px-4"
                >
                  State
                </label>
                <div className="flex justify-between items-center gap-2 border-b">
                  <input
                    type="text"
                    {...register("state")}
                    disabled={companyId !== ""}
                    placeholder="Enter state"
                    className="w-full outline-0 border-b-0 py-2 px-4 "
                  />
                </div>
                {errors.state && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.state.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col w-full">
                <label
                  htmlFor="country"
                  className="font-inter text-brand font-semibold px-4"
                >
                  Country
                </label>
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

                  {/* <SelectInput
                variant="bordered"
                labelPlacement="outside"
                size="lg"
                required={true}
                options={countries}
                // selectedKey={country?.name}
                {...register("country")}
                // isLoading={get_all_countries?.isLoading}
                onSelectionChange={(selectedKey: string) => {
                  // Update the form value directly
                  setValue("country", selectedKey);
                }}
              /> */}
                </div>
                {errors.country && (
                  <p className="error text-xs text-[#FF0000] px-4">
                    {errors.country.message}
                  </p>
                )}
              </div>

              {/* <div>
              <p
                className="flex items-center gap-2 text-base cursor-pointer  text-purple500 font-medium "
                onClick={() => setAddNumber(true)}
              >
                <FiEdit />
                Add secondary number
              </p>

              {addNumber && (
                <div className="flex flex-col gap-2 w-full mt-8">
                  <label
                    htmlFor="phone"
                    className="font-inter font-semibold px-4"
                  >
                    Company Secondary Number
                  </label>
                  <div className="flex justify-between items-center gap-2 border-b">
                    <input
                      type="text"
                      {...register("companySecondaryNumber")}
                      value={companySecondaryNumber || ""}
                      onChange={numberOnly("companySecondaryNumber")}
                      placeholder="Enter company secondary number"
                      inputMode="numeric"
                      className="w-full outline-0 border-b-0 py-2 px-4"
                    />

                    <IoClose
                      className="text-red-500 text-2xl"
                      onClick={() => {
                        setAddNumber(false);
                        setValue("companySecondaryNumber", "");
                      }}
                    />
                  </div>
                  {errors.companySecondaryNumber && (
                    <p className="error text-xs text-[#FF0000] px-4">
                      {errors.companySecondaryNumber.message}
                    </p>
                  )}
                </div>
              )}
            </div> */}

              {/* <div>
              <p
                className="flex items-center gap-2 text-base cursor-pointer  text-purple500 font-medium "
                onClick={() => setAddress(true)}
              >
                <FiEdit />
                Add another branch
              </p>

              {address && (
               <div className="flex flex-col gap-2 w-full mt-8">
              <label
                htmlFor="companySecondaryAddress"
                className="font-inter font-semibold px-4"
              >
                Company Secondary Address
              </label>
              <div className="flex justify-between items-center gap-2 border-b">
                <input
                  type="text"
                  {...register("companySecondaryAddress")}
                  placeholder="Enter company secondary address"
                  className="w-full outline-0 border-b-0 py-2 px-4"
                />

                <IoClose
                      className="text-red-500 text-2xl"
                      onClick={() => {
                        setAddress(false);
                        setValue("companySecondaryAddress", "");
                      }}
                    />
              </div>
              {errors.companySecondaryAddress && (
                <p className="error text-xs text-[#FF0000] px-4">
                  {errors.companySecondaryAddress.message}
                </p>
              )}
            </div>
              )}
            </div> */}
            </form>

            {companyId === "" ? (
              <div className="flex gap-4 items-center w-full mt-8 justify-end">
                <Button
                  variant={"outline"}
                  className="md:text-base text-sm bg-brand-light border-brand text-brand"
                  onClick={() => {
                    handleSubmit((data) => {
                      setStatus("DRAFT");
                      onSubmit(data);
                    })();
                  }}
                  loading={pendingCreate && status === "DRAFT"}
                >
                  Save as draft
                </Button>
                <Button
                  variant={"secondary"}
                  className="md:text-base text-sm bg-brand"
                  onClick={() => {
                    handleSubmit((data) => {
                      setStatus("PUBLISHED");
                      onSubmit(data);
                    })();
                  }}
                  loading={pendingCreate && status === "PUBLISHED"}
                >
                  Save and Publish
                </Button>
              </div>
            ) : null}
          </div>
        )}
        <div className="lg:w-1/2 flex flex-col gap-8">
          <div className="w-full border border-neutral700 rounded-2xl px-6 py-10">
            <p className="font-semibold font-inter text-brand">Company Services</p>
            <p className="text-sm mt-4 mb-6">
              Configure your delivery rates by setting up pricing rules for
              diverse package options and service types.
            </p>
            {companyServices && companyServices?.length > 0
              ? companyServices?.map((item: any, index: number) => {
                  const isDeleteModalOpen = openDeleteModal === index;
                  return (
                    <div
                      key={index}
                      className="flex md:flex-row flex-col md:items-center md:gap-4 gap-2 justify-between mb-4"
                    >
                      <p className="bg-purple100 py-2 px-4 font-medium w-fit">
                        {item?.companyServiceLevel?.name}
                      </p>

                      <div className="flex gap-4 items-center">
                        <Button
                          variant={"ghost"}
                          size={"ghost"}
                          className="text-neutral600"
                          onClick={() => {
                            setServiceInfo(item);
                            setOpenService(true);
                            setType("edit");
                          }}
                          disabled={companyId === ""}
                        >
                          <FiEdit size={20} className="cursor-pointer" /> Edit
                        </Button>

                        <Button
                          variant={"ghost"}
                          size={"ghost"}
                          className="text-[#F56630] hover:text-[#F56630]"
                          onClick={() => {
                            setOpenDeleteModal(index);
                          }}
                          disabled={companyId === ""}
                        >
                          <BiSolidTrashAlt
                            size={20}
                            className="cursor-pointer text-[#F56630]"
                          />{" "}
                          Delete
                        </Button>
                        <DeleteModal
                          onOpenChange={(open) => {
                            open
                              ? setOpenDeleteModal(index)
                              : setOpenDeleteModal(null);
                          }}
                          open={isDeleteModalOpen}
                          title={"Delete company service"}
                          data={item.companyServiceLevel.name ?? ""}
                          id={item?.id ?? ""}
                          handleDelete={handleDeleteService}
                          loading={pendingDeleteService}
                        />
                      </div>
                    </div>
                  );
                })
              : null}

            <div className="">
              {companyServices && companyServices?.length > 0 ? (
                <Button
                  variant={"ghost"}
                  size={"ghost"}
                  className="text-purple500"
                  onClick={() => {
                    setType("create");
                    setOpenService(true);
                  }}
                  disabled={companyId === ""}
                >
                  <FiEdit /> Add another service
                </Button>
              ) : (
                <Button
                  variant={"secondary"}
                  onClick={() => {
                    setType("create");
                    setOpenService(true);
                  }}
                  disabled={companyId === ""}
                >
                  <FiEdit /> Add New Service
                </Button>
              )}
            </div>
          </div>
          <div className="w-full h-full  border border-neutral700 rounded-2xl px-6 py-10">
            <p className="font-semibold text-brand font-inter">
              Set Your Delivery Pricing
            </p>
            <p className="text-sm mt-4 mb-6">
              Configure your delivery rates by setting up pricing rules for
              diverse service types.
            </p>

            {companyPricing && companyPricing?.length > 0 && (
              <div className="overflow-auto">
                <div className="min-w-[500px] w-full">
                  <div className="flex justify-between gap-2 text-center px-3 xl:px-4 py-4 text-sm font-inter font-medium bg-purple300 w-full">
                    <span className="w-[25%]">Service level</span>
                    <span className="flex-1">Base Price</span>
                    <span className="flex-1">Weight multiplier</span>
                    <span className="flex-1">Zone multiplier</span>
                    <span className="w-[7%]">% dis</span>

                    <span className="w-[2%]"></span>
                  </div>

                  {companyPricing?.map((item: any, index: number) => {
                    const isDeleteModalOpen = openDeletePricingModal === index;
                    return (
                      <div
                        key={index}
                        className={`relative min-h-[60px] gap-2 text-center bg-white py-2 px-3 xl:px-4 text-sm flex items-center ${
                          index === 0
                            ? "border-t-0"
                            : "border-t border-t-neutral300"
                        } hover:bg-purple300`}
                      >
                        <div className="w-[25%]">
                          <p>{item?.serviceLevel.name}</p>
                        </div>
                        <div className="flex-1">
                          <p># {item?.basePrice}</p>
                        </div>
                        <div className="flex-1">
                          <p>{item?.weightMultiplier}</p>
                        </div>
                        <div className="flex-1">
                          <p>{item?.zoneMultiplier}</p>
                        </div>
                        <div className="w-[7%]">
                          <p>{item?.discountPercent}</p>
                        </div>

                        <div className="w-[2%]">
                          <button className="p-1">
                            <BsThreeDotsVertical
                              size={20}
                              className="p-1 cursor-pointer"
                              onClick={() => showModal(index)}
                            />
                          </button>
                        </div>

                        {/* Modal */}
                        {activeModalId === index && (
                          <>
                            <div
                              className="modal w-fit bg-white shadow-md p-1 rounded-md z-10 absolute top-10 right-0"
                              ref={modalRef}
                            >
                              <p
                                className="flex items-center gap-2 py-1 px-4 hover:bg-purple200 rounded-md cursor-pointer"
                                onClick={() => {
                                  setPricingInfo(item);
                                  setOpenPricing(true);
                                  setType("edit");
                                }}
                              >
                                Edit pricing
                              </p>
                              <p
                                className="flex items-center gap-2 py-1 px-4 hover:bg-purple200 rounded-md cursor-pointer"
                                onClick={() => {
                                  setOpenDeletePricingModal(index);
                                }}
                              >
                                Delete pricing
                              </p>
                            </div>
                          </>
                        )}

                        <DeleteModal
                          open={isDeleteModalOpen}
                          onOpenChange={(open) => {
                            open
                              ? setOpenDeletePricingModal(index)
                              : setOpenDeletePricingModal(null);
                          }}
                          title={"Delete delivery pricing"}
                          data={`pricing for ${item?.serviceLevel?.name}`}
                          id={item.id ?? ""}
                          handleDelete={handleDeletePricing}
                          loading={pendingDeletePricing}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="">
              {companyPricing && companyPricing?.length > 0 ? (
                <Button
                  variant={"ghost"}
                  size={"ghost"}
                  className="text-purple500 mt-4"
                  onClick={() => {
                    setType("create");
                    setOpenPricing(true);
                  }}
                  disabled={companyId === ""}
                >
                  <FiEdit /> Add another pricing
                </Button>
              ) : (
                <>
                  <div className="mb-8">
                    <Button
                      variant={"secondary"}
                      onClick={() => {
                        setType("create");
                        setOpenPricing(true);
                      }}
                      disabled={
                        companyId === "" || companyServices?.length === 0
                      }
                    >
                      <FiEdit /> Add New Custom Pricing
                    </Button>
                  </div>

                  <div className="bg-purple900 w-fit p-4 flex flex-wrap items-center gap-2 rounded-xl">
                    <FiInfo />
                    <p className="text-sm">
                      If no custom pricing is configured, API rates will be used
                      by default.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <AddServiceModal
        companyId={companyId}
        openService={openService}
        setOpenService={setOpenService}
        info={serviceInfo}
        setInfo={setServiceInfo}
        type={type}
      />

      <AddPricingModal
        companyId={companyId}
        openPricing={openPricing}
        setOpenPricing={setOpenPricing}
        type={type}
        info={pricingInfo}
        setPricingInfo={setPricingInfo}
        // companyServiceId={serviceId}
      />
    </div>
  );
};

export default AddCompany;
