import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useGetPackageType } from "@/queries/admin/useGetAdminSettings";
import { bookingQuoteSchema, defaultValues, normalizeBookingQuoteData, readSavedBookingQuote, type BookingQuoteFormData } from "./quoteFormData";

export interface PackageTypeOption {
  id: string | number;
  name: string;
  code?: string;
  description?: string;
  length?: string | number;
  width?: string | number;
  height?: string | number;
  dimensionUnit?: string;
  maxWeight?: string | number;
  weightUnit?: string;
  imageUrl?: string;
}

interface UseBookingQuoteFormArgs {
  bookingRequest?: any;
}

export const useBookingQuoteForm = ({
  bookingRequest,
}: UseBookingQuoteFormArgs) => {
  const [inputData, setInputData] = useState<BookingQuoteFormData>(defaultValues);
  const [isHydrated, setIsHydrated] = useState(false);
  const [packageName, setPackageName] = useState("");
  const [selectedPackageData, setSelectedPackageData] =
    useState<PackageTypeOption | null>(null);

  const form = useForm<BookingQuoteFormData>({
    resolver: zodResolver(bookingQuoteSchema),
    defaultValues,
  });

  const { reset, setValue } = form;

  const { data: packageTypes } = useGetPackageType({ minimize: true });
  const packages = useMemo<PackageTypeOption[]>(() => {
    if (Array.isArray(packageTypes?.data)) {
      return packageTypes.data as PackageTypeOption[];
    }
    return (packageTypes?.data?.content || []) as PackageTypeOption[];
  }, [packageTypes?.data]);

  const saveInputData = useCallback((data: any) => {
    const normalized = normalizeBookingQuoteData(data);
    setInputData(normalized);
    sessionStorage.setItem("bookingInputData", JSON.stringify(normalized));
    return normalized;
  }, []);

  useEffect(() => {
    const storedData = readSavedBookingQuote();

    if (storedData) {
      setInputData(storedData);
      reset(storedData);
    } else if (bookingRequest) {
      const normalized = normalizeBookingQuoteData(bookingRequest);
      setInputData(normalized);
      reset(normalized);
    }
    setIsHydrated(true);
  }, [bookingRequest, reset]);

  useEffect(() => {
    if (inputData?.packageTypeId && packages.length > 0) {
      setValue("packageTypeId", String(inputData.packageTypeId), {
        shouldValidate: false,
      });

      const pkg = packages.find(
        (item) => String(item.id) === String(inputData.packageTypeId),
      );
      if (pkg) {
        setPackageName(pkg.name);
        setSelectedPackageData(pkg);
      }
    }
  }, [inputData?.packageTypeId, packages, setValue]);

  return {
    form,
    packages,
    inputData,
    isHydrated,
    packageName,
    selectedPackageData,
    setPackageName,
    setSelectedPackageData,
    saveInputData,
  };
};
