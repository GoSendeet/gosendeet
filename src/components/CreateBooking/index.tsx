import size from "@/assets/icons/size.png";
import location from "@/assets/icons/location.png";
import { SpecsModal } from "@/components/specs";
import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { allowOnlyNumbers, cn } from "@/lib/utils";
import { getQuotes } from "@/services/user";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { FiPlus, FiSearch } from "react-icons/fi";
import usePlacesAutocomplete from "use-places-autocomplete";
import { useClickAway } from "@/hooks/useClickAway";
import { useLocation } from "react-router-dom";
// import { useGoogleMaps } from "@/hooks/useGoogleMaps";
// import { usePlacesAutocompleteV2 } from "@/hooks/usePlacesAutocompleteV2";

const CreateBooking = ({
  bookingRequest,
  setData,
}: {
  bookingRequest?: any;
  setData?: any;
}) => {
  // useGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_KEY, ["places"]);
  const [open, setOpen] = useState(false);
  const [inputData, setInputData] = useState<any>({});
  // track when we've finished trying to rehydrate inputs (from sessionStorage or bookingRequest)
  const [isHydrated, setIsHydrated] = useState(false);
  const navigate = useNavigate();
  const locationRef = useLocation();
  const isCostCalculator = locationRef.pathname === "/cost-calculator";
  // ✅ separate states
  const [openPickupSuggestions, setOpenPickupSuggestions] = useState(false);
  const [openDestSuggestions, setOpenDestSuggestions] = useState(false);

  // ✅ separate refs
  const pickupRef = useRef<HTMLDivElement>(null!);
  const destRef = useRef<HTMLDivElement>(null!);

  // ✅ separate click-away handlers
  useClickAway(pickupRef, () => setOpenPickupSuggestions(false));
  useClickAway(destRef, () => setOpenDestSuggestions(false));

  const nigeriaAutocompleteOptions = {
    requestOptions: {
      componentRestrictions: { country: "ng" as const },
    },
    debounce: 300,
  };

  const {
    // ready,
    // value: pickupValue,
    suggestions: { status: pickupStatus, data: pickupSuggestions },
    setValue: setPickupValue,
    clearSuggestions: clearPickupSuggestions,
  } = usePlacesAutocomplete(nigeriaAutocompleteOptions);

  const {
    // ready: destReady,
    // value: destValue,
    suggestions: { status: destStatus, data: destSuggestions },
    setValue: setDestValue,
    clearSuggestions: clearDestSuggestions,
  } = usePlacesAutocomplete(nigeriaAutocompleteOptions);

  const {
    mutate: getQuotesDirectly,
    isPending: isQuoteLoading,
    reset: resetQuoteMutation,
  } = useMutation({
    mutationFn: (data: any) => getQuotes(data),
    onSuccess: (data: any) => {
      if (data?.data?.length === 0 && !isCostCalculator) {
        toast.error("No quotes found! Please try a different package type.");
      } else if (data?.data?.length === 0 && isCostCalculator) {
        toast.error("No quotes found! Please try a different package type.");
        navigate("/cost-calculator", {
          state: {
            inputData: inputData,
            results: data,
          },
        });
      } else if (data?.data?.length > 0) {
        toast.success("Successful");
        navigate("/cost-calculator", {
          state: {
            inputData: inputData,
            results: data,
          },
        });
        if (
          window.location.pathname === "/cost-calculator" &&
          typeof setData === "function"
        ) {
          setData(data);
        }
      }
      resetQuoteMutation();
    },
    onError: (data: any) => {
      toast.error(data?.message);
      resetQuoteMutation();
    },
  });

  const { data: packageTypes } = useGetPackageType({ minimize: true });

  const packages = packageTypes?.data;

  const schema = z.object({
    pickupLocation: z
      .string({ required_error: "Pickup location is required" })
      .min(1, { message: "Please enter pickup location" }),
    dropOffLocation: z
      .string({ required_error: "Drop off location is required" })
      .min(1, { message: "Please enter drop off location" }),
    packageTypeId: z
      .string({ required_error: "Package type is required" })
      .min(1, { message: "Please enter package type" }),
    weight: z
      .string({ required_error: "Weight is required" })
      .min(1, { message: "Please enter weight" }),
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
    defaultValues: {
      packageTypeId: bookingRequest
        ? bookingRequest.packageTypeId
        : inputData
        ? inputData.packageTypeId
        : "",
    },
  });

  const packageTypeId = watch("packageTypeId");
  // ----- Helpers -----
  const normalizeData = (data: any) => ({
    ...data,
    packageTypeId: String(data?.packageTypeId ?? ""),
  });

  const saveInputData = (data: any) => {
    const normalized = normalizeData(data);
    setInputData(normalized); // Update local state
    sessionStorage.setItem("bookingInputData", JSON.stringify(normalized));
  };

  // ----- Rehydrate Form -----
  useEffect(() => {
    const stored = sessionStorage.getItem("bookingInputData");
    const storedData = stored ? normalizeData(JSON.parse(stored)) : null;

    if (storedData) {
      setInputData(storedData);
      reset({
        pickupLocation: storedData.pickupLocation ?? "",
        dropOffLocation: storedData.dropOffLocation ?? "",
        packageTypeId: storedData.packageTypeId ?? "",
        weight: storedData.weight ?? "",
      });
    } else if (bookingRequest) {
      const normalized = normalizeData(bookingRequest);
      setInputData(normalized);
      reset(normalized);
    }
    // mark hydration attempt complete (even if nothing was found)
    setIsHydrated(true);
  }, [bookingRequest, reset]);

  // ----- Re-sync packageTypeId when data or packages load -----
  useEffect(() => {
    if (inputData?.packageTypeId && packages?.length > 0) {
      reset((prevValues) => ({
        ...prevValues,
        packageTypeId: String(inputData.packageTypeId),
      }));
    }
  }, [inputData?.packageTypeId, packages, reset]);

  // ----- Handle unauthenticated quick quote -----
  useEffect(() => {
    const isUnauthenticated =
      sessionStorage.getItem("unauthenticated") === "true";
    if (!isUnauthenticated) return;

    const stored = sessionStorage.getItem("bookingInputData");
    if (!stored) return;

    let parsed;
    try {
      parsed = normalizeData(JSON.parse(stored));
    } catch {
      console.error("Invalid bookingInputData in sessionStorage");
      return;
    }

    getQuotesDirectly([
      {
        ...parsed,
        quantity: 1,
        packageDescription: {
          isFragile: false,
          isPerishable: false,
          isExclusive: false,
          isHazardous: false,
        },
      },
    ]);

    sessionStorage.removeItem("unauthenticated");
  }, []);

  // ----- Form Submit -----
  const onSubmit = (data: z.infer<typeof schema>) => {
    saveInputData(data);
  };

  return (
    // don't render the form until we've attempted to rehydrate inputs
    !isHydrated ? null : (
      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={cn(
            isCostCalculator &&
              "flex lg:flex-row lg:items-center flex-col gap-4 w-full"
          )}
        >
          <div
            className={cn(
              isCostCalculator && "grid lg:grid-cols-4 gap-4 w-full"
            )}
          >
            <div className="w-full">
              <div className="flex gap-3 items-center py-2 md:px-4 border-b w-full transition-colors hover:border-purple300">
                <img src={location} alt="location" className="w-[18px]" />
                <div
                  ref={pickupRef}
                  className="flex flex-col gap-2 w-full relative"
                >
                  <label htmlFor="pickup" className="font-clash font-semibold">
                    Pickup Location
                  </label>
                  {/* Pickup Location */}
                  <input
                    type="text"
                    {...register("pickupLocation")}
                    onChange={(e) => {
                      setPickupValue(e.target.value);
                      setValue("pickupLocation", e.target.value, {
                        shouldValidate: true,
                      });
                      setOpenPickupSuggestions(true);
                    }}
                    // disabled={!ready}
                    placeholder="Where from?"
                    className="w-full outline-0"
                  />

                  {pickupStatus === "OK" && openPickupSuggestions && (
                    <ul className="bg-white border rounded shadow-md mt-1 max-h-40 w-full overflow-y-auto absolute top-14 z-10">
                      {pickupSuggestions.map(({ place_id, description }) => (
                        <li
                          key={place_id}
                          onClick={() => {
                            setPickupValue(description, false);
                            setValue("pickupLocation", description, {
                              shouldValidate: true,
                            });
                            clearPickupSuggestions();
                          }}
                          className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                        >
                          {description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {errors.pickupLocation && (
                <p className="error text-xs text-[#FF0000] pl-[45px] my-1">
                  {errors.pickupLocation.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <div className="flex gap-3 items-center py-2 md:px-4 border-b w-full transition-colors hover:border-purple300">
                <img src={location} alt="location" className="w-[18px]" />
                <div
                  ref={destRef}
                  className="flex flex-col gap-2 w-full relative"
                >
                  <label
                    htmlFor="destination"
                    className="font-clash font-semibold"
                  >
                    Destination
                  </label>
                  {/* Destination */}
                  <input
                    type="text"
                    {...register("dropOffLocation")}
                    onChange={(e) => {
                      setDestValue(e.target.value);
                      setValue("dropOffLocation", e.target.value, {
                        shouldValidate: true,
                      });
                      setOpenDestSuggestions(true);
                    }}
                    // disabled={!destReady}
                    placeholder="Where to?"
                    className="w-full outline-0"
                  />
                  {destStatus === "OK" && openDestSuggestions && (
                    <ul className="bg-white border rounded shadow-md mt-1 max-h-40 w-full overflow-y-auto absolute top-14 z-10">
                      {destSuggestions.map(({ place_id, description }) => (
                        <li
                          key={place_id}
                          onClick={() => {
                            setDestValue(description, false);
                            setValue("dropOffLocation", description, {
                              shouldValidate: true,
                            });
                            clearDestSuggestions();
                          }}
                          className="px-2 py-1 cursor-pointer hover:bg-gray-100"
                        >
                          {description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {errors.dropOffLocation && (
                <p className="error text-xs text-[#FF0000] pl-[45px] my-1">
                  {errors.dropOffLocation.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <div className="flex gap-3 items-center py-2 md:px-4 border-b w-full transition-colors hover:border-purple300">
                <img src={size} alt="size" className="w-[18px]" />
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="location"
                    className="font-clash font-semibold"
                  >
                    Package Type
                  </label>

                  <Select
                    onValueChange={(val) => {
                      setValue("packageTypeId", val, {
                        shouldValidate: true,
                      });
                    }}
                    value={packageTypeId} // ✅ force sync with RHF
                    disabled={!packages || packages.length === 0} // disable if not ready
                  >
                    <SelectTrigger className="outline-0 focus-visible:border-transparent focus-visible:ring-transparent border-0 w-full h-6 py-2 px-0 mt-0">
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages?.map((item: any) => (
                        <SelectItem value={String(item.id)} key={item.id}>
                          {item?.name} ({item?.maxWeight} {item?.weightUnit})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {errors.packageTypeId && (
                <p className="error text-xs text-[#FF0000] pl-[45px] my-1">
                  {errors.packageTypeId.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <div className="flex gap-3 items-center py-2 md:px-4 border-b w-full transition-colors hover:border-purple300">
                <img src={size} alt="size" className="w-[18px]" />
                <div className="flex flex-col gap-2 w-full">
                  <label
                    htmlFor="location"
                    className="font-clash font-semibold"
                  >
                    Weight (kg)
                  </label>

                  <input
                    type="text"
                    {...register("weight")}
                    placeholder="Enter weight"
                    className="w-full outline-0"
                    onKeyDown={allowOnlyNumbers}
                  />
                </div>
              </div>
              {errors.weight && (
                <p className="error text-xs text-[#FF0000] pl-[45px] my-1">
                  {errors.weight.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <Button
              type="button"
              variant={"secondary"}
              size={"custom"}
              className="w-full md:px-6 px-2"
              loading={isQuoteLoading}
              onClick={handleSubmit((data) => {
                // form is valid ✅ - get quote directly
                saveInputData(data);
                getQuotesDirectly([
                  {
                    ...data,
                    quantity: 1, // default quantity for quick quote
                    packageDescription: {
                      isFragile: false,
                      isPerishable: false,
                      isExclusive: false,
                      isHazardous: false,
                    },
                  },
                ]);
              })}
            >
              <FiSearch className="text-white transition-transform" />
              <span className="text-white">Quick Quote</span>
            </Button>

            <Button
              type="button"
              size={"custom"}
              className="w-full bg-gray-200 hover:bg-gray-300 md:px-6 px-2 outline-gray-200"
              onClick={handleSubmit((data) => {
                // form is valid ✅ - open modal for additional options
                saveInputData(data);
                setOpen(true);
              })}
            >
              <FiPlus className="text-gray-700 transition-transform" />
              <span className="text-gray-700">More Options</span>
            </Button>
          </div>
        </form>

        <SpecsModal
          open={open}
          setOpen={setOpen}
          inputData={inputData}
          setData={setData}
        />
      </div>
    )
  );
};

export default CreateBooking;
