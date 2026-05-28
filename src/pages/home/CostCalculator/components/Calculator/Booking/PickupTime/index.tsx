import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Check,
  ChevronDown,
  Clock,
  Gem,
  Snowflake,
  Wine,
} from "lucide-react";
import Layout from "@/layouts/BookingFlowLayout";
import { Button } from "@/components/ui/button";
import { Stepper } from "@/components/ui/stepper";
import { formatDate, parseDateInput } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getQuotes } from "@/services/user";

const bookingSteps = [
  { label: "Route & Package" },
  { label: "Sender & Receiver" },
  { label: "Pickup Time" },
  { label: "Review & Pay" },
];

const inputClasses =
  "w-full rounded-lg border border-[#D0D5DD] bg-white px-4 py-3 text-[#111827] placeholder:text-[#667085] outline-none focus:border-green500 focus:ring-2 focus:ring-green500/20";

const pickupTimeSlots = [
  "10:00 AM - 2:00 PM",
  "2:00 PM - 6:00 PM",
];

const toLocalDateIso = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getDateOptionLabel = (date: Date, index: number) => {
  if (index === 0) return "Today";
  if (index === 1) return "Tomorrow";
  return date.toLocaleDateString("en-US", { weekday: "short" });
};

const formatTimeSlotLabel = (slot: string) =>
  slot.replace(/:00/g, "").replace(/\s/g, "").toLowerCase();

const parsePrice = (price: string | number | undefined | null): number => {
  if (!price) return 0;
  if (typeof price === "number") return price;
  return parseFloat(String(price).replace(/[^\d.]/g, "")) || 0;
};

const normalizeQuotesResponse = (response: any) => {
  if (Array.isArray(response?.data?.content)) return response.data.content;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.content)) return response.content;
  if (Array.isArray(response)) return response;
  return [];
};

const itemValuePresets = [5000, 10000, 20000, 50000, 100000];
const MAX_SUPPORTED_ITEM_VALUE = 100000;

const specialHandlingOptions = [
  { label: "Fragile", value: "Fragile", icon: Wine },
  { label: "Perishable", value: "Perishable", icon: Snowflake },
  { label: "High value", value: "High value", icon: Gem },
  { label: "None", value: "None", icon: Ban },
];

const PickupTime = () => {
  const userId = sessionStorage.getItem("userId") || "";
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingData } = location?.state || {};

  const draftKey = useMemo(
    () =>
      [
        "booking-pickup-draft",
        bookingData?.packageTypeId,
        bookingData?.pickupLocation,
        bookingData?.destination,
        bookingData?.weight,
      ]
        .filter(Boolean)
        .join(":"),
    [
      bookingData?.destination,
      bookingData?.packageTypeId,
      bookingData?.pickupLocation,
      bookingData?.weight,
    ]
  );

  const savedDraft = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(draftKey) || "{}");
    } catch {
      return {};
    }
  }, [draftKey]);

  const [itemValue, setItemValue] = useState(
    String(savedDraft.itemValue ?? bookingData?.itemValue ?? 0)
  );
  const [deliveryInstruction, setDeliveryInstruction] = useState(
    String(savedDraft.deliveryInstruction ?? "")
  );
  const [pickupDate, setPickupDate] = useState(
    String(savedDraft.pickupDate ?? bookingData?.pickupDate ?? toLocalDateIso(new Date()))
  );
  const [pickupTimeSlot, setPickupTimeSlot] = useState(
    String(savedDraft.pickupTimeSlot ?? pickupTimeSlots[0])
  );
  const [specialHandling, setSpecialHandling] = useState(
    String(savedDraft.specialHandling ?? "None")
  );
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [isRepricing, setIsRepricing] = useState(false);

  const pickupDateOptions = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        return {
          date,
          iso: toLocalDateIso(date),
          label: getDateOptionLabel(date, index),
          subLabel: date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        };
      }),
    []
  );
  const itemValueNumber = Number(itemValue) || 0;
  const isItemValueUnsupported = itemValueNumber > MAX_SUPPORTED_ITEM_VALUE;

  useEffect(() => {
    if (!userId) {
      toast.error("Please sign in to continue");
      setTimeout(() => navigate("/signin"), 1000);
    }
  }, [navigate, userId]);

  useEffect(() => {
    if (!bookingData) {
      toast.error("Booking details are missing. Please start again.");
      navigate("/", { replace: true });
    }
  }, [bookingData, navigate]);

  useEffect(() => {
    sessionStorage.setItem(
      draftKey,
      JSON.stringify({
        itemValue,
        deliveryInstruction,
        pickupDate,
        pickupTimeSlot,
        specialHandling,
      })
    );
  }, [
    deliveryInstruction,
    draftKey,
    itemValue,
    pickupDate,
    pickupTimeSlot,
    specialHandling,
  ]);

  const getRepricedBookingData = async (nextBookingData: any) => {
    const nextItemValue = Number(nextBookingData.itemValue) || 0;
    const previousItemValue = Number(
      bookingData?.quotedItemValue ?? bookingData?.itemValue ?? 0
    );

    if (nextItemValue === previousItemValue) return nextBookingData;

    const quotePayload = [
      {
        packageTypeId: nextBookingData.packageTypeId,
        packageName: nextBookingData.packageName,
        pickupLocation: nextBookingData.pickupLocation,
        dropOffLocation: nextBookingData.destination,
        weight: nextBookingData.weight,
        itemValue: nextItemValue,
        quantity: nextBookingData.quantity ?? 1,
        packageDescription: nextBookingData.packageDescription ?? {
          isFragile: specialHandling === "Fragile",
          isPerishable: specialHandling === "Perishable",
          isExclusive: specialHandling === "High value",
          isHazardous: false,
        },
      },
    ];

    const response = await getQuotes(quotePayload, false, {
      page: 0,
      size: 50,
      companyName: nextBookingData.courierName,
    });
    const quotes = normalizeQuotesResponse(response);
    const matchingQuote =
      quotes.find(
        (quote: any) =>
          String(quote?.courier?.id) === String(nextBookingData.companyId) &&
          String(quote?.routeConfigId ?? "") === String(nextBookingData.routeConfigId ?? "") &&
          String(quote?.slaConfigId ?? "") === String(nextBookingData.slaConfigId ?? "")
      ) ||
      quotes.find((quote: any) => String(quote?.courier?.id) === String(nextBookingData.companyId)) ||
      quotes.find((quote: any) => quote?.courier?.name === nextBookingData.courierName);

    if (!matchingQuote) return { ...nextBookingData, quotedItemValue: previousItemValue };

    const basePrice = parsePrice(matchingQuote.price);
    const serviceCharge = matchingQuote.serviceCharge ?? basePrice * 0.005;

    return {
      ...nextBookingData,
      quotedItemValue: nextItemValue,
      courierCost: (basePrice + Number(serviceCharge || 0)).toFixed(2),
      pickupDate: nextBookingData.pickupDate,
      pickupWindow: matchingQuote.pickUpdateDate ?? nextBookingData.pickupWindow,
      estimatedDeliveryDate:
        parseDateInput(matchingQuote.estimatedDeliveryDate) ||
        nextBookingData.estimatedDeliveryDate,
      deliveryWindow: matchingQuote.estimatedDeliveryDate ?? nextBookingData.deliveryWindow,
      companyId: matchingQuote.courier?.id ?? nextBookingData.companyId,
      courierName: matchingQuote.courier?.name ?? nextBookingData.courierName,
      pudoMode: matchingQuote.pudoMode ?? nextBookingData.pudoMode,
      routeConfigId: matchingQuote.routeConfigId ?? nextBookingData.routeConfigId,
      slaConfigId: matchingQuote.slaConfigId ?? nextBookingData.slaConfigId,
    };
  };

  const submit = async () => {
    if (!bookingData) return;

    if (isItemValueUnsupported) {
      toast.error("We currently do not support item values above ₦100,000.");
      return;
    }

    const nextBookingData = {
      ...bookingData,
      pickupDate,
      pickupTimeSlot,
      itemValue: itemValueNumber,
      deliveryInstruction,
      specialHandling,
    };

    sessionStorage.setItem(
      draftKey,
      JSON.stringify({
        itemValue: nextBookingData.itemValue,
        deliveryInstruction,
        pickupDate,
        pickupTimeSlot,
        specialHandling,
      })
    );

    try {
      setIsRepricing(true);
      const repricedBookingData = await getRepricedBookingData(nextBookingData);

      navigate("/checkout", {
        state: { bookingData: repricedBookingData },
      });
    } catch {
      toast.error("Unable to refresh price. Continuing with the current quote.");
      navigate("/checkout", {
        state: {
          bookingData: {
            ...nextBookingData,
            quotedItemValue: Number(
              bookingData?.quotedItemValue ?? bookingData?.itemValue ?? 0
            ),
          },
        },
      });
    } finally {
      setIsRepricing(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:px-6">
        <Stepper steps={bookingSteps} currentStep={3} className="mb-6" />

        <div className="mb-5">
          <div>
            <h1 className="font-clash text-2xl font-semibold leading-130 text-[#111827] sm:text-3xl">
              Pickup preferences
            </h1>
            <p className="mt-1 text-sm text-[#475467]">
              Choose pickup time and add optional delivery notes.
            </p>
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
          <div>
            <section className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green100 text-xs font-semibold text-white">
                  1
                </span>
                <h2 className="font-clash text-base font-semibold text-[#111827]">
                  Pickup schedule
                </h2>
              </div>

              <div className="min-w-0">
                <Popover open={scheduleOpen} onOpenChange={setScheduleOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-4 rounded-xl border border-[#D0D5DD] bg-white px-4 py-3 text-left transition hover:border-green500"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-[#111827]">
                          {formatDate(pickupDate)} · {formatTimeSlotLabel(pickupTimeSlot)}
                        </span>
                        <span className="block truncate text-xs text-[#667085]">
                          Change date or pickup window
                        </span>
                      </span>
                      <ChevronDown className="h-5 w-5 shrink-0 text-[#98A2B3]" />
                    </button>
                  </PopoverTrigger>

                  <PopoverContent
                    side="bottom"
                    align="center"
                    sideOffset={10}
                    avoidCollisions={false}
                    className="w-[min(620px,calc(100vw-32px))] rounded-2xl border border-gray-200 bg-white p-4 shadow-2xl"
                  >
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0F172A]">
                            1. Select date
                          </h3>
                        </div>
                        <div className="grid grid-cols-4 gap-2 sm:grid-cols-7">
                          {pickupDateOptions.map((option) => {
                            const isSelected = pickupDate === option.iso;
                            const day = option.date.getDate();
                            const month = option.date.toLocaleDateString("en-US", {
                              month: "short",
                            });

                            return (
                              <button
                                key={option.iso}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => setPickupDate(option.iso)}
                                className={`relative rounded-xl border px-2 py-2 text-center transition ${
                                  isSelected
                                    ? "border-brand bg-[#F0FDF4] text-brand"
                                    : "border-gray-200 bg-white text-[#667085] hover:border-brand"
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand text-white">
                                    <Check className="h-3 w-3" />
                                  </span>
                                )}
                                <span className="block truncate text-[10px] font-bold uppercase">
                                  {option.label}
                                </span>
                                <span className="block font-clash text-lg font-semibold text-[#0F172A]">
                                  {day}
                                </span>
                                <span className="block text-[11px] font-medium">{month}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-sm font-bold text-[#0F172A]">
                            2. Select time
                          </h3>
                        </div>
                        <div className="grid rounded-xl border border-gray-200 bg-[#F8FAFC] p-1 sm:grid-cols-2">
                          {pickupTimeSlots.map((slot) => {
                            const isSelected = pickupTimeSlot === slot;

                            return (
                              <button
                                key={slot}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => setPickupTimeSlot(slot)}
                                className={`relative rounded-lg px-4 py-2.5 text-center font-clash text-sm font-semibold transition ${
                                  isSelected
                                    ? "bg-white text-brand shadow-sm ring-1 ring-brand"
                                    : "text-[#344054] hover:bg-white"
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute right-2 top-1/2 flex h-4 w-4 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white">
                                    <Check className="h-3 w-3" />
                                  </span>
                                )}
                                {formatTimeSlotLabel(slot)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <Button
                    type="button"
                    size="custom"
                    onClick={() => setScheduleOpen(false)}
                    className="w-full justify-center bg-[#064E3B] py-2.5 font-bold"
                  >
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="mt-2 flex items-center gap-2 rounded-lg border border-green500/20 bg-green500/5 px-3 py-2 text-sm">
                  <Clock className="h-4 w-4 shrink-0 text-green100" />
                  <span className="font-semibold text-green100">Estimated delivery:</span>
                  <span className="min-w-0 truncate text-[#475467]">
                    {bookingData?.deliveryWindow ||
                      formatDate(bookingData?.estimatedDeliveryDate)}
                  </span>
                </div>
              </div>
            </div>
            </section>
          </div>

          <div>
            <section className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-center">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green100 text-xs font-semibold text-white">
                  2
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="font-clash text-base font-semibold leading-6 text-[#111827]">
                    Special handling
                  </h2>
                  <span className="w-fit rounded-full bg-[#F2F4F7] px-2.5 py-1 text-xs font-semibold text-[#667085]">
                    Optional
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-start">
                {specialHandlingOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = specialHandling === option.value;

                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSpecialHandling(option.value)}
                      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                        isSelected
                          ? "border-green500 bg-green500/10 text-green100"
                          : "border-[#D0D5DD] bg-white text-[#344054] hover:border-green500"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
            </section>
          </div>

          <div>
            <section className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green100 text-xs font-semibold text-white">
                  3
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="font-clash text-base font-semibold leading-6 text-[#111827]">
                    Item value
                  </h2>
                  <span className="w-fit rounded-full bg-[#F2F4F7] px-2.5 py-1 text-xs font-semibold text-[#667085]">
                    Optional
                  </span>
                </div>
              </div>

              <div className="min-w-0">
                <input
                  value={itemValue}
                  onChange={(event) => setItemValue(event.target.value.replace(/[^\d.]/g, ""))}
                  inputMode="decimal"
                  className={`${inputClasses} py-2.5 ${
                    isItemValueUnsupported ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
                  }`}
                  placeholder="Enter item price"
                />
                {isItemValueUnsupported && (
                  <p className="mt-2 text-xs font-medium text-red-600">
                    We currently do not support item values above ₦100,000.
                  </p>
                )}
                <div className="mt-2 flex flex-wrap gap-2">
                  {itemValuePresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setItemValue(String(preset))}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                        itemValue === String(preset)
                          ? "border-green500 bg-green500/10 text-green100"
                          : "border-[#D0D5DD] bg-white text-[#667085] hover:border-green500 hover:text-[#111827]"
                      }`}
                    >
                      ₦{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            </section>
          </div>

          <div>
            <section className="rounded-xl border border-[#EAECF0] bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
              <div className="flex items-start gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green100 text-xs font-semibold text-white">
                  4
                </span>
                <div className="flex min-w-0 flex-col gap-1">
                  <h2 className="font-clash text-base font-semibold leading-6 text-[#111827]">
                    Instruction
                  </h2>
                  <span className="w-fit rounded-full bg-[#F2F4F7] px-2.5 py-1 text-xs font-semibold text-[#667085]">
                    Optional
                  </span>
                </div>
              </div>

              <textarea
                value={deliveryInstruction}
                onChange={(event) => setDeliveryInstruction(event.target.value)}
                className={`${inputClasses} min-h-[72px] resize-y py-2.5`}
                placeholder="E.g. Call before arrival, use side gate."
              />
            </div>
            </section>
          </div>

          <div className="mt-2">
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full border-[#D0D5DD] bg-white text-[#111827] hover:border-green500 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              onClick={submit}
              className="w-full rounded-full bg-green100 px-8 py-3 text-white hover:bg-green800 sm:w-auto"
              loading={isRepricing}
              disabled={isRepricing || isItemValueUnsupported}
            >
              Review and continue
              <ArrowRight className="h-4 w-4" />
            </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PickupTime;
