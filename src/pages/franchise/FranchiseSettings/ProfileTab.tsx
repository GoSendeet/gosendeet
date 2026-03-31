import { CheckCircle, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserProfile } from "@/services/user";

export type ProfileData = {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
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
  partnerId: "GP-1847",
  status: "Active",
  avatarInitials: "AK",
  avatarBg: "bg-orange-400",
};

type FormFields = Pick<ProfileData, "fullName" | "phoneNumber" | "email">;

type Prop = {
  data?: ProfileData | UserProfileResponse;
};

type UserProfileResponse = {
  id?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  address?: string;
  partnerId?: string;
  franchiseId?: string;
  status?: string;
};

const getInitials = (value: string) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

const normalizeStatus = (status?: string): ProfileData["status"] => {
  return status?.toLowerCase() === "active" ? "Active" : "Inactive";
};

const mapUserToProfileData = (data?: ProfileData | UserProfileResponse): ProfileData => {
  if (!data) return MOCK_PROFILE;

  if ("avatarInitials" in data) {
    return data;
  }

  const fullName =
    [data.firstName, data.lastName].filter(Boolean).join(" ").trim() ||
    data.username ||
    "User";

  return {
    fullName,
    phoneNumber: data.phone || "",
    email: data.email || "",
    address: data.address || "",
    partnerId: data.partnerId || data.franchiseId || data.id || "--",
    status: normalizeStatus(data.status),
    avatarInitials: getInitials(fullName),
    avatarBg: "bg-orange-400",
  };
};

const ProfileTab = ({ data }: Prop) => {
  const profileData = useMemo(() => mapUserToProfileData(data), [data]);
  const userId = "id" in (data || {}) ? (data as UserProfileResponse).id ?? "" : "";
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormFields>({
    defaultValues: {
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      email: profileData.email,
    },
  });

  useEffect(() => {
    reset({
      fullName: profileData.fullName,
      phoneNumber: profileData.phoneNumber,
      email: profileData.email,
    });
  }, [profileData, reset]);

  const { mutate: updateProfile, isSuccess, isPending } = useMutation({
    mutationFn: async (formData: FormFields) => {
      if (!userId) {
        throw new Error("Unable to update profile");
      }

      return updateUserProfile(userId, {
        username: formData.fullName,
        phone: formData.phoneNumber,
        email: formData.email,
      });
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error: any) => {
      toast.error(error?.message || "Something went wrong");
    },
  });

  const fields: { label: string; field: keyof FormFields; placeholder: string; type?: string }[] = [
    { label: "Full Name", field: "fullName", placeholder: "Enter full name" },
    { label: "Phone Number", field: "phoneNumber", placeholder: "Enter phone number" },
    { label: "Email", field: "email", placeholder: "Enter email address", type: "email" },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar + identity */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <div
            className={`w-14 h-14 rounded-2xl ${profileData.avatarBg} flex items-center justify-center`}
          >
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

      {/* Form grid */}
      <form onSubmit={handleSubmit((data) => updateProfile(data))}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(({ label, field, placeholder, type }) => (
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

          {/* Address stays as plain read-only display — not part of editable fields */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500">Address</label>
            <input
              type="text"
              value={profileData.address}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-400 bg-gray-50 outline-none cursor-not-allowed"
            />
          </div>
        </div>

        {/* Save button */}
        <div className="mt-4">
          <button
            type="submit"
            disabled={isPending}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 ${
              isSuccess
                ? "bg-emerald-400 cursor-default"
                : "bg-emerald-500 hover:bg-emerald-600 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            }`}
          >
            {isSuccess ? <CheckCircle size={15} /> : <Save size={15} />}
            {isPending ? "Saving..." : isSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
