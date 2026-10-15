import { CheckCircle, Loader2, MapPin, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import AddressMapPreview from "@/components/maps/AddressMapPreview";
import { useGeocodeAddressPreview, useUpdateFranchiseProfile } from "@/queries/franchise/useFranchiseSettings";
import { FranchiseProfile, GeocodePreview } from "@/services/franchise";
import { buildAddressString } from "@/utils/address";

export type ProfileData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  partnerId: string;
  status: "Active" | "Inactive";
  avatarInitials: string;
  avatarBg: string;
};

export const MOCK_PROFILE: ProfileData = {
  fullName: "Adewale Kunle",
  phoneNumber: "0801 234 5678",
  email: "adewale.k@email.com",
  address: "15 Admiralty Way, Lekki Phase 1",
  city: "",
  state: "",
  country: "Nigeria",
  partnerId: "GP-1847",
  status: "Active",
  avatarInitials: "AK",
  avatarBg: "bg-orange-400",
};

type FormFields = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
};

type Prop = {
  data?: ProfileData | FranchiseProfile;
};

type UserProfileResponse = FranchiseProfile & { id?: string };

const getInitials = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";
  return words
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");
};

const normalizeStatus = (status?: string | null): ProfileData["status"] => {
  const s = status?.toLowerCase();
  return s === "active" || s === "published" ? "Active" : "Inactive";
};

const mapUserToProfileData = (data?: ProfileData | UserProfileResponse): ProfileData => {
  if (!data) return MOCK_PROFILE;
  if ("avatarInitials" in data) return data;

  const fullName =
    [data.firstName, data.lastName].filter(Boolean).join(" ").trim() ||
    data.username ||
    "User";

  return {
    fullName,
    phoneNumber: data.phone || data.companyPhone || "",
    email: data.companyEmail || data.email || "",
    address: data.address || "",
    city: data.city || "",
    state: data.state || "",
    country: data.country || "",
    partnerId: data.partnerId || data.franchiseId || data.companyId || data.id || "--",
    status: normalizeStatus(data.status),
    avatarInitials: getInitials(fullName),
    avatarBg: "bg-orange-400",
  };
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
};

const ProfileTab = ({ data }: Prop) => {
  const profileData = useMemo(() => mapUserToProfileData(data), [data]);

  const { mutate: updateProfile, isSuccess, isPending: isSaving } = useUpdateFranchiseProfile();
  const { mutate: geocodeAddress, isPending: isGeocoding } = useGeocodeAddressPreview();

  const [mapPreview, setMapPreview] = useState<GeocodePreview | null>(null);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      email: profileData.email,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      country: profileData.country,
    },
  });

  useEffect(() => {
    reset({
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      email: profileData.email,
      address: profileData.address,
      city: profileData.city,
      state: profileData.state,
      country: profileData.country,
    });
  }, [profileData, reset]);

  // Clear the map preview whenever any address field is edited
  const watchedAddress = watch("address");
  const watchedCity = watch("city");
  const watchedState = watch("state");
  const watchedCountry = watch("country");
  useEffect(() => {
    setMapPreview(null);
    setGeocodeError(null);
  }, [watchedAddress, watchedCity, watchedState, watchedCountry]);

  const handlePreview = () => {
    const { address, city, state, country } = getValues();
    const fullAddress = buildAddressString(address, city, state, country);
    if (!fullAddress) return;

    setGeocodeError(null);
    geocodeAddress(fullAddress, {
      onSuccess: (coords) => setMapPreview(coords),
      onError: () =>
        setGeocodeError(
          "We couldn't locate this address. Please check the details and try again.",
        ),
    });
  };

  const contactFields: {
    label: string;
    field: keyof FormFields;
    placeholder: string;
    type?: string;
  }[] = [
    { label: "Full Name", field: "fullName", placeholder: "Enter full name" },
    { label: "Phone Number", field: "phoneNumber", placeholder: "Enter phone number" },
    { label: "Email", field: "email", placeholder: "Enter email address", type: "email" },
  ];

  const addressFields: {
    label: string;
    field: keyof FormFields;
    placeholder: string;
  }[] = [
    { label: "Street Address", field: "address", placeholder: "e.g. 15 Admiralty Way, Lekki Phase 1" },
    { label: "City", field: "city", placeholder: "e.g. Lagos" },
    { label: "State", field: "state", placeholder: "e.g. Lagos State" },
    { label: "Country", field: "country", placeholder: "e.g. Nigeria" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + identity */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className={`w-14 h-14 rounded-2xl ${profileData.avatarBg} flex items-center justify-center`}>
            <span className="text-white font-bold text-lg tracking-wide">
              {profileData.avatarInitials}
            </span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle size={10} className="text-white" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-bold text-gray-800 text-base">{profileData.fullName}</p>
          <p className="text-xs text-gray-400">Partner ID: {profileData.partnerId}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200 w-fit">
            {profileData.status}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit((formData) => {
          const names = splitName(formData.fullName);
          updateProfile({
            ...names,
            companyEmail: formData.email,
            phone: formData.phoneNumber,
            companyPhone: formData.phoneNumber,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            country: formData.country,
          });
        })}
      >
        {/* Contact fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactFields.map(({ label, field, placeholder, type }) => (
            <div key={field} className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-gray-500">{label}</label>
              <input
                type={type ?? "text"}
                placeholder={placeholder}
                {...register(field, {
                  required: `${label} is required`,
                  ...(field === "email" && {
                    pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email address" },
                  }),
                })}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-300"
              />
              {errors[field] && (
                <p className="text-xs text-red-500">{errors[field]?.message}</p>
              )}
            </div>
          ))}
        </div>

        {/* Business address */}
        <div className="mt-5">
          <div className="flex items-center gap-1.5 mb-3">
            <MapPin size={13} className="text-emerald-500" />
            <p className="text-xs font-semibold text-gray-600">Business Address</p>
            <span className="text-[10px] text-gray-400 ml-1">
              — used to match you with nearby orders
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addressFields.map(({ label, field, placeholder }) => (
              <div key={field} className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-gray-500">{label}</label>
                <input
                  type="text"
                  placeholder={placeholder}
                  {...register(field)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 bg-white outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50 transition-all placeholder-gray-300"
                />
              </div>
            ))}
          </div>

          {/* Preview button */}
          <button
            type="button"
            onClick={handlePreview}
            disabled={isGeocoding}
            className="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isGeocoding ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <MapPin size={12} />
            )}
            {isGeocoding ? "Finding location…" : mapPreview ? "Update preview" : "Preview location on map"}
          </button>

          {/* Error feedback */}
          {geocodeError && (
            <p className="mt-2 text-xs text-red-500">{geocodeError}</p>
          )}

          {/* Map — rendered only after a successful geocode */}
          {mapPreview && (
            <div className="mt-3">
              <AddressMapPreview lat={mapPreview.lat} lng={mapPreview.lng} />
            </div>
          )}
        </div>

        {/* Save */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
              isSuccess
                ? "bg-emerald-400 cursor-default"
                : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            }`}
          >
            {isSuccess ? <CheckCircle size={15} /> : <Save size={15} />}
            {isSaving ? "Saving..." : isSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
